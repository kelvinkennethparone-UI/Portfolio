/* =========================
   LUCIDE ICONS & FOOTER YEAR
========================= */
if (window.lucide) {
    lucide.createIcons();
}

const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

/* =========================
   TYPING EFFECT
========================= */
const roles = [
    "UI/UX Designer",
    "Front-End Developer",
    "Visual & Photo Editor"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingEl = document.getElementById("typing-text");

function typeEffect() {
    if (!typingEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        speed = 1600;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();

/* =========================
   MOBILE MENU TOGGLE
========================= */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* =========================
   TOAST NOTIFICATION HELPER
========================= */
let toastTimer;

function showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.className = "toast-notification";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* =========================
   SCROLL PROGRESS BAR & ACTIVE NAV
========================= */
const progressBar = document.getElementById("scroll-progress");
const sectionEls = Array.from(document.querySelectorAll("section[id]"));
const navAnchorEls = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));

function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
        const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        progressBar.style.width = `${percent}%`;
    }

    let currentId = "";
    const offset = 160;
    for (const sec of sectionEls) {
        if (scrollTop >= sec.offsetTop - offset) {
            currentId = sec.id;
        }
    }

    navAnchorEls.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        const isMatch = href === `#${currentId}`;
        anchor.classList.toggle("active", isMatch);
    });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

/* =========================
   SUBTLE CURSOR SPOTLIGHT
========================= */
const spotlight = document.getElementById("cursor-spotlight");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (spotlight && !prefersReducedMotion && !isTouchDevice) {
    window.addEventListener("pointermove", (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    }, { passive: true });
}

