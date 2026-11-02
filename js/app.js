/**
 * Universal ATS Resume Builder - Application Logic (Resume.io Clean Architecture)
 */

(function () {
  // Application State
  let state = {
    template: "london",
    color: "#1a91f0",
    font: "'Inter', sans-serif",
    density: "density-normal",
    zoom: 1.0,
    resume: null
  };

  // Track expanded item IDs for clean accordion UX
  const expandedItems = new Set();

  // Cache DOM references
  const DOM = {
    // Header controls
    resumeTitleInput: document.getElementById("resumeTitleInput"),
    atsScorePill: document.getElementById("atsScorePill"),
    atsScoreDot: document.getElementById("atsScoreDot"),
    atsScoreText: document.getElementById("atsScoreText"),
    presetSelect: document.getElementById("profilePresetSelect"),
    templateSelect: document.getElementById("templateSelect"),
    fontSelect: document.getElementById("fontSelect"),
    densitySelect: document.getElementById("densitySelect"),
    colorSwatches: document.querySelectorAll(".color-swatch"),
    customColorPicker: document.getElementById("customColorPicker"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    printBtn: document.getElementById("printBtn"),
    saveJsonBtn: document.getElementById("saveJsonBtn"),
    loadJsonBtn: document.getElementById("loadJsonBtn"),
    syncCliBtn: document.getElementById("syncCliBtn"),
    jsonFileInput: document.getElementById("jsonFileInput"),

    // Zoom controls
    zoomOutBtn: document.getElementById("zoomOutBtn"),
    zoomInBtn: document.getElementById("zoomInBtn"),
    zoomFitBtn: document.getElementById("zoomFitBtn"),
    zoomLevelText: document.getElementById("zoomLevelText"),
    scaleContainer: document.getElementById("scaleContainer"),
    previewWrapper: document.querySelector(".preview-wrapper"),

    // Personal details inputs
    inputJobTitle: document.getElementById("inputJobTitle"),
    inputFirstName: document.getElementById("inputFirstName"),
    inputLastName: document.getElementById("inputLastName"),
    inputEmail: document.getElementById("inputEmail"),
    inputPhone: document.getElementById("inputPhone"),
    inputLocation: document.getElementById("inputLocation"),
    inputLinkedin: document.getElementById("inputLinkedin"),
    inputGithub: document.getElementById("inputGithub"),
    inputWebsite: document.getElementById("inputWebsite"),
    inputPhotoFile: document.getElementById("inputPhotoFile"),
    uploadPhotoBtn: document.getElementById("uploadPhotoBtn"),
    removePhotoBtn: document.getElementById("removePhotoBtn"),
    photoFileName: document.getElementById("photoFileName"),

    // Summary
    inputSummary: document.getElementById("inputSummary"),
    summaryWordCount: document.getElementById("summaryWordCount"),

    // Collections
    expCountLabel: document.getElementById("expCountLabel"),
    experienceContainer: document.getElementById("experienceItemsContainer"),
    addExperienceBtn: document.getElementById("addExperienceBtn"),

    eduCountLabel: document.getElementById("eduCountLabel"),
    educationContainer: document.getElementById("educationItemsContainer"),
    addEducationBtn: document.getElementById("addEducationBtn"),

    inputTechSkills: document.getElementById("inputTechSkills"),
    inputSoftSkills: document.getElementById("inputSoftSkills"),

    projectContainer: document.getElementById("projectItemsContainer"),
    addProjectBtn: document.getElementById("addProjectBtn"),

    certificationContainer: document.getElementById("certificationItemsContainer"),
    addCertBtn: document.getElementById("addCertBtn"),

    inputCustomTitle: document.getElementById("inputCustomTitle"),
    inputCustomItems: document.getElementById("inputCustomItems"),

    // Preview
    resumePaper: document.getElementById("resumePaper")
  };

  function generateId(prefix = "item") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  // =========================================================================
  // Initialization & LocalStorage
  // =========================================================================
  function init() {
    loadInitialState();
    bindEvents();
    populateForm();
    render();
  }

  function loadInitialState() {
    // 1. Check window.RESUME_DATA (loaded via data/resume_data.js from CLI)
    if (window.RESUME_DATA && window.RESUME_DATA.personal) {
      state.resume = JSON.parse(JSON.stringify(window.RESUME_DATA));
      if (window.RESUME_DATA.template) state.template = window.RESUME_DATA.template;
      if (window.RESUME_DATA.color) state.color = window.RESUME_DATA.color;
      if (window.RESUME_DATA.font) state.font = window.RESUME_DATA.font;
      if (window.RESUME_DATA.density) state.density = window.RESUME_DATA.density;
      return;
    }

    // 2. Fallback to localStorage
    try {
      const saved = localStorage.getItem("universal_ats_resume_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resume) {
          state = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load saved resume from localStorage:", e);
    }

    // 3. Fallback to sample profile
    state.resume = JSON.parse(JSON.stringify(SAMPLE_PROFILES.software_engineer));
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem("universal_ats_resume_data", JSON.stringify(state));
    } catch (e) {
      console.warn("Could not auto-save to localStorage:", e);
    }
  }

  // =========================================================================
  // Form Population
  // =========================================================================
  function populateForm() {
    const r = state.resume || {};
    const p = r.personal || {};

    DOM.resumeTitleInput.value = r.title || `${p.fullName || 'Candidate'} - Resume`;

    // Split Full Name into First & Last if needed
    const nameParts = (p.fullName || "").trim().split(/\s+/);
    DOM.inputFirstName.value = nameParts[0] || "";
    DOM.inputLastName.value = nameParts.slice(1).join(" ") || "";
    DOM.inputJobTitle.value = p.jobTitle || "";
    DOM.inputEmail.value = p.email || "";
    DOM.inputPhone.value = p.phone || "";
    DOM.inputLocation.value = p.location || "";
    DOM.inputLinkedin.value = p.linkedin || "";
    DOM.inputGithub.value = p.github || "";
    DOM.inputWebsite.value = p.website || "";

    if (p.photo) {
      DOM.removePhotoBtn.style.display = "inline-flex";
      DOM.photoFileName.textContent = "Photo uploaded";
    } else {
      DOM.removePhotoBtn.style.display = "none";
      DOM.photoFileName.textContent = "No photo";
    }

    DOM.inputSummary.value = r.summary || "";
    updateSummaryWordCount();

    // Skills
    DOM.inputTechSkills.value = (r.skills?.technical || []).join(", ");
    DOM.inputSoftSkills.value = (r.skills?.soft || []).join(", ");

    // Custom
    DOM.inputCustomTitle.value = r.custom?.title || "";
    DOM.inputCustomItems.value = (r.custom?.items || []).join("\n");

    // Dynamic Lists (Expand first item by default if empty)
    if (r.experience && r.experience.length > 0 && expandedItems.size === 0) {
      expandedItems.add(r.experience[0].id || "exp_0");
    }

    renderExperienceForm();
    renderEducationForm();
    renderProjectsForm();
    renderCertificationsForm();

    // Controls
    DOM.templateSelect.value = state.template;
    DOM.fontSelect.value = state.font;
    DOM.densitySelect.value = state.density;
    DOM.customColorPicker.value = state.color;
    updateActiveColorSwatch(state.color);
  }

  function updateSummaryWordCount() {
    const text = (DOM.inputSummary.value || "").trim();
    const count = text ? text.split(/\s+/).length : 0;
    DOM.summaryWordCount.textContent = `${count} words`;
    DOM.summaryWordCount.style.color = (count >= 30 && count <= 90) ? "#059669" : "#64748b";
  }

  // =========================================================================
  // Uncluttered Collapsible Collection Forms (Resume.io UX)
  // =========================================================================

  // Experience
  function renderExperienceForm() {
    DOM.experienceContainer.innerHTML = "";
    const exps = state.resume.experience || [];
    DOM.expCountLabel.textContent = `${exps.length} position${exps.length === 1 ? '' : 's'}`;

    exps.forEach((exp, idx) => {
      const isExpanded = expandedItems.has(exp.id || `exp_${idx}`);
      const box = document.createElement("div");
      box.className = `rio-item-box ${isExpanded ? 'expanded' : ''}`;
      box.dataset.id = exp.id || `exp_${idx}`;

      const titleDisplay = exp.title || "Untitled Position";
      const companyDisplay = exp.company ? ` at ${exp.company}` : "";
      const dateDisplay = (exp.startDate || exp.endDate) ? `${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}` : "";

      box.innerHTML = `
        <div class="rio-item-summary">
          <div class="rio-item-title-col">
            <span class="rio-drag-icon">⋮⋮</span>
            <span class="rio-item-title">${escapeHTML(titleDisplay)}<span class="rio-item-company">${escapeHTML(companyDisplay)}</span></span>
          </div>
          <div class="rio-item-meta">
            <span class="rio-item-date">${escapeHTML(dateDisplay)}</span>
            <button type="button" class="btn btn-danger btn-sm btn-remove-exp" title="Delete position" style="padding:2px 6px;">✕</button>
            <span class="rio-chevron">▼</span>
          </div>
        </div>

        <div class="rio-item-body">
          <div class="rio-form-grid">
            <div class="rio-field">
              <label class="rio-label">Job Title</label>
              <input type="text" class="rio-input exp-title" value="${escapeHTML(exp.title || '')}" placeholder="Software Engineer">
            </div>
            <div class="rio-field">
              <label class="rio-label">Employer / Company</label>
              <input type="text" class="rio-input exp-company" value="${escapeHTML(exp.company || '')}" placeholder="Acme Inc">
            </div>
            <div class="rio-field">
              <label class="rio-label">Location</label>
              <input type="text" class="rio-input exp-location" value="${escapeHTML(exp.location || '')}" placeholder="City, State">
            </div>
            <div class="rio-field">
              <label class="rio-label">Start Date</label>
              <input type="month" class="rio-input exp-start-date" value="${exp.startDate || ''}">
            </div>
            <div class="rio-field">
              <label class="rio-label">End Date</label>
              <input type="month" class="rio-input exp-end-date" value="${exp.endDate || ''}" ${exp.current ? 'disabled' : ''}>
            </div>
            <div class="rio-field" style="justify-content:center; background:transparent;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:0.85em; font-weight:600; color:#475569;">
                <input type="checkbox" class="exp-current" ${exp.current ? 'checked' : ''}>
                Currently work here
              </label>
            </div>
          </div>

          <div class="rio-bullet-group">
            <label class="rio-label" style="display:block; margin-bottom:4px;">Key Achievements &amp; Metrics (Bullet points)</label>
            <div class="bullets-container">
              ${(exp.bullets || [""]).map((b, bIdx) => `
                <div class="rio-bullet-row">
                  <div class="rio-bullet-field">
                    <textarea class="exp-bullet" placeholder="Action verb + Context + Quantifiable Metric...">${escapeHTML(b)}</textarea>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm btn-del-bullet" title="Remove bullet" style="margin-top:8px;">✕</button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="btn btn-secondary btn-sm btn-add-bullet" style="margin-top:4px;">+ Add One More Bullet</button>
          </div>
        </div>
      `;

      // Toggle collapse on summary click
      box.querySelector(".rio-item-summary").addEventListener("click", (e) => {
        if (e.target.closest(".btn-remove-exp")) return;
        const id = exp.id || `exp_${idx}`;
        if (expandedItems.has(id)) {
          expandedItems.delete(id);
          box.classList.remove("expanded");
        } else {
          expandedItems.add(id);
          box.classList.add("expanded");
        }
      });

      // Bind input changes
      const titleInp = box.querySelector(".exp-title");
      const compInp = box.querySelector(".exp-company");
      const locInp = box.querySelector(".exp-location");
      const startInp = box.querySelector(".exp-start-date");
      const endInp = box.querySelector(".exp-end-date");
      const currChk = box.querySelector(".exp-current");

      const updateExp = () => {
        exp.title = titleInp.value;
        exp.company = compInp.value;
        exp.location = locInp.value;
        exp.startDate = startInp.value;
        exp.endDate = endInp.value;
        exp.current = currChk.checked;

        const bulletTexts = Array.from(box.querySelectorAll(".exp-bullet")).map(ta => ta.value);
        exp.bullets = bulletTexts;

        box.querySelector(".rio-item-title").innerHTML = `${escapeHTML(exp.title || "Untitled Position")}<span class="rio-item-company">${escapeHTML(exp.company ? ` at ${exp.company}` : "")}</span>`;
        box.querySelector(".rio-item-date").textContent = (exp.startDate || exp.endDate) ? `${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}` : "";
        onContentChanged();
      };

      [titleInp, compInp, locInp, startInp, endInp].forEach(inp => inp.addEventListener("input", updateExp));
      currChk.addEventListener("change", () => {
        endInp.disabled = currChk.checked;
        if (currChk.checked) endInp.value = "";
        updateExp();
      });

      box.querySelectorAll(".exp-bullet").forEach(bInp => bInp.addEventListener("input", updateExp));

      // Bullet actions
      box.querySelector(".btn-add-bullet").addEventListener("click", () => {
        exp.bullets = exp.bullets || [];
        exp.bullets.push("");
        renderExperienceForm();
        onContentChanged();
      });

      box.querySelectorAll(".btn-del-bullet").forEach((btn, bIdx) => {
        btn.addEventListener("click", () => {
          exp.bullets.splice(bIdx, 1);
          if (exp.bullets.length === 0) exp.bullets.push("");
          renderExperienceForm();
          onContentChanged();
        });
      });

      // Remove Position
      box.querySelector(".btn-remove-exp").addEventListener("click", () => {
        state.resume.experience.splice(idx, 1);
        renderExperienceForm();
        onContentChanged();
      });

      DOM.experienceContainer.appendChild(box);
    });
  }

  // Education
  function renderEducationForm() {
    DOM.educationContainer.innerHTML = "";
    const edus = state.resume.education || [];
    DOM.eduCountLabel.textContent = `${edus.length} degree${edus.length === 1 ? '' : 's'}`;

    edus.forEach((edu, idx) => {
      const isExpanded = expandedItems.has(edu.id || `edu_${idx}`);
      const box = document.createElement("div");
      box.className = `rio-item-box ${isExpanded ? 'expanded' : ''}`;
      box.dataset.id = edu.id || `edu_${idx}`;

      const titleDisplay = edu.degree || "Untitled Degree";
      const schoolDisplay = edu.school ? ` at ${edu.school}` : "";
      const dateDisplay = (edu.startDate || edu.endDate) ? `${edu.startDate || ''} – ${edu.endDate || ''}` : "";

      box.innerHTML = `
        <div class="rio-item-summary">
          <div class="rio-item-title-col">
            <span class="rio-drag-icon">⋮⋮</span>
            <span class="rio-item-title">${escapeHTML(titleDisplay)}<span class="rio-item-company">${escapeHTML(schoolDisplay)}</span></span>
          </div>
          <div class="rio-item-meta">
            <span class="rio-item-date">${escapeHTML(dateDisplay)}</span>
            <button type="button" class="btn btn-danger btn-sm btn-remove-edu" title="Delete education" style="padding:2px 6px;">✕</button>
            <span class="rio-chevron">▼</span>
          </div>
        </div>

        <div class="rio-item-body">
          <div class="rio-form-grid">
            <div class="rio-field rio-form-full">
              <label class="rio-label">Degree &amp; Major</label>
              <input type="text" class="rio-input edu-degree" value="${escapeHTML(edu.degree || '')}" placeholder="B.S. in Computer Science">
            </div>
            <div class="rio-field">
              <label class="rio-label">School / University</label>
              <input type="text" class="rio-input edu-school" value="${escapeHTML(edu.school || '')}" placeholder="UC Berkeley">
            </div>
            <div class="rio-field">
              <label class="rio-label">Location</label>
              <input type="text" class="rio-input edu-location" value="${escapeHTML(edu.location || '')}" placeholder="Berkeley, CA">
            </div>
            <div class="rio-field">
              <label class="rio-label">Start Date</label>
              <input type="month" class="rio-input edu-start-date" value="${edu.startDate || ''}">
            </div>
            <div class="rio-field">
              <label class="rio-label">End / Graduation Date</label>
              <input type="month" class="rio-input edu-end-date" value="${edu.endDate || ''}">
            </div>
            <div class="rio-field rio-form-full">
              <label class="rio-label">GPA / Academic Honors</label>
              <input type="text" class="rio-input edu-gpa" value="${escapeHTML(edu.gpa || '')}" placeholder="3.85 / 4.0, Dean's Honor List">
            </div>
          </div>
        </div>
      `;

      box.querySelector(".rio-item-summary").addEventListener("click", (e) => {
        if (e.target.closest(".btn-remove-edu")) return;
        const id = edu.id || `edu_${idx}`;
        if (expandedItems.has(id)) {
          expandedItems.delete(id);
          box.classList.remove("expanded");
        } else {
          expandedItems.add(id);
          box.classList.add("expanded");
        }
      });

      const degInp = box.querySelector(".edu-degree");
      const schInp = box.querySelector(".edu-school");
      const locInp = box.querySelector(".edu-location");
      const startInp = box.querySelector(".edu-start-date");
      const endInp = box.querySelector(".edu-end-date");
      const gpaInp = box.querySelector(".edu-gpa");

      const updateEdu = () => {
        edu.degree = degInp.value;
        edu.school = schInp.value;
        edu.location = locInp.value;
        edu.startDate = startInp.value;
        edu.endDate = endInp.value;
        edu.gpa = gpaInp.value;

        box.querySelector(".rio-item-title").innerHTML = `${escapeHTML(edu.degree || "Untitled Degree")}<span class="rio-item-company">${escapeHTML(edu.school ? ` at ${edu.school}` : "")}</span>`;
        box.querySelector(".rio-item-date").textContent = (edu.startDate || edu.endDate) ? `${edu.startDate || ''} – ${edu.endDate || ''}` : "";
        onContentChanged();
      };

      [degInp, schInp, locInp, startInp, endInp, gpaInp].forEach(inp => inp.addEventListener("input", updateEdu));

      box.querySelector(".btn-remove-edu").addEventListener("click", () => {
        state.resume.education.splice(idx, 1);
        renderEducationForm();
        onContentChanged();
      });

      DOM.educationContainer.appendChild(box);
    });
  }

  // Projects
  function renderProjectsForm() {
    DOM.projectContainer.innerHTML = "";
    (state.resume.projects || []).forEach((proj, idx) => {
      const isExpanded = expandedItems.has(proj.id || `proj_${idx}`);
      const box = document.createElement("div");
      box.className = `rio-item-box ${isExpanded ? 'expanded' : ''}`;
      box.dataset.id = proj.id || `proj_${idx}`;

      box.innerHTML = `
        <div class="rio-item-summary">
          <div class="rio-item-title-col">
            <span class="rio-drag-icon">⋮⋮</span>
            <span class="rio-item-title">${escapeHTML(proj.name || "Untitled Project")}</span>
          </div>
          <div class="rio-item-meta">
            <button type="button" class="btn btn-danger btn-sm btn-remove-proj" title="Delete project" style="padding:2px 6px;">✕</button>
            <span class="rio-chevron">▼</span>
          </div>
        </div>

        <div class="rio-item-body">
          <div class="rio-form-grid">
            <div class="rio-field">
              <label class="rio-label">Project Name</label>
              <input type="text" class="rio-input proj-name" value="${escapeHTML(proj.name || '')}" placeholder="Distributed Cache">
            </div>
            <div class="rio-field">
              <label class="rio-label">Link / Repository URL</label>
              <input type="text" class="rio-input proj-link" value="${escapeHTML(proj.link || '')}" placeholder="github.com/project">
            </div>
            <div class="rio-field rio-form-full">
              <label class="rio-label">Technologies Used</label>
              <input type="text" class="rio-input proj-tech" value="${escapeHTML(proj.tech || '')}" placeholder="Go, React, Redis, Docker">
            </div>
            <div class="rio-field rio-form-full">
              <label class="rio-label">Description &amp; Key Impact</label>
              <textarea class="rio-input proj-desc" placeholder="Quantifiable metrics and achievements...">${escapeHTML(proj.description || '')}</textarea>
            </div>
          </div>
        </div>
      `;

      box.querySelector(".rio-item-summary").addEventListener("click", (e) => {
        if (e.target.closest(".btn-remove-proj")) return;
        const id = proj.id || `proj_${idx}`;
        if (expandedItems.has(id)) {
          expandedItems.delete(id);
          box.classList.remove("expanded");
        } else {
          expandedItems.add(id);
          box.classList.add("expanded");
        }
      });

      const nameInp = box.querySelector(".proj-name");
      const linkInp = box.querySelector(".proj-link");
      const techInp = box.querySelector(".proj-tech");
      const descInp = box.querySelector(".proj-desc");

      const updateProj = () => {
        proj.name = nameInp.value;
        proj.link = linkInp.value;
        proj.tech = techInp.value;
        proj.description = descInp.value;
        box.querySelector(".rio-item-title").textContent = proj.name || "Untitled Project";
        onContentChanged();
      };

      [nameInp, linkInp, techInp, descInp].forEach(inp => inp.addEventListener("input", updateProj));

      box.querySelector(".btn-remove-proj").addEventListener("click", () => {
        state.resume.projects.splice(idx, 1);
        renderProjectsForm();
        onContentChanged();
      });

      DOM.projectContainer.appendChild(box);
    });
  }

  // Certifications
  function renderCertificationsForm() {
    DOM.certificationContainer.innerHTML = "";
    (state.resume.certifications || []).forEach((cert, idx) => {
      const isExpanded = expandedItems.has(cert.id || `cert_${idx}`);
      const box = document.createElement("div");
      box.className = `rio-item-box ${isExpanded ? 'expanded' : ''}`;
      box.dataset.id = cert.id || `cert_${idx}`;

      box.innerHTML = `
        <div class="rio-item-summary">
          <div class="rio-item-title-col">
            <span class="rio-drag-icon">⋮⋮</span>
            <span class="rio-item-title">${escapeHTML(cert.name || "Untitled Certification")}</span>
          </div>
          <div class="rio-item-meta">
            <button type="button" class="btn btn-danger btn-sm btn-remove-cert" title="Delete certification" style="padding:2px 6px;">✕</button>
            <span class="rio-chevron">▼</span>
          </div>
        </div>

        <div class="rio-item-body">
          <div class="rio-form-grid">
            <div class="rio-field rio-form-full">
              <label class="rio-label">Certification Name</label>
              <input type="text" class="rio-input cert-name" value="${escapeHTML(cert.name || '')}" placeholder="AWS Solutions Architect">
            </div>
            <div class="rio-field">
              <label class="rio-label">Issuer</label>
              <input type="text" class="rio-input cert-issuer" value="${escapeHTML(cert.issuer || '')}" placeholder="Amazon Web Services">
            </div>
            <div class="rio-field">
              <label class="rio-label">Year / Date</label>
              <input type="text" class="rio-input cert-date" value="${escapeHTML(cert.date || '')}" placeholder="2023">
            </div>
          </div>
        </div>
      `;

      box.querySelector(".rio-item-summary").addEventListener("click", (e) => {
        if (e.target.closest(".btn-remove-cert")) return;
        const id = cert.id || `cert_${idx}`;
        if (expandedItems.has(id)) {
          expandedItems.delete(id);
          box.classList.remove("expanded");
        } else {
          expandedItems.add(id);
          box.classList.add("expanded");
        }
      });

      const nameInp = box.querySelector(".cert-name");
      const issuerInp = box.querySelector(".cert-issuer");
      const dateInp = box.querySelector(".cert-date");

      const updateCert = () => {
        cert.name = nameInp.value;
        cert.issuer = issuerInp.value;
        cert.date = dateInp.value;
        box.querySelector(".rio-item-title").textContent = cert.name || "Untitled Certification";
        onContentChanged();
      };

      [nameInp, issuerInp, dateInp].forEach(inp => inp.addEventListener("input", updateCert));

      box.querySelector(".btn-remove-cert").addEventListener("click", () => {
        state.resume.certifications.splice(idx, 1);
        renderCertificationsForm();
        onContentChanged();
      });

      DOM.certificationContainer.appendChild(box);
    });
  }

  // =========================================================================
  // Content & State Synchronization
  // =========================================================================
  function syncPersonalDetails() {
    state.resume.personal = state.resume.personal || {};
    const first = (DOM.inputFirstName.value || "").trim();
    const last = (DOM.inputLastName.value || "").trim();
    state.resume.personal.fullName = [first, last].filter(Boolean).join(" ");
    state.resume.personal.jobTitle = DOM.inputJobTitle.value;
    state.resume.personal.email = DOM.inputEmail.value;
    state.resume.personal.phone = DOM.inputPhone.value;
    state.resume.personal.location = DOM.inputLocation.value;
    state.resume.personal.linkedin = DOM.inputLinkedin.value;
    state.resume.personal.github = DOM.inputGithub.value;
    state.resume.personal.website = DOM.inputWebsite.value;
    state.resume.title = DOM.resumeTitleInput.value;
  }

  function syncSummary() {
    state.resume.summary = DOM.inputSummary.value;
    updateSummaryWordCount();
  }

  function syncSkills() {
    state.resume.skills = state.resume.skills || {};
    state.resume.skills.technical = DOM.inputTechSkills.value
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    state.resume.skills.soft = DOM.inputSoftSkills.value
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  function syncCustom() {
    state.resume.custom = state.resume.custom || {};
    state.resume.custom.title = DOM.inputCustomTitle.value;
    state.resume.custom.items = DOM.inputCustomItems.value
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  function onContentChanged() {
    syncPersonalDetails();
    syncSummary();
    syncSkills();
    syncCustom();
    saveStateToStorage();
    render();
  }

  // =========================================================================
  // Render View & ATS Audit
  // =========================================================================
  function render() {
    DOM.resumePaper.style.setProperty("--accent-color", state.color);
    DOM.resumePaper.style.setProperty("--accent-light", `${state.color}14`);
    DOM.resumePaper.style.setProperty("--font-family", state.font);
    DOM.resumePaper.className = `resume-paper ${state.density}`;

    const html = renderResume(state.template, state.resume);
    DOM.resumePaper.innerHTML = html;

    updateATSMeter();
  }

  function updateATSMeter() {
    const analysis = analyzeATS(state.resume);

    DOM.atsScoreText.textContent = `Resume score: ${analysis.score}%`;
    DOM.atsScoreDot.style.backgroundColor = analysis.color;

    if (analysis.score >= 90) {
      DOM.atsScorePill.style.background = "#ecfdf5";
      DOM.atsScorePill.style.borderColor = "#a7f3d0";
      DOM.atsScorePill.style.color = "#059669";
    } else if (analysis.score >= 70) {
      DOM.atsScorePill.style.background = "#eff6ff";
      DOM.atsScorePill.style.borderColor = "#bfdbfe";
      DOM.atsScorePill.style.color = "#2563eb";
    } else {
      DOM.atsScorePill.style.background = "#fffbeb";
      DOM.atsScorePill.style.borderColor = "#fde68a";
      DOM.atsScorePill.style.color = "#d97706";
    }
  }

  // =========================================================================
  // Event Bindings
  // =========================================================================
  function bindEvents() {
    DOM.resumeTitleInput.addEventListener("input", onContentChanged);

    DOM.presetSelect.addEventListener("change", (e) => {
      const key = e.target.value;
      if (SAMPLE_PROFILES[key]) {
        state.resume = JSON.parse(JSON.stringify(SAMPLE_PROFILES[key]));
        expandedItems.clear();
        populateForm();
        onContentChanged();
      }
    });

    DOM.templateSelect.addEventListener("change", (e) => {
      state.template = e.target.value;
      saveStateToStorage();
      render();
    });

    DOM.fontSelect.addEventListener("change", (e) => {
      state.font = e.target.value;
      saveStateToStorage();
      render();
    });

    DOM.densitySelect.addEventListener("change", (e) => {
      state.density = e.target.value;
      saveStateToStorage();
      render();
    });

    DOM.colorSwatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
        setColor(swatch.dataset.color);
      });
    });

    DOM.customColorPicker.addEventListener("input", (e) => {
      setColor(e.target.value);
    });

    function setColor(hex) {
      state.color = hex;
      updateActiveColorSwatch(hex);
      saveStateToStorage();
      render();
    }

    const personalInputs = [
      DOM.inputJobTitle, DOM.inputFirstName, DOM.inputLastName,
      DOM.inputEmail, DOM.inputPhone, DOM.inputLocation,
      DOM.inputLinkedin, DOM.inputGithub, DOM.inputWebsite
    ];
    personalInputs.forEach(inp => inp.addEventListener("input", onContentChanged));

    DOM.inputSummary.addEventListener("input", onContentChanged);
    DOM.inputTechSkills.addEventListener("input", onContentChanged);
    DOM.inputSoftSkills.addEventListener("input", onContentChanged);
    DOM.inputCustomTitle.addEventListener("input", onContentChanged);
    DOM.inputCustomItems.addEventListener("input", onContentChanged);

    // Photo Upload
    DOM.uploadPhotoBtn.addEventListener("click", () => DOM.inputPhotoFile.click());
    DOM.inputPhotoFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.resume.personal.photo = event.target.result;
          DOM.removePhotoBtn.style.display = "inline-flex";
          DOM.photoFileName.textContent = file.name;
          onContentChanged();
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.removePhotoBtn.addEventListener("click", () => {
      state.resume.personal.photo = "";
      DOM.inputPhotoFile.value = "";
      DOM.removePhotoBtn.style.display = "none";
      DOM.photoFileName.textContent = "No photo";
      onContentChanged();
    });

    // Add buttons
    DOM.addExperienceBtn.addEventListener("click", () => {
      state.resume.experience = state.resume.experience || [];
      const newId = generateId("exp");
      state.resume.experience.push({
        id: newId,
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [""]
      });
      expandedItems.add(newId);
      renderExperienceForm();
      onContentChanged();
    });

    DOM.addEducationBtn.addEventListener("click", () => {
      state.resume.education = state.resume.education || [];
      const newId = generateId("edu");
      state.resume.education.push({
        id: newId,
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: ""
      });
      expandedItems.add(newId);
      renderEducationForm();
      onContentChanged();
    });

    DOM.addProjectBtn.addEventListener("click", () => {
      state.resume.projects = state.resume.projects || [];
      const newId = generateId("proj");
      state.resume.projects.push({
        id: newId,
        name: "",
        tech: "",
        link: "",
        description: ""
      });
      expandedItems.add(newId);
      renderProjectsForm();
      onContentChanged();
    });

    DOM.addCertBtn.addEventListener("click", () => {
      state.resume.certifications = state.resume.certifications || [];
      const newId = generateId("cert");
      state.resume.certifications.push({
        id: newId,
        name: "",
        issuer: "",
        date: "",
        url: ""
      });
      expandedItems.add(newId);
      renderCertificationsForm();
      onContentChanged();
    });

    // Zoom
    DOM.zoomInBtn.addEventListener("click", () => setZoom(state.zoom + 0.1));
    DOM.zoomOutBtn.addEventListener("click", () => setZoom(state.zoom - 0.1));
    DOM.zoomFitBtn.addEventListener("click", () => {
      const containerWidth = DOM.previewWrapper.clientWidth - 40;
      const paperWidth = 794;
      const fitZoom = Math.min(1.0, containerWidth / paperWidth);
      setZoom(fitZoom);
    });

    function setZoom(val) {
      state.zoom = Math.max(0.4, Math.min(1.8, parseFloat(val.toFixed(2))));
      DOM.scaleContainer.style.transform = `scale(${state.zoom})`;
      DOM.zoomLevelText.textContent = `${Math.round(state.zoom * 100)}%`;
    }

    // Print & PDF
    DOM.printBtn.addEventListener("click", () => window.print());
    DOM.downloadPdfBtn.addEventListener("click", generatePDF);

    // JSON Save & Load
    DOM.saveJsonBtn.addEventListener("click", exportJSON);
    DOM.loadJsonBtn.addEventListener("click", () => DOM.jsonFileInput.click());
    DOM.jsonFileInput.addEventListener("change", importJSON);

    // Sync CLI
    DOM.syncCliBtn.addEventListener("click", () => {
      localStorage.removeItem("universal_ats_resume_data");
      window.location.reload();
    });
  }

  function updateActiveColorSwatch(hex) {
    DOM.colorSwatches.forEach(swatch => {
      if (swatch.dataset.color.toLowerCase() === hex.toLowerCase()) {
        swatch.classList.add("active");
      } else {
        swatch.classList.remove("active");
      }
    });
  }

  function generatePDF() {
    const element = DOM.resumePaper;
    const name = (state.resume.personal?.fullName || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_");
    const opt = {
      margin: 0,
      filename: `${name}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    DOM.downloadPdfBtn.disabled = true;
    DOM.downloadPdfBtn.textContent = "Generating PDF...";

    html2pdf().set(opt).from(element).save().then(() => {
      DOM.downloadPdfBtn.disabled = false;
      DOM.downloadPdfBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download PDF
      `;
    }).catch(err => {
      console.error("PDF generation error:", err);
      alert("Error generating PDF. You can also click 'Print' and select 'Save as PDF'.");
      DOM.downloadPdfBtn.disabled = false;
      DOM.downloadPdfBtn.textContent = "Download PDF";
    });
  }

  function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.resume, null, 2));
    const dlAnchor = document.createElement("a");
    const name = (state.resume.personal?.fullName || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${name}_Resume_Data.json`);
    dlAnchor.click();
    dlAnchor.remove();
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.personal) {
          state.resume = parsed;
        } else if (parsed.resume) {
          state = parsed;
        }
        expandedItems.clear();
        populateForm();
        onContentChanged();
        alert("Resume successfully imported!");
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  document.addEventListener("DOMContentLoaded", init);
})();
