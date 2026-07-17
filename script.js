/**
 * SHADID AHAMED - Production Modular Web Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  init() {
    Cursor.init();
    Navigation.init();
    AudioEngine.init();
    OrbitalSkills.init();
    DiceSlider.init();
    Notebook.init();
    FamilyTree.init();
    Achievements.init();
    GalleryTabs.init();
    Lightbox.init();
  }
};

/* ==========================================================================
   CUSTOM CURSOR ENGINE
   ========================================================================== */
const Cursor = {
  init() {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    if (window.innerWidth <= 768) return; // Desktop only

    window.addEventListener("mousemove", (e) => {
      const { clientX: x, clientY: y } = e;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      ring.animate(
        { left: `${x}px`, top: `${y}px` },
        { duration: 500, fill: "forwards" }
      );
    });

    const interactiveSelectors = "a, button, .media-card, .orbit-item, .social-btn";
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }
};

/* ==========================================================================
   NAVIGATION ENGINE (SINGLE PAGE APPLICATION)
   ========================================================================== */
const Navigation = {
  init() {
    const navBtns = document.querySelectorAll(".nav-btn, .drawer-btn");
    const pages = document.querySelectorAll(".page-view");
    const mobileDrawer = document.getElementById("mobile-menu");
    const mobileToggle = document.getElementById("mobile-toggle");

    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const pageId = btn.getAttribute("data-page");

        navBtns.forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach((b) => b.classList.add("active"));

        pages.forEach((p) => {
          if (p.id === `page-${pageId}`) {
            p.classList.add("active");
          } else {
            p.classList.remove("active");
          }
        });

        if (mobileDrawer.classList.contains("open")) {
          mobileDrawer.classList.remove("open");
        }
      });
    });

    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        mobileDrawer.classList.toggle("open");
      });
    }

    // Phone trigger interaction
    const phoneBtn = document.getElementById("phone-trigger");
    const phoneTooltip = document.getElementById("phone-display");
    if (phoneBtn) {
      phoneBtn.addEventListener("click", () => {
        phoneTooltip.classList.toggle("hidden");
      });
    }
  }
};

/* ==========================================================================
   AUDIO ENGINE
   ========================================================================== */
const AudioEngine = {
  audio: null,
  init() {
    this.audio = document.getElementById("bg-audio");
    if (this.audio) {
      this.audio.volume = 0.2;
      // Auto-play attempt on user first interaction
      window.addEventListener("click", () => {
        if (this.audio.paused) {
          this.audio.play().catch(() => {});
        }
      }, { once: true });
    }
  },
  pause() {
    if (this.audio && !this.audio.paused) this.audio.pause();
  },
  resume() {
    if (this.audio && this.audio.paused) this.audio.play().catch(() => {});
  }
};

/* ==========================================================================
   3D ORBITAL SKILLS SHOWCASE
   ========================================================================== */