/* =========================
   SCROLL REVEAL ANIMATION
========================= */
const revealTargets = document.querySelectorAll(
    ".section-header, .about-text, .about-card, .skill-card, .project-card, .contact-info, .contact-form"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((el, idx) => {
        el.classList.add("reveal-item");
        el.style.transitionDelay = `${(idx % 3) * 70}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
} else {
    revealTargets.forEach((el) => el.classList.add("revealed"));
}

/* =========================
   PROJECT FILTERING, SEARCH & 3D TILT
========================= */
const filterPills = Array.from(document.querySelectorAll(".filter-pill"));
const projectSearch = document.getElementById("project-search");
const projectCards = Array.from(document.querySelectorAll("#projects-grid .project-card"));
const emptyProjectsEl = document.getElementById("empty-projects");
const resetFiltersBtn = document.getElementById("reset-project-filters");

let activeCategory = "all";
let searchQuery = "";

function applyProjectFilters() {
    let visibleCount = 0;

    projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const title = (card.querySelector("h3")?.textContent || "").toLowerCase();
        const desc = (card.querySelector("p")?.textContent || "").toLowerCase();
        const tags = (card.dataset.tags || "").toLowerCase();

        const matchesCategory = activeCategory === "all" || category === activeCategory;
        const matchesQuery =
            !searchQuery ||
            title.includes(searchQuery) ||
            desc.includes(searchQuery) ||
            tags.includes(searchQuery) ||
            category.toLowerCase().includes(searchQuery);

        const isVisible = matchesCategory && matchesQuery;
        card.classList.toggle("is-hidden", !isVisible);
        if (isVisible) visibleCount++;
    });

    if (emptyProjectsEl) {
        emptyProjectsEl.hidden = visibleCount > 0;
    }
}

filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
        filterPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.dataset.filter || "all";
        applyProjectFilters();
    });
});

if (projectSearch) {
    projectSearch.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyProjectFilters();
    });
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
        activeCategory = "all";
        searchQuery = "";
        if (projectSearch) projectSearch.value = "";
        filterPills.forEach((p) => {
            p.classList.toggle("active", p.dataset.filter === "all");
        });
        applyProjectFilters();
    });
}

if (!prefersReducedMotion && !isTouchDevice) {
    projectCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* =========================
   CASE STUDY & PREVIEW MODAL
========================= */
const caseStudies = [
    {
        id: "digital-portfolio",
        category: "UI/UX & Web",
        title: "Digital Portfolio",
        previewImage: "./assets/systems/digital-portfolio.png",
        previewAlt: "Desktop preview of Digital Portfolio",
        summary: "A responsive dark-mode portfolio showcasing UI/UX concepts, system designs, skills, and interactive navigation with a command palette (Ctrl+K) and case study modals.",
        approach: "Focused on clean contrast, scannable section pacing, layered portrait framing, and smooth interactive controls across desktop and mobile screens.",
        outcome: "Provides a central, structured presentation of work, capabilities, and direct contact options.",
        tags: ["UI/UX", "HTML5", "CSS3", "JavaScript", "Responsive Design"]
    },
    {
        id: "berims-deped-bicol",
        category: "System Design",
        title: "DepEd Bicol Resources Management System",
        previewImage: "./assets/systems/deped-bicol-resources-management.png",
        previewAlt: "Desktop preview of DepEd Bicol Resources Management System",
        summary: "Basic Education Resources and Inputs Monitoring System for DepEd Region V (Bicol), unifying classroom, furniture, ICT equipment, and facility tracking across schools, Schools Division Offices, and the Regional Office.",
        approach: "Structured a role-aware landing experience and monitoring flow tailored to school administrators, SDOs, and Regional Office personnel, highlighting key scale metrics upfront.",
        outcome: "Replaces scattered paper and spreadsheet inventories with a single centralized resource monitoring platform across Region V.",
        tags: ["System Design", "DepEd Region V", "Role-Aware Platform", "Resource Monitoring"]
    },
    {
        id: "library-printing-request",
        category: "System Design",
        title: "Library Printing Request System",
        previewImage: "Library Printing Request System",
        previewAlt: "Desktop preview of Library Printing Request System",
        summary: "A structured system and desktop interface for managing library printing requests, job specifications, queue status, and fulfillment.",
        approach: "Organized print request submission, status tracking, and queue visibility so users and staff have clear progress at every step.",
        outcome: "Streamlines library printing requests with a clear, structured workflow.",
        tags: ["System Design", "Desktop UI", "Request Workflow", "Queue Management"]
    }
];

const modalBackdrop = document.getElementById("case-study-modal");
const modalCloseBtn = document.getElementById("modal-close");
const modalZoomBtn = document.getElementById("modal-zoom-btn");
const modalPreviewStage = document.getElementById("modal-preview-stage");
const modalWindowPath = document.getElementById("modal-window-path");
const modalPreviewImg = document.getElementById("modal-preview-img");
const modalPreviewFallback = document.getElementById("modal-preview-fallback");
const modalFallbackPath = document.getElementById("modal-fallback-path");
const modalCategoryEl = document.getElementById("modal-category");
const modalTitleEl = document.getElementById("modal-title");
const modalSummaryEl = document.getElementById("modal-summary");
const modalApproachEl = document.getElementById("modal-approach");
const modalOutcomeEl = document.getElementById("modal-outcome");
const modalTagsEl = document.getElementById("modal-tags");
const modalPrevBtn = document.getElementById("modal-prev");
const modalNextBtn = document.getElementById("modal-next");
const modalContactCta = document.getElementById("modal-contact-cta");

let activeStudyIndex = 0;
let isPreviewZoomed = false;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panScrollLeft = 0;
let panScrollTop = 0;

function resetPreviewZoom() {
    isPreviewZoomed = false;
    isPanning = false;
    if (modalPreviewImg) {
        modalPreviewImg.classList.remove("is-zoomed");
    }
    if (modalZoomBtn) {
        modalZoomBtn.textContent = "Zoom View";
    }
    if (modalPreviewStage) {
        modalPreviewStage.scrollTo({ top: 0, left: 0 });
    }
}

function showPreviewImage() {
    if (modalPreviewFallback) modalPreviewFallback.hidden = true;
    if (modalPreviewImg) modalPreviewImg.style.display = "block";
}

function showPreviewFallback(path) {
    if (modalPreviewImg) modalPreviewImg.style.display = "none";
    if (modalFallbackPath) modalFallbackPath.textContent = path;
    if (modalPreviewFallback) modalPreviewFallback.hidden = false;
}

if (modalPreviewImg) {
    modalPreviewImg.addEventListener("load", showPreviewImage);
    modalPreviewImg.addEventListener("error", () => {
        const current = caseStudies[activeStudyIndex];
        showPreviewFallback(current?.previewImage || "");
    });
}

if (modalZoomBtn && modalPreviewImg) {
    modalZoomBtn.addEventListener("click", () => {
        isPreviewZoomed = !isPreviewZoomed;
        modalPreviewImg.classList.toggle("is-zoomed", isPreviewZoomed);
        modalZoomBtn.textContent = isPreviewZoomed ? "Fit View" : "Zoom View";
        if (!isPreviewZoomed && modalPreviewStage) {
            modalPreviewStage.scrollTo({ top: 0, left: 0 });
        }
    });
}

if (modalPreviewStage && modalPreviewImg) {
    modalPreviewStage.addEventListener("mousedown", (e) => {
        if (!isPreviewZoomed) return;
        isPanning = true;
        panStartX = e.pageX - modalPreviewStage.offsetLeft;
        panStartY = e.pageY - modalPreviewStage.offsetTop;
        panScrollLeft = modalPreviewStage.scrollLeft;
        panScrollTop = modalPreviewStage.scrollTop;
    });

    window.addEventListener("mouseup", () => {
        isPanning = false;
    });

    modalPreviewStage.addEventListener("mousemove", (e) => {
        if (!isPanning || !isPreviewZoomed) return;
        e.preventDefault();
        const x = e.pageX - modalPreviewStage.offsetLeft;
        const y = e.pageY - modalPreviewStage.offsetTop;
        modalPreviewStage.scrollLeft = panScrollLeft - (x - panStartX) * 1.2;
        modalPreviewStage.scrollTop = panScrollTop - (y - panStartY) * 1.2;
    });
}

function renderCaseStudy(index) {
    const safeIndex = (index + caseStudies.length) % caseStudies.length;
    activeStudyIndex = safeIndex;
    const item = caseStudies[safeIndex];

    resetPreviewZoom();
    showPreviewImage();

    if (modalCategoryEl) modalCategoryEl.textContent = item.category;
    if (modalTitleEl) modalTitleEl.textContent = item.title;
    if (modalWindowPath) modalWindowPath.textContent = item.previewImage;
    if (modalPreviewImg) {
        modalPreviewImg.alt = item.previewAlt;
        modalPreviewImg.src = item.previewImage;
    }
    if (modalSummaryEl) modalSummaryEl.textContent = item.summary;
    if (modalApproachEl) modalApproachEl.textContent = item.approach;
    if (modalOutcomeEl) modalOutcomeEl.textContent = item.outcome;

    if (modalTagsEl) {
        modalTagsEl.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");
    }
}

function openCaseStudyById(id) {
    const idx = caseStudies.findIndex((c) => c.id === id);
    renderCaseStudy(idx >= 0 ? idx : 0);
    if (modalBackdrop) {
        modalBackdrop.classList.add("open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        if (window.lucide) lucide.createIcons();
    }
}

function closeCaseStudyModal() {
    resetPreviewZoom();
    if (modalBackdrop) {
        modalBackdrop.classList.remove("open");
        modalBackdrop.setAttribute("aria-hidden", "true");
    }
}

document.querySelectorAll(".open-case-study").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openCaseStudyById(btn.dataset.project || "");
    });
});

projectCards.forEach((card) => {
    card.addEventListener("click", () => {
        openCaseStudyById(card.dataset.projectId || "");
    });
});

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeCaseStudyModal);
if (modalPrevBtn) modalPrevBtn.addEventListener("click", () => renderCaseStudy(activeStudyIndex - 1));
if (modalNextBtn) modalNextBtn.addEventListener("click", () => renderCaseStudy(activeStudyIndex + 1));
if (modalContactCta) modalContactCta.addEventListener("click", closeCaseStudyModal);

if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeCaseStudyModal();
    });
}

/* =========================
   COMMAND PALETTE (CTRL/CMD + K)
========================= */
const cmdBackdrop = document.getElementById("command-palette");
const cmdOpenBtn = document.getElementById("cmd-open-btn");
const cmdEscBtn = document.getElementById("cmd-esc-btn");
const cmdInput = document.getElementById("cmd-input");
const cmdList = document.getElementById("cmd-list");

function setAccentTheme(accent) {
    if (accent === "violet") {
        document.documentElement.removeAttribute("data-accent");
    } else {
        document.documentElement.setAttribute("data-accent", accent);
    }
    localStorage.setItem("portfolio-accent", accent);
    showToast(`Accent switched to ${accent.charAt(0).toUpperCase() + accent.slice(1)}`);
}

const savedAccent = localStorage.getItem("portfolio-accent");
if (savedAccent) {
    if (savedAccent === "violet") {
        document.documentElement.removeAttribute("data-accent");
    } else {
        document.documentElement.setAttribute("data-accent", savedAccent);
    }
}

function copyEmailAction() {
    const email = "kelvinkenneth.parone@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard!");
    }).catch(() => {
        showToast(email);
    });
}

const commandItems = [
    { label: "Go to Hero", hint: "Section", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Go to About", hint: "Section", action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Go to Skills & Tools", hint: "Section", action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Go to Projects", hint: "Section", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Go to Contact", hint: "Section", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Case Study: Digital Portfolio", hint: "Modal", action: () => openCaseStudyById("digital-portfolio") },
    { label: "Case Study: DepEd Bicol Resources Management System", hint: "Modal", action: () => openCaseStudyById("berims-deped-bicol") },
    { label: "Case Study: Library Printing Request System", hint: "Modal", action: () => openCaseStudyById("library-printing-request") },
    { label: "Copy Email Address", hint: "Clipboard", action: copyEmailAction },
    { label: "Accent Theme: Violet (Default)", hint: "Theme", action: () => setAccentTheme("violet") },
    { label: "Accent Theme: Cyan", hint: "Theme", action: () => setAccentTheme("cyan") },
    { label: "Accent Theme: Emerald", hint: "Theme", action: () => setAccentTheme("emerald") }
];

let filteredCommands = [...commandItems];
let activeCmdIndex = 0;

function renderCommandList() {
    if (!cmdList) return;
    if (!filteredCommands.length) {
        cmdList.innerHTML = `<li class="cmd-item"><span>No matching commands</span><span>—</span></li>`;
        return;
    }

    cmdList.innerHTML = filteredCommands
        .map(
            (item, idx) =>
                `<li class="cmd-item ${idx === activeCmdIndex ? "active" : ""}" data-cmd-idx="${idx}">
                    <span>${item.label}</span>
                    <span>${item.hint}</span>
                </li>`
        )
        .join("");

    cmdList.querySelectorAll(".cmd-item[data-cmd-idx]").forEach((el) => {
        el.addEventListener("click", () => {
            const idx = Number(el.dataset.cmdIdx);
            executeCommand(idx);
        });
    });
}

function executeCommand(idx) {
    const chosen = filteredCommands[idx];
    if (!chosen) return;
    closeCommandPalette();
    chosen.action();
}

function openCommandPalette() {
    if (!cmdBackdrop) return;
    filteredCommands = [...commandItems];
    activeCmdIndex = 0;
    if (cmdInput) cmdInput.value = "";
    renderCommandList();
    cmdBackdrop.classList.add("open");
    cmdBackdrop.setAttribute("aria-hidden", "false");
    setTimeout(() => cmdInput?.focus(), 20);
}

function closeCommandPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove("open");
    cmdBackdrop.setAttribute("aria-hidden", "true");
}

if (cmdOpenBtn) cmdOpenBtn.addEventListener("click", openCommandPalette);
if (cmdEscBtn) cmdEscBtn.addEventListener("click", closeCommandPalette);

if (cmdBackdrop) {
    cmdBackdrop.addEventListener("click", (e) => {
        if (e.target === cmdBackdrop) closeCommandPalette();
    });
}

if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredCommands = q
            ? commandItems.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
            : [...commandItems];
        activeCmdIndex = 0;
        renderCommandList();
    });

    cmdInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeCmdIndex = (activeCmdIndex + 1) % Math.max(1, filteredCommands.length);
            renderCommandList();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeCmdIndex = (activeCmdIndex - 1 + Math.max(1, filteredCommands.length)) % Math.max(1, filteredCommands.length);
            renderCommandList();
        } else if (e.key === "Enter") {
            e.preventDefault();
            executeCommand(activeCmdIndex);
        }
    });
}

window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdBackdrop?.classList.contains("open")) {
            closeCommandPalette();
        } else {
            openCommandPalette();
        }
    } else if (e.key === "Escape") {
        closeCaseStudyModal();
        closeCommandPalette();
    } else if (modalBackdrop?.classList.contains("open")) {
        if (e.key === "ArrowLeft") renderCaseStudy(activeStudyIndex - 1);
        if (e.key === "ArrowRight") renderCaseStudy(activeStudyIndex + 1);
    }
});

/* =========================
   COPY EMAIL BUTTON
========================= */
const copyEmailBtn = document.getElementById("copy-email-btn");
if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", copyEmailAction);
}

/* =========================
   CONTACT FORM (WEB3FORMS)
========================= */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
        formStatus.textContent = "Sending your message...";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                formStatus.textContent = "Message sent! Thank you for reaching out.";
                showToast("Message sent successfully!");
                contactForm.reset();
            } else {
                formStatus.textContent = data.message || "Could not send message. Please try again.";
                showToast("Unable to send message right now.");
            }
        } catch (error) {
            formStatus.textContent = "Network error while sending. Please email kelvinkenneth.parone@gmail.com directly.";
            showToast("Network error — try again shortly.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                if (window.lucide) lucide.createIcons();
            }
        }
    });
}