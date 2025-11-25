// assets/js/offline-sync.js

class OfflineSyncManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Initialize IndexedDB
        this.initDatabase();
        
        // Check for pending sync on startup
        this.checkPendingSync();
    }

    // Initialize IndexedDB for offline storage
    initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BYAMN_Offline', 1);

            request.onerror = () => {
                console.error('Failed to open IndexedDB');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store for sync queue
                if (!db.objectStoreNames.contains('syncQueue')) {
                    const syncStore = db.createObjectStore('syncQueue', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                    syncStore.createIndex('type', 'type', { unique: false });
                }

                // Create object store for course progress
                if (!db.objectStoreNames.contains('courseProgress')) {
                    const progressStore = db.createObjectStore('courseProgress', { 
                        keyPath: ['userId', 'courseId', 'lessonId'] 
                    });
                    progressStore.createIndex('userId', 'userId', { unique: false });
                    progressStore.createIndex('courseId', 'courseId', { unique: false });
                }
            };
        });
    }

    // Add progress update to sync queue
    async queueProgressUpdate(progressData) {
        const syncItem = {
            type: 'progress_update',
            data: progressData,
            timestamp: new Date().toISOString(),
            attempts: 0
        };

        // Store in IndexedDB
        await this.addToSyncQueue(syncItem);
        
        // Try to sync immediately if online
        if (this.isOnline) {
            await this.processSyncQueue();
        } else {
            this.showOfflineNotification();
        }
    }

    // Add item to sync queue in IndexedDB
    addToSyncQueue(item) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            const request = store.add(item);

            request.onsuccess = () => {
                console.log('Item added to sync queue:', item);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Failed to add item to sync queue:', request.error);
                reject(request.error);
            };
        });
    }

    // Process sync queue when online
    async processSyncQueue() {
        if (!this.isOnline) {
            console.log('Device is offline, skipping sync');
            return;
        }

        try {
            const pendingItems = await this.getPendingSyncItems();
            
            for (const item of pendingItems) {
                try {
                    await this.processSyncItem(item);
                    await this.removeFromSyncQueue(item.id);
                    console.log('Successfully synced item:', item);
                } catch (error) {
                    console.error('Failed to sync item:', item, error);
                    await this.updateSyncAttempt(item.id);
                }
            }

            this.showSyncCompleteNotification(pendingItems.length);
        } catch (error) {
            console.error('Error processing sync queue:', error);
        }
    }

    // Get all pending sync items
    getPendingSyncItems() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['syncQueue'], 'readonly');
            const store = transaction.objectStore('syncQueue');
            const index = store.index('timestamp');
            const request = index.getAll();

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Process individual sync item
    async processSyncItem(item) {
        switch (item.type) {
            case 'progress_update':
                await this.syncProgressUpdate(item.data);
                break;
            case 'course_completion':
                await this.syncCourseCompletion(item.data);
                break;
            default:
                console.warn('Unknown sync item type:', item.type);
        }
    }

    // Sync progress update with Firebase
    async syncProgressUpdate(progressData) {
        const { userId, courseId, lessonId, progress, timeSpent } = progressData;
        
        try {
            // Update lesson progress in Firebase
            if (window.firebaseServices && window.firebaseServices.updateLessonProgress) {
                // First, find the enrollment ID
                const enrollments = await window.firebaseServices.getUserEnrollments(userId);
                const enrollment = enrollments.find(e => e.courseId === courseId);
                
                if (enrollment) {
                    await window.firebaseServices.updateLessonProgress(
                        enrollment.id, 
                        lessonId, 
                        progress
                    );
                    
                    // Update analytics
                    await window.firebaseServices.updateLessonAnalytics(
                        userId, 
                        courseId, 
                        lessonId, 
                        timeSpent, 
                        progress === 100
                    );
                }
            }
        } catch (error) {
            console.error('Failed to sync progress update:', error);
            throw error;
        }
    }

    // Sync course completion with Firebase
    async syncCourseCompletion(completionData) {
        const { userId, courseId, certificateId } = completionData;
        
        try {
            // Update course completion in Firebase
            if (window.firebaseServices && window.firebaseServices.updateCourseCompletionAnalytics) {
                await window.firebaseServices.updateCourseCompletionAnalytics(userId, courseId);
                
                // Update enrollment with certificate ID
                const enrollments = await window.firebaseServices.getUserEnrollments(userId);
                const enrollment = enrollments.find(e => e.courseId === courseId);
                
                if (enrollment && window.firebaseServices.updateDoc) {
                    const enrollmentRef = window.firebaseServices.doc(
                        window.firebaseServices.db, 
                        'enrollments', 
                        enrollment.id
                    );
                    
                    await window.firebaseServices.updateDoc(enrollmentRef, {
                        certificateId: certificateId,
                        completedAt: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Failed to sync course completion:', error);
            throw error;
        }
    }

    // Remove item from sync queue after successful sync
    removeFromSyncQueue(itemId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            const request = store.delete(itemId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Update sync attempt count
    updateSyncAttempt(itemId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            const getRequest = store.get(itemId);

            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (item) {
                    item.attempts = (item.attempts || 0) + 1;
                    
                    // Remove if too many attempts
                    if (item.attempts >= 5) {
                        store.delete(itemId);
                    } else {
                        store.put(item);
                    }
                }
                resolve();
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    // Store course progress locally
    async storeLocalProgress(userId, courseId, lessonId, progress, timeSpent = 0) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['courseProgress'], 'readwrite');
            const store = transaction.objectStore('courseProgress');
            
            const progressData = {
                userId: userId,
                courseId: courseId,
                lessonId: lessonId,
                progress: progress,
                timeSpent: timeSpent,
                lastUpdated: new Date().toISOString()
            };

            const request = store.put(progressData);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get local progress for a course
    async getLocalProgress(userId, courseId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['courseProgress'], 'readonly');
            const store = transaction.objectStore('courseProgress');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => {
                const allProgress = request.result || [];
                const courseProgress = allProgress.filter(p => p.courseId === courseId);
                resolve(courseProgress);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Event handlers
    handleOnline() {
        this.isOnline = true;
        console.log('Device is online, processing sync queue...');
        this.showOnlineNotification();
        this.processSyncQueue();
    }

    handleOffline() {
        this.isOnline = false;
        console.log('Device is offline, storing progress locally...');
        this.showOfflineNotification();
    }

    // Check for pending sync on startup
    async checkPendingSync() {
        const pendingItems = await this.getPendingSyncItems();
        if (pendingItems.length > 0 && this.isOnline) {
            console.log(`Found ${pendingItems.length} pending sync items`);
            this.processSyncQueue();
        }
    }

    // Notification methods
    showOfflineNotification() {
        if (window.utils && window.utils.showNotification) {
            window.utils.showNotification(
                'You are offline. Progress will be saved locally and synced when you reconnect.',
                'warning'
            );
        }
    }

    showOnlineNotification() {
        if (window.utils && window.utils.showNotification) {
            window.utils.showNotification(
                'You are back online! Syncing your progress...',
                'success'
            );
        }
    }

    showSyncCompleteNotification(syncedItems) {
        if (syncedItems > 0 && window.utils && window.utils.showNotification) {
            window.utils.showNotification(
                `Successfully synced ${syncedItems} progress updates!`,
                'success'
            );
        }
    }

    // Get sync status for UI
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            hasPendingSync: this.syncQueue.length > 0
        };
    }
}

// Initialize and export the sync manager
const offlineSyncManager = new OfflineSyncManager();
window.offlineSyncManager = offlineSyncManager;