const OrbitalSkills = {
  items: [],
  container: null,
  angle: 0,
  speed: (2 * Math.PI) / 33, // 11 items, 3s each = 33s full turn
  interval: null,
  isPaused: false,

  init() {
    this.container = document.getElementById("orbital-container");
    if (!this.container) return;
    this.items = Array.from(this.container.querySelectorAll(".orbit-item"));
    
    this.positionItems();
    this.startRotation();

    this.items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.pauseAndEnlarge(item);
      });
    });

    document.addEventListener("click", () => {
      if (this.isPaused) this.resumeRotation();
    });
  },

  positionItems() {
    const radius = 110;
    const total = this.items.length;
    
    this.items.forEach((item, idx) => {
      const currentAngle = this.angle + (idx * (2 * Math.PI / total));
      const x = Math.cos(currentAngle) * radius;
      const y = Math.sin(currentAngle) * radius;
      
      item.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(currentAngle) * 0.2})`;
      item.style.opacity = `${0.4 + (Math.sin(currentAngle) + 1) * 0.3}`;
    });

    // Update center title based on top element
    const currentIdx = Math.floor(((( -this.angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)) / (2 * Math.PI / total)) % total;
    const currentItem = this.items[currentIdx];
    if (currentItem) {
      document.getElementById("orbit-skill-title").innerText = currentItem.getAttribute("data-name");
    }
  },

  startRotation() {
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.angle -= 0.01;
        this.positionItems();
      }
    }, 50);
  },

  pauseAndEnlarge(item) {
    this.isPaused = true;
    const title = item.getAttribute("data-name");
    const desc = item.getAttribute("data-desc");

    const ghost = document.getElementById("ghost-skill-card");
    document.getElementById("ghost-title").innerText = title;
    document.getElementById("ghost-desc").innerText = desc;
    ghost.classList.remove("hidden");
  },

  resumeRotation() {
    this.isPaused = false;
    document.getElementById("ghost-skill-card").classList.add("hidden");
  }
};

/* ==========================================================================
   ACHIEVEMENTS (21 PDF CARDS)
   ========================================================================== */
const Achievements = {
  init() {
    const grid = document.getElementById("cert-grid");
    if (!grid) return;

    for (let i = 1; i <= 21; i++) {
      const card = document.createElement("div");
      card.className = "cert-card glass-card";
      card.innerHTML = `
        <h3>Certificate #${i}</h3>
        <p>Verified Professional Credential</p>
        <div style="margin-top: 15px; display: flex; gap: 10px;">
          <a href="assets/pdf/cert${i}.pdf" download class="glass-btn" style="width:auto; padding: 0 10px; font-size:12px;">Download</a>
          <a href="assets/pdf/cert${i}.pdf" target="_blank" class="glass-btn" style="width:auto; padding: 0 10px; font-size:12px;">Open</a>
        </div>
      `;
      grid.appendChild(card);
    }
  }
};

/* ==========================================================================
   FAMILY TREE ENGINE
   ========================================================================== */
const FamilyTree = {
  init() {
    const fatherRoot = document.getElementById("father-tree");
    const motherRoot = document.getElementById("mother-tree");

    if (fatherRoot) {
      fatherRoot.innerHTML = this.createNodes(6, "Father Line Gen");
    }
    if (motherRoot) {
      motherRoot.innerHTML = this.createNodes(4, "Mother Line Gen");
    }
  },

  createNodes(depth, label) {
    if (depth === 0) return "";
    return `
      <li>
        <span style="color: var(--secondary-orange); cursor:pointer;">${label} ${depth} Ancestor</span>
        <ul>${this.createNodes(depth - 1, label)}</ul>
      </li>
    `;
  }
};

/* ==========================================================================
   3D DICE SLIDER (UNIVERSITY)
   ========================================================================== */
const DiceSlider = {
  cube: null,
  step: 0,

  init() {
    this.cube = document.getElementById("dice-cube");
    if (!this.cube) return;

    setInterval(() => {
      this.step = (this.step + 1) % 4;
      this.cube.style.transform = `rotateY(-${this.step * 90}deg)`;
    }, 5000);
  }
};

/* ==========================================================================
   GALLERY TABS
   ========================================================================== */
const GalleryTabs = {
  init() {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");

        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(`tab-${target}`).classList.add("active");
      });
    });
  }
};

/* ==========================================================================
   NOTEBOOK PAGINATION (PERSONAL LIFE)
   ========================================================================== */
const Notebook = {
  currentPage: 0,
  pages: [
    { title: "Marzuk", text: "A brotherly friend through all thicks and thins.", img: "assets/images/marzuk.jpg" },
    { title: "Nasif", text: "Tech discussions and endless dynamic ideas partner.", img: "assets/images/nasif.jpg" },
    { title: "Love", text: "Inspiration and core strength behind every creative effort.", img: "assets/images/love.jpg" },
    { title: "Father", text: "The foundation of discipline, focus, and strength.", img: "assets/images/father.jpg" },
    { title: "Mother", text: "The endless warmth, care, and guidance.", img: "assets/images/mother.jpg" },
    { title: "Sister", text: "Joy, laughter, and lifelong support.", img: "assets/images/sister.jpg" }
  ],

  init() {
    this.render();
    document.getElementById("prev-page")?.addEventListener("click", () => this.changePage(-1));
    document.getElementById("next-page")?.addEventListener("click", () => this.changePage(1));
  },

  changePage(dir) {
    const newPage = this.currentPage + dir;
    if (newPage >= 0 && newPage < this.pages.length) {
      this.currentPage = newPage;
      this.render();
    }
  },

  render() {
    const paper = document.getElementById("notebook-paper");
    const pageNum = document.getElementById("notebook-page-num");
    if (!paper) return;

    const data = this.pages[this.currentPage];
    pageNum.innerText = `Page ${this.currentPage + 1} of ${this.pages.length}`;

    paper.innerHTML = `
      <div class="note-page-content">
        <img src="${data.img}" alt="${data.title}" class="note-img" />
        <div>
          <h3 style="font-family: var(--font-cursive); font-size: 1.8rem; color: var(--secondary-orange);">${data.title}</h3>
          <p style="margin-top: 10px;">${data.text}</p>
        </div>
      </div>
    `;
  }
};

/* ==========================================================================
   LIGHTBOX / FULLSCREEN MEDIA MODAL ENGINE
   ========================================================================== */
const Lightbox = {
  modal: null,
  body: null,

  init() {
    this.modal = document.getElementById("media-modal");
    this.body = document.getElementById("modal-body");
    const closeBtn = document.getElementById("modal-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    document.querySelectorAll(".media-card").forEach((card) => {
      card.addEventListener("click", () => {
        const src = card.getAttribute("data-src");
        const type = card.getAttribute("data-type");
        this.open(src, type);
      });
    });
  },

  open(src, type) {
    if (!this.modal || !this.body) return;
    this.body.innerHTML = "";

    if (type === "video") {
      AudioEngine.pause();
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      this.body.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src;
      this.body.appendChild(img);
    }

    this.modal.classList.remove("hidden");
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.add("hidden");
    if (this.body) this.body.innerHTML = "";
    AudioEngine.resume();
  }
};
