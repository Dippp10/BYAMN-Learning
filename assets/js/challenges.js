// Learning Challenges System
class LearningChallenges {
    constructor() {
        this.currentChallenges = [];
        this.userProgress = {};
        this.initializeChallenges();
    }

    initializeChallenges() {
        // Weekly Challenges
        this.currentChallenges = [
            {
                id: 'weekly_lesson_streak',
                title: '7-Day Learning Streak',
                description: 'Complete at least one lesson every day for 7 consecutive days',
                type: 'weekly',
                goal: 7,
                unit: 'days',
                reward: 'Streak Master Badge',
                icon: '🔥',
                progress: 0,
                expires: this.getNextWeekDate()
            },
            {
                id: 'weekly_course_completion',
                title: 'Course Completion Champion',
                description: 'Complete 2 courses this week',
                type: 'weekly',
                goal: 2,
                unit: 'courses',
                reward: 'Completion Expert Badge',
                icon: '🏆',
                progress: 0,
                expires: this.getNextWeekDate()
            },
            {
                id: 'weekly_study_time',
                title: 'Study Marathon',
                description: 'Spend 5 hours learning this week',
                type: 'weekly',
                goal: 5,
                unit: 'hours',
                reward: 'Dedicated Learner Badge',
                icon: '⏰',
                progress: 0,
                expires: this.getNextWeekDate()
            },
            {
                id: 'monthly_community',
                title: 'Community Contributor',
                description: 'Share 3 certificates or achievements this month',
                type: 'monthly',
                goal: 3,
                unit: 'shares',
                reward: 'Community Star Badge',
                icon: '🌟',
                progress: 0,
                expires: this.getNextMonthDate()
            }
        ];

        this.loadUserProgress();
    }

    getNextWeekDate() {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
    }

    getNextMonthDate() {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
    }

    loadUserProgress() {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        const savedProgress = localStorage.getItem(`challenges_progress_${userId}`);
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
            this.updateChallengesProgress();
        }
    }

    saveUserProgress() {
        const userId = this.getCurrentUserId();
        if (userId) {
            localStorage.setItem(`challenges_progress_${userId}`, JSON.stringify(this.userProgress));
        }
    }

    getCurrentUserId() {
        // Get current user ID from Firebase or session
        if (typeof firebaseServices !== 'undefined' && firebaseServices.auth) {
            const user = firebaseServices.auth.currentUser;
            return user ? user.uid : 'guest';
        }
        return 'guest';
    }

    updateChallengesProgress() {
        // Update progress for each challenge based on user activity
        this.currentChallenges.forEach(challenge => {
            if (this.userProgress[challenge.id]) {
                challenge.progress = this.userProgress[challenge.id].progress || 0;
            }
        });
    }

    recordActivity(activityType, value = 1) {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        // Initialize user progress if not exists
        if (!this.userProgress[userId]) {
            this.userProgress[userId] = {};
        }

        // Update relevant challenges based on activity type
        this.currentChallenges.forEach(challenge => {
            if (this.shouldUpdateChallenge(challenge, activityType)) {
                this.updateChallengeProgress(challenge.id, value);
            }
        });

        this.saveUserProgress();
        this.checkChallengeCompletion();
    }

    shouldUpdateChallenge(challenge, activityType) {
        const activityMap = {
            'weekly_lesson_streak': 'lesson_complete',
            'weekly_course_completion': 'course_complete',
            'weekly_study_time': 'study_time',
            'monthly_community': 'certificate_share'
        };

        return activityMap[challenge.id] === activityType;
    }

    updateChallengeProgress(challengeId, value) {
        const userId = this.getCurrentUserId();
        if (!this.userProgress[userId][challengeId]) {
            this.userProgress[userId][challengeId] = {
                progress: 0,
                completed: false,
                completedAt: null
            };
        }

        if (!this.userProgress[userId][challengeId].completed) {
            this.userProgress[userId][challengeId].progress += value;
            
            // Update the current challenges array
            const challenge = this.currentChallenges.find(c => c.id === challengeId);
            if (challenge) {
                challenge.progress = this.userProgress[userId][challengeId].progress;
            }
        }
    }

    checkChallengeCompletion() {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        this.currentChallenges.forEach(challenge => {
            const progress = this.userProgress[userId][challenge.id];
            if (progress && !progress.completed && progress.progress >= challenge.goal) {
                this.completeChallenge(challenge.id);
            }
        });
    }

    completeChallenge(challengeId) {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        this.userProgress[userId][challengeId].completed = true;
        this.userProgress[userId][challengeId].completedAt = new Date().toISOString();

        // Show celebration
        this.showChallengeCompletion(challengeId);
        
        this.saveUserProgress();
        
        // Update analytics
        this.trackChallengeCompletion(challengeId);
    }

    showChallengeCompletion(challengeId) {
        const challenge = this.currentChallenges.find(c => c.id === challengeId);
        if (!challenge) return;

        // Create celebration notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm challenge-completion-notification';
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="text-2xl mr-3">🎉</div>
                <div>
                    <h3 class="font-bold text-lg">Challenge Completed!</h3>
                    <p class="text-sm opacity-90">${challenge.title}</p>
                    <p class="text-xs mt-1">Reward: ${challenge.reward}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Add celebration animation
        this.createConfetti();
    }

    createConfetti() {
        // Simple confetti effect
        const confettiCount = 50;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'fixed w-2 h-2 rounded-full z-40 confetti-particle';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.opacity = '0.8';
                
                document.body.appendChild(confetti);
                
                // Animate
                confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
                }).onfinish = () => confetti.remove();
            }, i * 50);
        }
    }

    trackChallengeCompletion(challengeId) {
        // Track challenge completion in analytics
        if (typeof firebaseServices !== 'undefined' && firebaseServices.analytics) {
            firebaseServices.logEvent('challenge_completed', {
                challenge_id: challengeId,
                user_id: this.getCurrentUserId(),
                timestamp: new Date().toISOString()
            });
        }
    }

    getProgressPercentage(challenge) {
        return Math.min(100, (challenge.progress / challenge.goal) * 100);
    }

    formatExpiryDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    isChallengeExpired(challenge) {
        return new Date() > new Date(challenge.expires);
    }

    getActiveChallenges() {
        return this.currentChallenges.filter(challenge => !this.isChallengeExpired(challenge));
    }

    getUserStats() {
        const userId = this.getCurrentUserId();
        if (!userId || !this.userProgress[userId]) {
            return { completed: 0, inProgress: 0, total: 0 };
        }

        const userChallenges = Object.values(this.userProgress[userId]);
        const completed = userChallenges.filter(c => c.completed).length;
        const inProgress = userChallenges.filter(c => !c.completed && c.progress > 0).length;

        return {
            completed,
            inProgress,
            total: this.currentChallenges.length
        };
    }
}

