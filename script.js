const themeToggle = document.querySelector(".theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");

function updateThemeUI(isDark) {
	if (themeToggle) {
		themeToggle.setAttribute("aria-pressed", String(isDark));
		themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
		themeToggle.innerHTML = isDark ? `<span aria-hidden="true">☀️</span>` : `<span aria-hidden="true">🌙</span>`;
	}
}

const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
if (initialDark) {
	document.body.classList.add("dark");
}
updateThemeUI(initialDark);

if (themeToggle) {
	themeToggle.addEventListener("click", () => {
		const isDark = document.body.classList.toggle("dark");
		localStorage.setItem("theme", isDark ? "dark" : "light");
		updateThemeUI(isDark);
	});
}

const yearEl = document.querySelector("#year");
if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}
