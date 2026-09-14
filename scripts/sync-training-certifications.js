const fs = require("fs");
const path = require("path");

const repositoryRoot = path.resolve(__dirname, "..");
const markdownPath = path.join(repositoryRoot, "training-and-certifications.md");
const htmlPath = path.join(repositoryRoot, "portfolio.html");
const startMarker = "<!-- TRAINING-CERTIFICATIONS:START -->";
const endMarker = "<!-- TRAINING-CERTIFICATIONS:END -->";

function escapeHtml(value) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function parseEntries(markdown) {
	const source = markdown.split("## New Entry Template")[0];
	const sections = [...source.matchAll(/^## (.+)$/gm)];
	const entries = [];

	sections.forEach((section, sectionIndex) => {
		const sectionName = section[1].trim();
		const sectionStart = section.index + section[0].length;
		const sectionEnd = sections[sectionIndex + 1]?.index ?? source.length;
		const sectionText = source.slice(sectionStart, sectionEnd);

		const sectionEntries = sectionText.split(/^### /m).slice(1);
		for (const sectionEntry of sectionEntries) {
			const [titleLine, ...entryLines] = sectionEntry.split("\n");
			const entryBody = entryLines.join("\n");
			const fields = {};
			for (const field of entryBody.matchAll(/^- \*\*(.+?):\*\*\s*(.*)$/gm)) {
				fields[field[1].toLowerCase()] = field[2].trim().replace(/^`|`$/g, "");
			}

			if (fields.provider && fields.description && fields.topics) {
				entries.push({
					title: titleLine.trim(),
					sectionName,
					provider: fields.provider,
					period: fields.status?.toLowerCase() === "ongoing"
						? `Ongoing (${fields.year || ""})`.trim()
						: fields.completed || "",
					description: fields.description,
					topics: fields.topics.split(",").map((topic) => topic.trim()).filter(Boolean),
					url: /^https?:\/\//i.test(fields.url || "") ? fields.url : "",
					certificate: fields.certificate && fields.certificate !== "Not available yet" && fields.certificate !== "assets/certificates/file-name.ext"
						? fields.certificate
						: ""
				});
			}
		}
	});

	return entries;
}

function renderEntry(entry) {
	const topics = entry.topics
		.map((topic, index) => `<span class="tag${index === 0 ? " tag-primary" : ""}">${escapeHtml(topic)}</span>`)
		.join("\n\t\t\t\t\t\t\t");
	const certificate = [
		entry.url
			? `<a class="btn btn-secondary" href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer" style="font-size: 0.8rem; padding: 0.4rem 0.84rem; width: 100%; justify-content: center">View Course ↗</a>`
			: "",
		entry.certificate
			? `<a class="btn btn-secondary" href="${escapeHtml(entry.certificate)}" target="_blank" rel="noreferrer" style="font-size: 0.8rem; padding: 0.4rem 0.84rem; width: 100%; justify-content: center">View Certificate ↗</a>`
			: ""
	].filter(Boolean).join("\n\t\t\t\t\t\t\t");

	return `\t\t\t\t\t<article class="project-card">
\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<div class="timeline-header" style="margin-bottom: 0.5rem">
\t\t\t\t\t\t\t\t<h3 style="font-size: 1.05rem; margin-bottom: 0">${escapeHtml(entry.title)}</h3>
\t\t\t\t\t\t\t\t<span class="period-badge">${escapeHtml(entry.period)}</span>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="company-name" style="font-size: 0.85rem; margin-bottom: 0.75rem">${escapeHtml(entry.provider)}</div>
\t\t\t\t\t\t\t<p>${escapeHtml(entry.description)}</p>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<div class="tech-tags" style="margin-bottom: 0.85rem">
\t\t\t\t\t\t\t\t${topics}
\t\t\t\t\t\t\t</div>${certificate}
\t\t\t\t\t\t</div>
\t\t\t\t\t</article>`;
}

const markdown = fs.readFileSync(markdownPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");
const entries = parseEntries(markdown);
const generatedCards = entries.map(renderEntry).join("\n\n");
const markedBlock = `${startMarker}\n${generatedCards}\n\t\t\t\t${endMarker}`;
const markerPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);

if (!markerPattern.test(html)) {
	throw new Error(`Could not find the marked certifications block in ${htmlPath}`);
}

fs.writeFileSync(htmlPath, html.replace(markerPattern, markedBlock));
console.log(`Synchronized ${entries.length} training and certification entries into portfolio.html.`);
