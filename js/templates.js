/**
 * Template Rendering Engine for Universal ATS Resume Builder
 * Generates semantic, ATS-parsable HTML for all 8 templates.
 */

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (months[monthIndex]) {
      return `${months[monthIndex]} ${year}`;
    }
  }
  return dateStr;
}

// Sub-renderers
function renderContactHTML(p) {
  if (!p) return "";
  const items = [];
  if (p.email) items.push(`<span class="contact-item"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)}</a></span>`);
  if (p.phone) items.push(`<span class="contact-item"><a href="tel:${escapeHTML(p.phone)}">${escapeHTML(p.phone)}</a></span>`);
  if (p.location) items.push(`<span class="contact-item">${escapeHTML(p.location)}</span>`);
  if (p.linkedin) {
    const cleanLink = p.linkedin.replace(/^https?:\/\//, "");
    items.push(`<span class="contact-item"><a href="https://${cleanLink}" target="_blank">${escapeHTML(cleanLink)}</a></span>`);
  }
  if (p.github) {
    const cleanGit = p.github.replace(/^https?:\/\//, "");
    items.push(`<span class="contact-item"><a href="https://${cleanGit}" target="_blank">${escapeHTML(cleanGit)}</a></span>`);
  }
  if (p.website) {
    const cleanWeb = p.website.replace(/^https?:\/\//, "");
    items.push(`<span class="contact-item"><a href="https://${cleanWeb}" target="_blank">${escapeHTML(cleanWeb)}</a></span>`);
  }
  return `<div class="contact-row">${items.join("")}</div>`;
}

function renderExperienceSection(exps, headingClass = "section-heading") {
  if (!exps || exps.length === 0) return "";
  const valid = exps.filter(e => e.title || e.company);
  if (valid.length === 0) return "";

  const items = valid.map(e => {
    const start = formatDate(e.startDate);
    const end = e.current ? "Present" : formatDate(e.endDate);
    const dateRange = (start || end) ? `${start} – ${end}` : "";
    const bulletsHTML = (e.bullets || [])
      .filter(b => b && b.trim())
      .map(b => `<li>${escapeHTML(b)}</li>`)
      .join("");

    return `
      <article class="resume-entry" data-entry-id="${escapeHTML(e.id || '')}">
        <div class="resume-entry-header">
          <span class="resume-entry-title">${escapeHTML(e.title || '')}</span>
          <span class="resume-entry-date">${escapeHTML(dateRange)}</span>
        </div>
        <div class="resume-entry-header" style="margin-bottom: 4px;">
          <span class="resume-entry-subtitle">${escapeHTML(e.company || '')}</span>
          <span class="resume-entry-location">${escapeHTML(e.location || '')}</span>
        </div>
        ${bulletsHTML ? `<ul>${bulletsHTML}</ul>` : ''}
      </article>
    `;
  }).join("");

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">Work Experience</h2>
      ${items}
    </section>
  `;
}

function renderEducationSection(edus, headingClass = "section-heading") {
  if (!edus || edus.length === 0) return "";
  const valid = edus.filter(e => e.degree || e.school);
  if (valid.length === 0) return "";

  const items = valid.map(e => {
    const start = formatDate(e.startDate);
    const end = formatDate(e.endDate);
    const dateRange = (start && end) ? `${start} – ${end}` : (end || start || "");

    return `
      <article class="resume-entry">
        <div class="resume-entry-header">
          <span class="resume-entry-title">${escapeHTML(e.degree || '')}</span>
          <span class="resume-entry-date">${escapeHTML(dateRange)}</span>
        </div>
        <div class="resume-entry-header" style="margin-bottom: 2px;">
          <span class="resume-entry-subtitle">${escapeHTML(e.school || '')}</span>
          <span class="resume-entry-location">${escapeHTML(e.location || '')}</span>
        </div>
        ${e.gpa ? `<p style="font-size:0.88em; color:#475569; margin-top:2px;">${escapeHTML(e.gpa)}</p>` : ''}
      </article>
    `;
  }).join("");

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">Education</h2>
      ${items}
    </section>
  `;
}

function renderSkillsSection(skills, headingClass = "section-heading") {
  if (!skills) return "";
  const tech = (skills.technical || []).filter(s => s && s.trim());
  const soft = (skills.soft || []).filter(s => s && s.trim());
  if (tech.length === 0 && soft.length === 0) return "";

  let content = "";
  if (tech.length > 0) {
    content += `
      <div style="margin-bottom: 6px;">
        ${soft.length > 0 ? '<strong style="font-size:0.88em; color:var(--text-dark);">Technical: </strong>' : ''}
        <div class="skills-chip-container">
          ${tech.map(s => `<span class="skill-chip">${escapeHTML(s)}</span>`).join("")}
        </div>
      </div>
    `;
  }
  if (soft.length > 0) {
    content += `
      <div>
        ${tech.length > 0 ? '<strong style="font-size:0.88em; color:var(--text-dark); display:block; margin-top:4px;">Core Strengths: </strong>' : ''}
        <div class="skills-chip-container">
          ${soft.map(s => `<span class="skill-chip">${escapeHTML(s)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">Skills &amp; Competencies</h2>
      ${content}
    </section>
  `;
}

function renderProjectsSection(projects, headingClass = "section-heading") {
  if (!projects || projects.length === 0) return "";
  const valid = projects.filter(p => p.name);
  if (valid.length === 0) return "";

  const items = valid.map(p => `
    <article class="resume-entry">
      <div class="resume-entry-header">
        <span class="resume-entry-title">${escapeHTML(p.name)}</span>
        ${p.link ? `<span class="resume-entry-date"><a href="https://${p.link.replace(/^https?:\/\//, '')}" target="_blank" style="color:var(--accent-color);">${escapeHTML(p.link)}</a></span>` : ''}
      </div>
      ${p.tech ? `<p style="font-size:0.86em; color:var(--text-muted); font-weight:600; margin-bottom:2px;">Technologies: ${escapeHTML(p.tech)}</p>` : ''}
      ${p.description ? `<p style="font-size:0.92em; color:#334155;">${escapeHTML(p.description)}</p>` : ''}
    </article>
  `).join("");

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">Key Projects</h2>
      ${items}
    </section>
  `;
}

function renderCertificationsSection(certs, headingClass = "section-heading") {
  if (!certs || certs.length === 0) return "";
  const valid = certs.filter(c => c.name);
  if (valid.length === 0) return "";

  const items = valid.map(c => `
    <article class="resume-entry">
      <div class="resume-entry-header">
        <span class="resume-entry-title">${escapeHTML(c.name)}</span>
        ${c.date ? `<span class="resume-entry-date">${escapeHTML(c.date)}</span>` : ''}
      </div>
      ${c.issuer ? `<span class="resume-entry-subtitle">${escapeHTML(c.issuer)}</span>` : ''}
    </article>
  `).join("");

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">Certifications &amp; Licenses</h2>
      ${items}
    </section>
  `;
}

function renderCustomSection(custom, headingClass = "section-heading") {
  if (!custom || !custom.title) return "";
  const items = (custom.items || []).filter(i => i && i.trim());
  if (items.length === 0) return "";

  return `
    <section class="resume-section">
      <h2 class="${headingClass}">${escapeHTML(custom.title)}</h2>
      <ul>
        ${items.map(i => `<li>${escapeHTML(i)}</li>`).join("")}
      </ul>
    </section>
  `;
}


// ==========================================================================
// Template Builders
// ==========================================================================

// 1. LONDON (Classic ATS Gold Standard)
function buildLondon(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-london">
      <header class="resume-header">
        ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" style="margin-bottom:8px;" />` : ''}
        <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
        <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        ${renderContactHTML(p)}
      </header>

      ${data.summary ? `
        <section class="resume-section">
          <h2 class="section-heading">Professional Summary</h2>
          <p style="color:#334155; line-height:1.48;">${escapeHTML(data.summary)}</p>
        </section>
      ` : ''}

      ${renderExperienceSection(data.experience)}
      ${renderEducationSection(data.education)}
      ${renderSkillsSection(data.skills)}
      ${renderProjectsSection(data.projects)}
      ${renderCertificationsSection(data.certifications)}
      ${renderCustomSection(data.custom)}
    </div>
  `;
}

// 2. STOCKHOLM (Modern Clean Two-Column)
function buildStockholm(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-stockholm">
      <aside class="stockholm-sidebar">
        ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" style="margin-bottom:12px; width:76px; height:76px;" />` : ''}
        <h2 class="section-heading" style="margin-top:0;">Details</h2>
        ${renderContactHTML(p)}
        ${renderSkillsSection(data.skills)}
        ${renderEducationSection(data.education)}
        ${renderCertificationsSection(data.certifications)}
      </aside>

      <main class="stockholm-main">
        <header style="margin-bottom: var(--section-gap);">
          <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
          <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        </header>

        ${data.summary ? `
          <section class="resume-section">
            <h2 class="section-heading" style="margin-top:0;">Profile</h2>
            <p style="color:#334155; line-height:1.48;">${escapeHTML(data.summary)}</p>
          </section>
        ` : ''}

        ${renderExperienceSection(data.experience)}
        ${renderProjectsSection(data.projects)}
        ${renderCustomSection(data.custom)}
      </main>
    </div>
  `;
}

// 3. TORONTO (Contemporary Bold Banner Header)
function buildToronto(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-toronto">
      <header class="toronto-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
            <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" style="border-color:#ffffff;" />` : ''}
        </div>
        ${renderContactHTML(p)}
      </header>

      <div class="toronto-body">
        ${data.summary ? `
          <section class="resume-section">
            <h2 class="section-heading">Professional Summary</h2>
            <p style="color:#334155; line-height:1.48;">${escapeHTML(data.summary)}</p>
          </section>
        ` : ''}

        ${renderExperienceSection(data.experience)}
        ${renderEducationSection(data.education)}
        ${renderSkillsSection(data.skills)}
        ${renderProjectsSection(data.projects)}
        ${renderCertificationsSection(data.certifications)}
        ${renderCustomSection(data.custom)}
      </div>
    </div>
  `;
}

// 4. DUBLIN (Minimalist High-Density ATS)
function buildDublin(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-dublin">
      <header style="margin-bottom: var(--section-gap); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
          <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
          ${renderContactHTML(p)}
        </div>
        ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" />` : ''}
      </header>

      ${data.summary ? `
        <section class="resume-section">
          <h2 class="section-heading">Summary</h2>
          <p style="color:#334155; line-height:1.48;">${escapeHTML(data.summary)}</p>
        </section>
      ` : ''}

      ${renderExperienceSection(data.experience)}
      ${renderEducationSection(data.education)}
      ${renderSkillsSection(data.skills)}
      ${renderProjectsSection(data.projects)}
      ${renderCertificationsSection(data.certifications)}
      ${renderCustomSection(data.custom)}
    </div>
  `;
}

// 5. VIENNA (Sophisticated Corporate with Timeline)
function buildVienna(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-vienna">
      <header style="margin-bottom: var(--section-gap);">
        ${p.photo ? `<div style="text-align:center;"><img src="${p.photo}" class="photo-avatar" alt="Photo" style="margin-bottom:8px;" /></div>` : ''}
        <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
        <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        ${renderContactHTML(p)}
      </header>

      ${data.summary ? `
        <section class="resume-section">
          <h2 class="section-heading">Professional Summary</h2>
          <p style="color:#334155; line-height:1.48; text-align:justify;">${escapeHTML(data.summary)}</p>
        </section>
      ` : ''}

      ${renderExperienceSection(data.experience)}
      ${renderEducationSection(data.education)}
      ${renderSkillsSection(data.skills)}
      ${renderProjectsSection(data.projects)}
      ${renderCertificationsSection(data.certifications)}
      ${renderCustomSection(data.custom)}
    </div>
  `;
}

// 6. SYDNEY (Creative Contrast Two-Column)
function buildSydney(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-sydney">
      <aside class="sydney-sidebar">
        ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" style="margin-bottom:12px; width:72px; height:72px; border-color:rgba(255,255,255,0.8);" />` : ''}
        <h2 class="section-heading" style="margin-top:0;">Contact</h2>
        ${renderContactHTML(p)}
        ${renderSkillsSection(data.skills)}
        ${renderEducationSection(data.education)}
        ${renderCertificationsSection(data.certifications)}
      </aside>

      <main class="sydney-main">
        <header style="margin-bottom: var(--section-gap);">
          <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
          <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        </header>

        ${data.summary ? `
          <section class="resume-section">
            <h2 class="section-heading" style="margin-top:0;">Summary</h2>
            <p style="color:#334155; line-height:1.48;">${escapeHTML(data.summary)}</p>
          </section>
        ` : ''}

        ${renderExperienceSection(data.experience)}
        ${renderProjectsSection(data.projects)}
        ${renderCustomSection(data.custom)}
      </main>
    </div>
  `;
}

// 7. BERLIN (Tech & Engineering Focus)
function buildBerlin(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-berlin">
      <header class="berlin-header">
        <div>
          <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
          <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          ${renderContactHTML(p)}
          ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" />` : ''}
        </div>
      </header>

      ${data.summary ? `
        <section class="resume-section">
          <h2 class="section-heading">Overview</h2>
          <p style="color:#334155; line-height:1.45;">${escapeHTML(data.summary)}</p>
        </section>
      ` : ''}

      ${renderSkillsSection(data.skills)}
      ${renderExperienceSection(data.experience)}
      ${renderProjectsSection(data.projects)}
      ${renderEducationSection(data.education)}
      ${renderCertificationsSection(data.certifications)}
      ${renderCustomSection(data.custom)}
    </div>
  `;
}

// 8. ATHENS (Academic & Traditional Serif)
function buildAthens(data) {
  const p = data.personal || {};
  return `
    <div class="tpl-athens">
      <header class="resume-header">
        ${p.photo ? `<img src="${p.photo}" class="photo-avatar" alt="Photo" style="margin-bottom:8px;" />` : ''}
        <h1 class="candidate-name">${escapeHTML(p.fullName || 'Your Name')}</h1>
        <div class="candidate-role">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
        ${renderContactHTML(p)}
      </header>

      ${data.summary ? `
        <section class="resume-section">
          <h2 class="section-heading">Curriculum Vitae Summary</h2>
          <p style="color:#334155; line-height:1.52; text-align:justify;">${escapeHTML(data.summary)}</p>
        </section>
      ` : ''}

      ${renderEducationSection(data.education)}
      ${renderExperienceSection(data.experience)}
      ${renderProjectsSection(data.projects)}
      ${renderSkillsSection(data.skills)}
      ${renderCertificationsSection(data.certifications)}
      ${renderCustomSection(data.custom)}
    </div>
  `;
}

const TEMPLATE_MAP = {
  london: buildLondon,
  stockholm: buildStockholm,
  toronto: buildToronto,
  dublin: buildDublin,
  vienna: buildVienna,
  sydney: buildSydney,
  berlin: buildBerlin,
  athens: buildAthens
};

function renderResume(templateId, resumeData) {
  const builder = TEMPLATE_MAP[templateId] || TEMPLATE_MAP.london;
  return builder(resumeData);
}

// Export for Node or browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { renderResume, TEMPLATE_MAP };
}
