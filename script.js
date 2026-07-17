/* ==========================================================================
   FUTURISTIC PREMIUM PORTFOLIO SYSTEM - SCRIPT ENGINE (Vanilla JS)
   No External Libraries / Pure Native Execution
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. STATE & GLOBAL SELECTORS
  // ==========================================================================
  const state = {
    activePage: 'page-home',
    audioPlaying: false,
    orbitIndex: 0,
    orbitInterval: null,
    orbitPaused: false,
    notebookPage: 1,
    totalNotebookPages: 6
  };

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const bgAudio = document.getElementById('bg-audio');
  const audioBtn = document.getElementById('audio-toggle');
  const globalModal = document.getElementById('global-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  // ==========================================================================
  // 2. CUSTOM CURSOR PHYSICS (Desktop)
  // ==========================================================================
  if (window.innerWidth > 900) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover Scaling Trigger
    const interactiveElements = document.querySelectorAll('a, button, .media-card, .orbit-item, .cert-glass-card, .billboard-card, .spiral-card, .hobby-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  // ==========================================================================
  // 3. NAVIGATION ENGINE (Page Switcher & Drawer)
  // ==========================================================================
  function switchPage(pageId) {
    if (pageId === state.activePage) return;

    const currentElem = document.getElementById(state.activePage);
    const targetElem = document.getElementById(pageId);

    if (currentElem) currentElem.classList.remove('active');
    if (targetElem) targetElem.classList.add('active');

    state.activePage = pageId;

    // Synchronize Desktop Sidebar Icons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.getAttribute('data-page') === pageId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Synchronize Mobile Drawer Icons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-page') === pageId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close Mobile Drawer if Open
    const drawer = document.getElementById('mobile-menu');
    if (drawer) drawer.classList.remove('open');
  }

  // Desktop Nav Clicks
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = btn.getAttribute('data-page');
      switchPage(targetPage);
    });
  });

  // Mobile Nav Clicks
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = btn.getAttribute('data-page');
      switchPage(targetPage);
    });
  });

  // Mobile Drawer Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }
  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }

  // ==========================================================================
  // 4. BACKGROUND AUDIO MANAGER
  // ==========================================================================
 // ==========================================================================
  // 4. BACKGROUND AUDIO MANAGER (Auto-play on First Interaction)
  // ==========================================================================
  function startAudio() {
    if (!state.audioPlaying && bgAudio) {
      bgAudio.volume = 0.25; // Soft ambient volume
      bgAudio.play().then(() => {
        if (audioBtn) audioBtn.classList.remove('paused');
        state.audioPlaying = true;
      }).catch(err => {
        console.log("Autoplay waiting for user gesture:", err);
      });
    }
  }

  // Attempt autoplay immediately (works if browser allows)
  startAudio();

  // Trigger autoplay on the user's very first click anywhere on the page
  const enableAudioOnFirstClick = () => {
    startAudio();
    document.removeEventListener('click', enableAudioOnFirstClick);
  };
  document.addEventListener('click', enableAudioOnFirstClick);

  // Manual toggle button handler
  if (audioBtn && bgAudio) {
    audioBtn.addEventListener('click', (e) => {
      // Prevent double triggering from the document click listener
      e.stopPropagation(); 

      if (state.audioPlaying) {
        bgAudio.pause();
        audioBtn.classList.add('paused');
        state.audioPlaying = false;
      } else {
        startAudio();
      }
    });
  }

  // ==========================================================================
  // 5. HIGH-PRECISION DYNAMIC PORTRAIT ASCII ENGINE
  // ==========================================================================
  const asciiTarget = document.getElementById('ascii-face-target');

  if (asciiTarget) {
    // Density scale from dark (dense code characters) to light (spaces)
    const densityChars = ' @N#W$9876543210?!abc;:+=-,._ ';
    const glitchSet = '01{}[]<>/\\*&#$%@';

    const img = new Image();
    // Uses your profile image from assets
    img.src = '56798eb3-219b-46fd-9910-7a25dc6d18a5.jpeg';

    img.onload = () => {
      // Hidden canvas for off-screen pixel processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // High resolution grid for precise facial features (eyes, glasses, jaw, hair)
     // High resolution grid for precise facial features
const width = 80;

// Change the aspect multiplier (0.45) here to adjust generated row count/height
const height = Math.floor(img.height * (width / img.width) * 0.65);
      canvas.width = width;
      canvas.height = height;

      // Draw image to scale on canvas
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;

      let baseAsciiMatrix = [];

      // Convert pixel luminosity to corresponding density character
      for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = imgData[offset];
          const g = imgData[offset + 1];
          const b = imgData[offset + 2];

          // Perceptual brightness formula
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          const charIdx = Math.floor((1 - (brightness / 255)) * (densityChars.length - 1));
          
          row.push(densityChars[charIdx]);
        }
        baseAsciiMatrix.push(row);
      }

      // Render loop with subtle continuous code glitching
      function renderMatrix() {
        const glitchedText = baseAsciiMatrix.map(row => {
          return row.map(ch => {
            // Glitch non-space characters slightly to keep the matrix alive
            if (ch !== ' ' && Math.random() < 0.02) {
              return glitchSet[Math.floor(Math.random() * glitchSet.length)];
            }
            return ch;
          }).join('');
        }).join('\n');

        asciiTarget.textContent = glitchedText;
      }

      renderMatrix();
      // Continuous light code flicker
      setInterval(renderMatrix, 100);
    };

    img.onerror = () => {
      console.warn("Profile image failed to load for ASCII canvas processing. Ensure assets/images/profile.jpg is present.");
    };
  }

  // ==========================================================================
  // 6. HOME GALLERY TABS & LIGHTBOX
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.gallery-tabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = document.getElementById(btn.getAttribute('data-tab'));
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // Lightbox / Modal Handler
  function openModal(contentHtml) {
    if (modalBody && globalModal) {
      modalBody.innerHTML = contentHtml;
      globalModal.classList.add('active');
      pauseAudioForMedia();
    }
  }

  function closeModal() {
    if (globalModal && modalBody) {
      globalModal.classList.remove('active');
      modalBody.innerHTML = '';
      resumeAudioAfterMedia();
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Gallery Card Clicks
  document.querySelectorAll('.media-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('video-card')) {
        const vsrc = card.getAttribute('data-video');
        openModal(`<video src="${vsrc}" controls autoplay style="max-width:100%; max-height:80vh; border-radius:12px;"></video>`);
      } else {
        const isrc = card.getAttribute('data-full');
        openModal(`<img src="${isrc}" style="max-width:100%; max-height:80vh; border-radius:12px; object-fit:contain;">`);
      }
    });
  });

  // Copy phone number to clipboard & show glass toast on click
  const phoneBtn = document.getElementById('phone-copy-btn');
  const phoneToast = document.getElementById('phone-toast');

  if (phoneBtn && phoneToast) {
    phoneBtn.addEventListener('click', () => {
      const phoneNumber = "01326162684";
      navigator.clipboard.writeText(phoneNumber).then(() => {
        phoneToast.classList.add('show');
        setTimeout(() => {
          phoneToast.classList.remove('show');
        }, 3000); // Hides after 3 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ==========================================================================
  // 7. 3D ORBITAL CIRCULAR SKILL SHOWCASE ENGINE (Vertical Tire Spin)
  // ==========================================================================
  const orbitAxis = document.getElementById('orbit-axis');
  const orbitItems = document.querySelectorAll('.orbit-item');
  const orbitSkillTitle = document.getElementById('orbit-skill-title');
  const orbitDescText = document.getElementById('orbit-desc-text');
  const totalItems = orbitItems.length;

  function positionOrbitItems() {
    if (totalItems === 0) return;
    const radius = 140; // Cylinder radius
    const angleStep = (2 * Math.PI) / totalItems;

    orbitItems.forEach((item, index) => {
      const currentAngle = (index - state.orbitIndex) * angleStep;
      const y = Math.sin(currentAngle) * radius;
      const z = Math.cos(currentAngle) * radius;
      const scale = (z + radius) / (2 * radius) * 0.5 + 0.5;
      const opacity = (z + radius) / (2 * radius) * 0.7 + 0.3;

      item.style.transform = `translate3d(0px, ${y}px, ${z}px) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = Math.round(z + radius);

      if (Math.abs(currentAngle % (2 * Math.PI)) < 0.1 || Math.abs(currentAngle) < 0.1) {
        item.classList.add('active-front');
        if (orbitSkillTitle) orbitSkillTitle.textContent = item.getAttribute('data-name');
        if (orbitDescText) orbitDescText.textContent = item.getAttribute('data-desc');
      } else {
        item.classList.remove('active-front');
      }
    });
  }

  function startOrbitAutoRotation() {
    state.orbitInterval = setInterval(() => {
      if (!state.orbitPaused && totalItems > 0) {
        state.orbitIndex = (state.orbitIndex + 1) % totalItems;
        positionOrbitItems();
      }
    }, 3000); // Rotates exactly every 3 seconds
  }

  positionOrbitItems();
  startOrbitAutoRotation();

  // Click Item Pause & Enlarge
  orbitItems.forEach(item => {
    item.addEventListener('click', () => {
      state.orbitPaused = true;
      const index = parseInt(item.getAttribute('data-index'));
      state.orbitIndex = index;
      positionOrbitItems();

      const imgEl = item.querySelector('img');
      const imgSrc = imgEl ? imgEl.src : '';
      const name = item.getAttribute('data-name');
      const desc = item.getAttribute('data-desc');

      openModal(`
        <div style="text-align:center; padding:20px;">
          <img src="${imgSrc}" style="width:100px; height:100px; margin-bottom:15px;">
          <h2 style="color:var(--accent-glow); margin-bottom:10px;">${name}</h2>
          <p style="color:rgba(255,255,255,0.8); max-width:400px; margin:0 auto; line-height:1.6;">${desc}</p>
        </div>
      `);
    });
  });

  // Resume orbit on modal close
  if (modalClose) {
    modalClose.addEventListener('click', () => { state.orbitPaused = false; });
  }

  // ==========================================================================
  // 8. CERTIFICATES GENERATOR (21 Glass Cards)
  // ==========================================================================
  const certGrid = document.getElementById('cert-grid');
  if (certGrid) {
    let certHTML = '';
    for (let i = 1; i <= 21; i++) {
      certHTML += `
        <div class="cert-glass-card">
          <img src="assets/images/cert_thumb.jpg" alt="Certificate ${i}" class="cert-preview-img" onerror="this.src='https://via.placeholder.com/240x140/300015/ffffff?text=Certification+${i}'">
          <h4 style="font-size:0.95rem; margin-bottom:6px; color:var(--accent-white);">Master Certification #${i}</h4>
          <p style="font-size:0.75rem; color:rgba(255,255,255,0.6);">Issued by Global Web Authority</p>
          <div class="cert-btn-group">
            <button class="cert-btn" onclick="window.open('assets/pdf/cert${i}.pdf', '_blank')">Open PDF</button>
            <a class="cert-btn" href="assets/pdf/cert${i}.pdf" download style="text-align:center; text-decoration:none;">Download</a>
          </div>
        </div>
      `;
    }
    certGrid.innerHTML = certHTML;
  }

  // ==========================================================================
  // 9. 3D DICE AUTO-ROTATION ENGINE (College & University)
  // ==========================================================================
  function init3DDice(diceId) {
    const dice = document.getElementById(diceId);
    if (!dice) return;

    let faceAngle = 0;
    setInterval(() => {
      faceAngle += 90;
      dice.style.transform = `rotateY(${faceAngle}deg)`;
    }, 5000); // 360-degree rotation shift every 5 seconds

    dice.addEventListener('click', () => {
      dice.classList.toggle('expanded');
    });
  }

  init3DDice('college-dice');
  init3DDice('university-dice');

  // ==========================================================================
  // 10. PERSONAL NOTEBOOK FLIP ENGINE
  // ==========================================================================
  const nbPrevBtn = document.getElementById('nb-prev-btn');
  const nbNextBtn = document.getElementById('nb-next-btn');
  const nbIndicator = document.getElementById('nb-page-indicator');
  const pages = document.querySelectorAll('.nb-page');

  function updateNotebook() {
    pages.forEach((page, idx) => {
      const pageNum = idx + 1;
      if (pageNum === state.notebookPage) {
        page.classList.add('active');
        page.classList.remove('flipped');
      } else if (pageNum < state.notebookPage) {
        page.classList.remove('active');
        page.classList.add('flipped');
      } else {
        page.classList.remove('active');
        page.classList.remove('flipped');
      }
    });

    if (nbIndicator) {
      nbIndicator.textContent = `Page ${state.notebookPage} of ${state.totalNotebookPages}`;
    }
  }

  if (nbNextBtn) {
    nbNextBtn.addEventListener('click', () => {
      if (state.notebookPage < state.totalNotebookPages) {
        state.notebookPage++;
        updateNotebook();
      }
    });
  }

  if (nbPrevBtn) {
    nbPrevBtn.addEventListener('click', () => {
      if (state.notebookPage > 1) {
        state.notebookPage--;
        updateNotebook();
      }
    });
  }

  // ==========================================================================
  // 11. PERSONAL VIDEO RING CLICK HANDLER
  // ==========================================================================
  document.querySelectorAll('.ring-video-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const vsrc = thumb.getAttribute('data-vsrc');
      openModal(`<video src="${vsrc}" controls autoplay style="max-width:100%; max-height:80vh; border-radius:12px;"></video>`);
    });
  });

});
