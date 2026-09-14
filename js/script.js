/* Theme Management */
const themeToggles = document.querySelectorAll(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const themeColorMeta = document.querySelector("#theme-color-meta");

function updateThemeUI(isDark) {
	themeToggles.forEach((btn) => {
		btn.setAttribute("aria-pressed", String(isDark));
		btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
		btn.innerHTML = isDark ? `<span aria-hidden="true">☀️</span>` : `<span aria-hidden="true">🌙</span>`;
	});

	if (themeColorMeta) {
		themeColorMeta.setAttribute("content", isDark ? "#0b0f19" : "#f8fafc");
	}
}

const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
if (initialDark) {
	document.documentElement.classList.add("dark");
	document.body.classList.add("dark");
} else {
	document.documentElement.classList.remove("dark");
	document.body.classList.remove("dark");
}
updateThemeUI(initialDark);

themeToggles.forEach((btn) => {
	btn.addEventListener("click", () => {
		const isDark = document.body.classList.toggle("dark");
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
		updateThemeUI(isDark);
	});
});

/* Mobile Navbar Navigation */
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
	navToggle.addEventListener("click", () => {
		const isOpen = mainNav.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});

	// Close navbar when clicking any link
	mainNav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			mainNav.classList.remove("is-open");
			navToggle.setAttribute("aria-expanded", "false");
		});
	});

	// Close navbar when clicking outside
	document.addEventListener("click", (e) => {
		if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
			mainNav.classList.remove("is-open");
			navToggle.setAttribute("aria-expanded", "false");
		}
	});

	// Close navbar on Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
			mainNav.classList.remove("is-open");
			navToggle.setAttribute("aria-expanded", "false");
			navToggle.focus();
		}
	});
}

/* Footer Year */
const yearEl = document.querySelector("#year");
if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}

/* Page Navigation Link (aria-current) */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach((link) => {
	const href = link.getAttribute("href");
	if (href && !href.startsWith("#") && !href.startsWith("http")) {
		if (href === currentPage) {
			link.setAttribute("aria-current", "page");
		}
	}
});

/* Scrollspy for Single-Page Section Navigation */
const sectionNavLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const observedSections = [];

sectionNavLinks.forEach((link) => {
	const targetId = link.getAttribute("href").slice(1);
	const targetSection = document.getElementById(targetId);
	if (targetSection) {
		observedSections.push({ link, section: targetSection });
	}
});

if (observedSections.length > 0 && "IntersectionObserver" in window) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = entry.target.getAttribute("id");
					sectionNavLinks.forEach((link) => {
						const isCurrent = link.getAttribute("href") === `#${id}`;
						link.classList.toggle("is-active", isCurrent);
					});
				}
			});
		},
		{
			rootMargin: "-20% 0px -70% 0px",
			threshold: 0
		}
	);

	observedSections.forEach(({ section }) => observer.observe(section));
}

/* Certificate Lightbox Modal */
const certModal = document.querySelector("#cert-modal");
let lastFocusedElement = null;

if (certModal) {
	const certModalImg = certModal.querySelector("#cert-modal-image");
	const certModalTitle = certModal.querySelector("#cert-modal-title");
	const certModalDownload = certModal.querySelector("#cert-modal-download");
	const certModalCloseButtons = certModal.querySelectorAll("[data-close-modal]");

	function openCertModal(imageSrc, title, triggerBtn) {
		lastFocusedElement = triggerBtn;
		certModalImg.src = imageSrc;
		certModalImg.alt = title ? `Certificate: ${title}` : "Certificate preview";
		certModalTitle.textContent = title || "Certificate Preview";
		certModalDownload.href = imageSrc;

		certModal.removeAttribute("hidden");
		// Trigger reflow for CSS transition
		void certModal.offsetWidth;
		certModal.classList.add("is-open");
		document.body.style.overflow = "hidden";

		const closeBtn = certModal.querySelector(".cert-modal-close");
		if (closeBtn) closeBtn.focus();
	}

	function closeCertModal() {
		certModal.classList.remove("is-open");
		document.body.style.overflow = "";

		setTimeout(() => {
			certModal.setAttribute("hidden", "");
			certModalImg.src = "";
			if (lastFocusedElement) {
				lastFocusedElement.focus();
			}
		}, 200);
	}

	// Intercept certificate links
	document.querySelectorAll('a[href*="assets/certificates/"]').forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const card = link.closest(".project-card");
			const cardTitle = card ? card.querySelector(".card-title, h3")?.textContent.trim() : "";
			openCertModal(link.getAttribute("href"), cardTitle, link);
		});
	});

	certModalCloseButtons.forEach((btn) => {
		btn.addEventListener("click", closeCertModal);
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && certModal.classList.contains("is-open")) {
			closeCertModal();
		}
	});
}
