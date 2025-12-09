/**
 * Accessibility Enhancement Module
 * Adds keyboard navigation support for course cards and interactive elements
 */

(function() {
    'use strict';

    /**
     * Initialize keyboard navigation for course cards
     */
    function initCourseCardKeyboardNavigation() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            // Make course cards keyboard accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            // Add ARIA label for screen readers
            const courseTitle = card.querySelector('.course-card-title');
            if (courseTitle) {
                const ariaLabel = `View course: ${courseTitle.textContent.trim()}`;
                card.setAttribute('aria-label', ariaLabel);
            }
            
            // Handle keyboard events
            card.addEventListener('keydown', handleCourseCardKeyPress);
        });
    }

    /**
     * Handle keyboard press events on course cards
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleCourseCardKeyPress(event) {
        // Activate on Enter or Space key
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            
            // Find the enrollment link within the card
            const enrollLink = event.currentTarget.querySelector('a[href*="player.html"]');
            if (enrollLink) {
                enrollLink.click();
            }
        }
    }

    /**
     * Enhance button accessibility
     */
    function enhanceButtonAccessibility() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Ensure buttons have proper ARIA attributes
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                console.warn('Button without text or aria-label found:', button);
            }
        });
    }

    /**
     * Add skip to main content link for keyboard users
     */
    function addSkipToMainLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-main';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ID to main content if not exists
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    /**
     * Enhance form accessibility
     */
    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Ensure all inputs have associated labels
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (!label && !input.hasAttribute('aria-label')) {
                    console.warn('Input without label or aria-label:', input);
                }
            });
        });
    }

    /**
     * Initialize all accessibility enhancements
     */
    function initAccessibility() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initCourseCardKeyboardNavigation();
                enhanceButtonAccessibility();
                addSkipToMainLink();
                enhanceFormAccessibility();
            });
        } else {
            initCourseCardKeyboardNavigation();
            enhanceButtonAccessibility();
            addSkipToMainLink();
            enhanceFormAccessibility();
        }

        // Re-initialize when new course cards are added dynamically
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('course-card')) {
                                initCourseCardKeyboardNavigation();
                            } else if (node.querySelectorAll) {
                                const newCards = node.querySelectorAll('.course-card');
                                if (newCards.length > 0) {
                                    initCourseCardKeyboardNavigation();
                                }
                            }
                        }
                    });
                }
            });
        });

        // Observe the course container for changes
        const courseContainer = document.getElementById('popular-courses-container');
        if (courseContainer) {
            observer.observe(courseContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    // Initialize accessibility features
    initAccessibility();

    // Export for testing purposes
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initCourseCardKeyboardNavigation,
            handleCourseCardKeyPress,
            enhanceButtonAccessibility,
            addSkipToMainLink,
            enhanceFormAccessibility
        };
    }
})();
