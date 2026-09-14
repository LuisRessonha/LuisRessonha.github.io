const themeToggles = document.querySelectorAll(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");

function updateThemeUI(isDark) {
	themeToggles.forEach((btn) => {
		btn.setAttribute("aria-pressed", String(isDark));
		btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
		btn.innerHTML = isDark ? `<span aria-hidden="true">☀️</span>` : `<span aria-hidden="true">🌙</span>`;
	});
}

const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
if (initialDark) {
	document.body.classList.add("dark");
}
updateThemeUI(initialDark);

themeToggles.forEach((btn) => {
	btn.addEventListener("click", () => {
		const isDark = document.body.classList.toggle("dark");
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

/* Active Nav Link (aria-current) */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach((link) => {
	const href = link.getAttribute("href");
	if (href && !href.startsWith("#") && !href.startsWith("http")) {
		if (href === currentPage) {
			link.setAttribute("aria-current", "page");
		}
	}
});