// Initialize challenges system
let learningChallenges;

document.addEventListener('DOMContentLoaded', function() {
    learningChallenges = new LearningChallenges();
    
    // Initialize challenges UI if on dashboard
    if (document.getElementById('challenges-section')) {
        initializeChallengesUI();
    }
});

function initializeChallengesUI() {
    renderChallengesSection();
    
    // Update challenges every minute to check for expiry
    setInterval(updateChallengesDisplay, 60000);
}

function renderChallengesSection() {
    const container = document.getElementById('challenges-section');
    if (!container) return;

    const stats = learningChallenges.getUserStats();
    const activeChallenges = learningChallenges.getActiveChallenges();

    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Learning Challenges</h2>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span class="flex items-center">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        ${stats.completed} Completed
                    </span>
                    <span class="flex items-center">
                        <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        ${stats.inProgress} In Progress
                    </span>
                </div>
            </div>

            ${activeChallenges.length === 0 ? `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">🎯</div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">No Active Challenges</h3>
                    <p class="text-gray-600">New challenges will appear soon!</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${activeChallenges.map(challenge => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${learningChallenges.isChallengeExpired(challenge) ? 'opacity-60' : ''}">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center">
                                    <span class="text-2xl mr-3">${challenge.icon}</span>
                                    <div>
                                        <h3 class="font-semibold text-gray-900">${challenge.title}</h3>
                                        <p class="text-sm text-gray-600">Expires ${learningChallenges.formatExpiryDate(challenge.expires)}</p>
                                    </div>
                                </div>
                                ${challenge.progress >= challenge.goal ? `
                                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                                ` : ''}
                            </div>
                            
                            <p class="text-sm text-gray-700 mb-3">${challenge.description}</p>
                            
                            <div class="mb-3">
                                <div class="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>${challenge.progress}/${challenge.goal} ${challenge.unit}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                                         style="width: ${learningChallenges.getProgressPercentage(challenge)}%"></div>
                                </div>
                            </div>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500">Reward: ${challenge.reward}</span>
                                ${challenge.progress >= challenge.goal ? `
                                    <span class="text-green-600 text-sm font-medium">🎉 Claimed!</span>
                                ` : `
                                    <span class="text-blue-600 text-sm font-medium">${Math.max(0, challenge.goal - challenge.progress)} ${challenge.unit} to go</span>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}

            <div class="mt-6 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm text-gray-600">
                    <span>Complete challenges to earn badges and track your learning journey!</span>
                    <button onclick="showAllChallenges()" class="text-blue-600 hover:text-blue-800 font-medium">
                        View All Challenges →
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateChallengesDisplay() {
    renderChallengesSection();
}

function showAllChallenges() {
    // This would open a modal or navigate to a full challenges page
    alert('Full challenges view coming soon!');
}

// Export for use in other files
window.learningChallenges = learningChallenges;