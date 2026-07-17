/**
 * AURA OS | Next-Gen Desktop Web Application Engine
 * Pure Vanilla JavaScript (No React, Vue, Angular, jQuery, GSAP, Three.js or external libs)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. CORE SYSTEM APPLICATION STATE
       ========================================================================== */
    const AuraOS = {
        currentPage: 'page-home',
        isAudioPlaying: false,
        activeSkillIndex: 0,
        skillAutoRotateTimer: null,
        uniCarouselIndex: 0,
        uniCarouselTimer: null,
        notebookPage: 1
    };

    /* ==========================================================================
       2. CUSTOM INERTIA DUAL CURSOR SYSTEM (Desktop Only)
       ========================================================================== */
    const cursorDot = document.getElementById('custom-cursor');
    const cursorRing = document.getElementById('custom-cursor-follower');

    if (cursorDot && cursorRing && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate inner dot tracking
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth Physics Loop for Ring Follower
        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Hover Scaling Interactions
        const interactiveSelectors = 'a, button, .insta-card, .skill-node, .cert-card, .masonry-item, .video-card-thumb, .project-card, .interest-card, .notebook-person-card';
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.add('cursor-hover');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                document.body.classList.remove('cursor-hover');
            }
        });
    }

    /* ==========================================================================
       3. AMBIENT AUDIO SYSTEM & AUTOMATIC PAUSE ON MEDIA
       ========================================================================== */
    const ambientAudio = document.getElementById('ambient-audio');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioStatusText = audioToggleBtn ? audioToggleBtn.querySelector('.audio-status-text') : null;

    function toggleAudio(forceState = null) {
        if (!ambientAudio) return;

        const shouldPlay = forceState !== null ? forceState : ambientAudio.paused;

        if (shouldPlay) {
            ambientAudio.play().then(() => {
                AuraOS.isAudioPlaying = true;
                if (audioToggleBtn) audioToggleBtn.classList.add('playing');
                if (audioStatusText) audioStatusText.textContent = 'SOUND: ON';
            }).catch(() => {
                console.log('Autoplay blocked by browser policy. User gesture required.');
            });
        } else {
            ambientAudio.pause();
            AuraOS.isAudioPlaying = false;
            if (audioToggleBtn) audioToggleBtn.classList.remove('playing');
            if (audioStatusText) audioStatusText.textContent = 'SOUND: OFF';
        }
    }

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => toggleAudio());
    }

    /* ==========================================================================
       4. PAGE NAVIGATION & 3D MOBILE DRAWER SWITCHING
       ========================================================================== */
    const navButtons = document.querySelectorAll('.nav-btn[data-target], .mobile-nav-item[data-target]');
    const pages = document.querySelectorAll('.app-page');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function switchPage(targetPageId) {
        if (!targetPageId || targetPageId === AuraOS.currentPage) return;

        pages.forEach(page => {
            if (page.id === targetPageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        navButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetPageId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        AuraOS.currentPage = targetPageId;

        // Close Mobile Menu if Open
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            closeMobileMenu();
        }

        // Trigger specific animations on page entry
        if (targetPageId === 'page-about') {
            initOrbitalSkills();
        } else if (targetPageId === 'page-education') {
            initUniCarousel();
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            switchPage(target);
        });
    });

    // Mobile Drawer Handlers
    function openMobileMenu() {
        if (mobileDrawer) mobileDrawer.classList.add('open');
    }

    function closeMobileMenu() {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
    }

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileDrawer) {
        const backdrop = mobileDrawer.querySelector('.glass-drawer-backdrop');
        if (backdrop) backdrop.addEventListener('click', closeMobileMenu);
    }

    /* ==========================================================================
       5. 3D ORBITAL SKILLS SHOWCASE SYSTEM (Rotates every 3 seconds)
       ========================================================================== */
    const skillNodes = document.querySelectorAll('.skill-node');
    const activeSkillTitle = document.getElementById('active-skill-title');
    const skillDetailBox = document.getElementById('skill-detail-box');
    const skillBoxTitle = document.getElementById('skill-box-title');
    const skillBoxDesc = document.getElementById('skill-box-desc');
    const orbitalRing = document.getElementById('orbital-ring');

    function positionSkillNodes() {
        const totalNodes = skillNodes.length;
        const radius = 130; // Radius in pixels

        skillNodes.forEach((node, index) => {
            const angle = (index / totalNodes) * (2 * Math.PI) - (Math.PI / 2);
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));

            node.style.left = `calc(50% + ${x}px)`;
            node.style.top = `calc(50% + ${y}px)`;
        });
    }

    function updateActiveSkill(index, userClicked = false) {
        AuraOS.activeSkillIndex = index;
        const totalNodes = skillNodes.length;
        const targetAngleDeg = - (index * (360 / totalNodes));

        if (orbitalRing) {
            orbitalRing.style.transform = `rotate(${targetAngleDeg}deg)`;
        }

        skillNodes.forEach((node, idx) => {
            // Counter-rotate node contents to keep icons upright
            const inner = node.querySelector('.node-inner');
            if (inner) inner.style.transform = `rotate(${-targetAngleDeg}deg)`;

            if (idx === index) {
                node.classList.add('active');
                const name = node.getAttribute('data-name');
                const desc = node.getAttribute('data-desc');

                if (activeSkillTitle) activeSkillTitle.textContent = name;
                if (skillBoxTitle) skillBoxTitle.textContent = name;
                if (skillBoxDesc) skillBoxDesc.textContent = desc;
            } else {
                node.classList.remove('active');
            }
        });

        if (userClicked) {
            clearInterval(AuraOS.skillAutoRotateTimer);
            if (skillDetailBox) skillDetailBox.classList.toggle('expanded');
        }
    }

    function initOrbitalSkills() {
        positionSkillNodes();
        updateActiveSkill(0);

        clearInterval(AuraOS.skillAutoRotateTimer);
        AuraOS.skillAutoRotateTimer = setInterval(() => {
            const nextIndex = (AuraOS.activeSkillIndex + 1) % skillNodes.length;
            updateActiveSkill(nextIndex);
        }, 3000);
    }

    skillNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            updateActiveSkill(idx, true);
        });
    });

    /* ==========================================================================
       6. 3D ROTATING UNIVERSITY GALLERY (5-Second Interval)
       ========================================================================== */
    const uniSlides = document.querySelectorAll('.uni-slide');
    const uniPrevBtn = document.getElementById('uni-prev');
    const uniNextBtn = document.getElementById('uni-next');
    const uniIndicator = document.getElementById('uni-indicator');

    function updateUniSlide(index) {
        if (!uniSlides.length) return;
        AuraOS.uniCarouselIndex = (index + uniSlides.length) % uniSlides.length;

        uniSlides.forEach((slide, idx) => {
            if (idx === AuraOS.uniCarouselIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        if (uniIndicator) {
            uniIndicator.textContent = `${AuraOS.uniCarouselIndex + 1} / ${uniSlides.length}`;
        }
    }

    function initUniCarousel() {
        if (!uniSlides.length) return;
        updateUniSlide(0);

        clearInterval(AuraOS.uniCarouselTimer);
        AuraOS.uniCarouselTimer = setInterval(() => {
            updateUniSlide(AuraOS.uniCarouselIndex + 1);
        }, 5000);
    }

    if (uniPrevBtn) {
        uniPrevBtn.addEventListener('click', () => {
            clearInterval(AuraOS.uniCarouselTimer);
            updateUniSlide(AuraOS.uniCarouselIndex - 1);
        });
    }

    if (uniNextBtn) {
        uniNextBtn.addEventListener('click', () => {
            clearInterval(AuraOS.uniCarouselTimer);
            updateUniSlide(AuraOS.uniCarouselIndex + 1);
        });
    }

    /* ==========================================================================
       7. PERSONAL LIFE NOTEBOOK PAGE FLIP ENGINE
       ========================================================================== */
    const paperPages = document.querySelectorAll('.paper-page');
    const turnPageNext = document.getElementById('turn-page-next');
    const turnPagePrev = document.getElementById('turn-page-prev');

    function flipNotebookPage(pageNumber) {
        AuraOS.notebookPage = pageNumber;
        paperPages.forEach(page => {
            if (parseInt(page.getAttribute('data-page'), 10) === pageNumber) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    if (turnPageNext) turnPageNext.addEventListener('click', () => flipNotebookPage(2));
    if (turnPagePrev) turnPagePrev.addEventListener('click', () => flipNotebookPage(1));

    /* ==========================================================================
       8. GLOBAL LIGHTBOX, FULLSCREEN VIDEO & PDF MODALS
       ========================================================================== */
    const imageLightbox = document.getElementById('global-image-lightbox');
    const lightboxImg = document.getElementById('lightbox-target-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    const videoModal = document.getElementById('global-video-modal');
    const videoPlayer = document.getElementById('video-modal-player');
    const videoModalClose = document.getElementById('video-modal-close');

    const pdfModal = document.getElementById('global-pdf-modal');
    const pdfFrame = document.getElementById('pdf-frame');
    const pdfModalClose = document.getElementById('pdf-modal-close');

    // Instagram & Masonry Image Lightbox Triggers
    document.querySelectorAll('.insta-card.image-type, .masonry-item').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src') || item.getAttribute('data-full') || item.querySelector('img').src;
            const caption = item.getAttribute('data-caption') || item.querySelector('img').alt || '';

            if (lightboxImg && imageLightbox) {
                lightboxImg.src = src;
                if (lightboxCaption) lightboxCaption.textContent = caption;
                imageLightbox.classList.add('open');
            }
        });
    });

    // Video Lightbox Triggers
    document.querySelectorAll('.insta-card.video-type, .video-card-thumb').forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-src') || item.getAttribute('data-video-src');

            if (videoPlayer && videoModal) {
                // Pause background music during video playback
                if (AuraOS.isAudioPlaying) toggleAudio(false);

                videoPlayer.src = videoSrc;
                videoModal.classList.add('open');
                videoPlayer.play();
            }
        });
    });

    // PDF Viewer Modal Triggers
    document.querySelectorAll('.pdf-open-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfSrc = btn.getAttribute('data-pdf');
            if (pdfFrame && pdfModal) {
                pdfFrame.src = pdfSrc;
                pdfModal.classList.add('open');
            }
        });
    });

    // Close Lightbox Actions
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => imageLightbox.classList.remove('open'));
    }

    if (videoModalClose) {
        videoModalClose.addEventListener('click', () => {
            videoModal.classList.remove('open');
            if (videoPlayer) {
                videoPlayer.pause();
                videoPlayer.src = '';
            }
            // Resume background ambient audio
            toggleAudio(true);
        });
    }

    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', () => {
            pdfModal.classList.remove('open');
            if (pdfFrame) pdfFrame.src = '';
        });
    }

    // Close Modals on Outer Backdrop Click
    [imageLightbox, videoModal, pdfModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                    if (videoPlayer && modal === videoModal) {
                        videoPlayer.pause();
                        videoPlayer.src = '';
                        toggleAudio(true);
                    }
                    if (pdfFrame && modal === pdfModal) pdfFrame.src = '';
                }
            });
        }
    });

    // Keyboard Accessibility ESC key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageLightbox) imageLightbox.classList.remove('open');
            if (videoModal && videoModal.classList.contains('open')) {
                videoModal.classList.remove('open');
                if (videoPlayer) {
                    videoPlayer.pause();
                    videoPlayer.src = '';
                }
                toggleAudio(true);
            }
            if (pdfModal && pdfModal.classList.contains('open')) {
                pdfModal.classList.remove('open');
                if (pdfFrame) pdfFrame.src = '';
            }
            if (mobileDrawer) closeMobileMenu();
        }
    });

    /* Initialize Home Page default view */
    switchPage('page-home');
});

