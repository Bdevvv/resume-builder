/**
 * ATS Optimization & Scoring Engine
 * Analyzes resume content against industry Applicant Tracking System rules.
 */

const ACTION_VERBS = [
  "accelerated", "accomplished", "achieved", "acquired", "administered", "advised", "amplified",
  "analyzed", "architected", "authored", "automated", "boosted", "budgeted", "built", "championed",
  "collaborated", "constructed", "coordinated", "crafted", "decreased", "delivered", "deployed",
  "designed", "developed", "devised", "directed", "doubled", "drove", "eliminated", "engineered",
  "enhanced", "established", "exceeded", "executed", "expanded", "expedited", "fabricated",
  "facilitated", "formulated", "founded", "generated", "governed", "guided", "halted", "headed",
  "identified", "implemented", "improved", "increased", "initiated", "innovated", "inspected",
  "instituted", "integrated", "invented", "launched", "led", "managed", "maximized", "mentored",
  "migrated", "minimized", "modernized", "negotiated", "optimized", "orchestrated", "organized",
  "overhauled", "oversaw", "pioneered", "planned", "produced", "programmed", "promoted", "rebuilt",
  "reduced", "refined", "remodeled", "resolved", "restructured", "revamped", "saved", "scaled",
  "secured", "simplified", "slashed", "spearheaded", "standardized", "steered", "streamlined",
  "strengthened", "surpassed", "transformed", "unified", "upgraded", "validated", "yielded"
];

const ATS_SECTION_KEYWORDS = [
  "experience", "work experience", "employment", "history", "education",
  "skills", "summary", "profile", "projects", "certifications"
];

function analyzeATS(resume) {
  let score = 0;
  const breakdown = [];
  const suggestions = [];
  const detectedVerbs = new Set();
  let metricCount = 0;

  // 1. Personal & Contact Information (Max 20 pts)
  let contactPoints = 0;
  const p = resume.personal || {};
  if (p.fullName && p.fullName.trim().length >= 3) contactPoints += 5;
  else suggestions.push("Add your full first and last name.");

  if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) contactPoints += 5;
  else suggestions.push("Provide a valid professional email address (e.g. name@email.com).");

  if (p.phone && p.phone.trim().length >= 7) contactPoints += 4;
  else suggestions.push("Add a readable contact phone number with country/area code.");

  if (p.location && p.location.trim().length >= 3) contactPoints += 3;
  else suggestions.push("Include your City and State/Country for geographic ATS matching.");

  if (p.linkedin && p.linkedin.trim().length > 5) contactPoints += 3;
  else suggestions.push("Include a link to your LinkedIn profile or portfolio.");

  score += contactPoints;
  breakdown.push({
    category: "Contact & Identity",
    earned: contactPoints,
    max: 20,
    status: contactPoints >= 18 ? "pass" : "warn"
  });

  // 2. Professional Summary (Max 15 pts)
  let summaryPoints = 0;
  const summary = (resume.summary || "").trim();
  const wordCount = summary ? summary.split(/\s+/).length : 0;
  if (wordCount >= 25 && wordCount <= 120) {
    summaryPoints = 15;
  } else if (wordCount > 10 && wordCount < 25) {
    summaryPoints = 8;
    suggestions.push("Expand your Professional Summary (aim for 30–80 words highlighting years of experience and core strengths).");
  } else if (wordCount > 120) {
    summaryPoints = 10;
    suggestions.push("Your summary is slightly long. Condense it to under 100 words so recruiters can skim it in 6 seconds.");
  } else {
    suggestions.push("Add a 2–4 sentence Professional Summary to introduce your top achievements.");
  }
  score += summaryPoints;
  breakdown.push({
    category: "Professional Summary",
    earned: summaryPoints,
    max: 15,
    status: summaryPoints >= 12 ? "pass" : "warn"
  });

  // 3. Work Experience & Formatting (Max 25 pts)
  let expPoints = 0;
  const exps = resume.experience || [];
  if (exps.length > 0) {
    expPoints += 5; // Has experience
    let validRoles = 0;
    let totalBullets = 0;
    exps.forEach(exp => {
      if (exp.title && exp.company) validRoles++;
      const bullets = (exp.bullets || []).filter(b => b && b.trim().length > 10);
      totalBullets += bullets.length;

      // Scan bullets for verbs and metrics
      bullets.forEach(b => {
        const textLower = b.toLowerCase();
        ACTION_VERBS.forEach(v => {
          if (new RegExp(`\\b${v}\\b`, "i").test(textLower)) {
            detectedVerbs.add(v);
          }
        });
        // Scan for numbers, percentages, currency, multipliers
        const metrics = b.match(/(\d+[\d,.]*|\$\d+|\d+%\b|\d+x\b|\d+\+)/g);
        if (metrics) metricCount += metrics.length;
      });
    });

    if (validRoles >= 1) expPoints += 5;
    if (totalBullets >= 3) expPoints += 10;
    else if (totalBullets >= 1) {
      expPoints += 5;
      suggestions.push("Add at least 3 accomplishment-focused bullet points for your primary roles.");
    }
    if (exps.some(e => e.startDate)) expPoints += 5;
  } else {
    suggestions.push("Add at least one professional work experience or relevant internship.");
  }
  score += expPoints;
  breakdown.push({
    category: "Work Experience",
    earned: expPoints,
    max: 25,
    status: expPoints >= 20 ? "pass" : "warn"
  });

  // 4. Quantifiable Metrics & Action Verbs (Max 20 pts)
  let impactPoints = 0;
  // Metrics points (max 10)
  if (metricCount >= 4) impactPoints += 10;
  else if (metricCount >= 2) impactPoints += 6;
  else if (metricCount >= 1) impactPoints += 3;
  if (metricCount < 3) {
    suggestions.push("Quantify achievements with measurable numbers (e.g., 'boosted sales by 28%', 'saved $50k', 'managed team of 8').");
  }

  // Action Verbs points (max 10)
  const verbCount = detectedVerbs.size;
  if (verbCount >= 6) impactPoints += 10;
  else if (verbCount >= 3) impactPoints += 6;
  else if (verbCount >= 1) impactPoints += 3;
  if (verbCount < 4) {
    suggestions.push("Begin bullet points with strong power verbs (e.g., Spearheaded, Engineered, Overhauled, Orchestrated).");
  }

  score += impactPoints;
  breakdown.push({
    category: "Impact & Action Verbs",
    earned: impactPoints,
    max: 20,
    status: impactPoints >= 15 ? "pass" : "warn"
  });

  // 5. Skills & Keyword Density (Max 10 pts)
  let skillPoints = 0;
  const techSkills = (resume.skills && resume.skills.technical) || [];
  const softSkills = (resume.skills && resume.skills.soft) || [];
  const totalSkills = techSkills.length + softSkills.length;
  if (totalSkills >= 8) skillPoints += 10;
  else if (totalSkills >= 4) skillPoints += 6;
  else if (totalSkills >= 1) skillPoints += 3;
  if (totalSkills < 6) {
    suggestions.push("Add at least 6–10 relevant hard skills, tools, and technical competencies.");
  }
  score += skillPoints;
  breakdown.push({
    category: "Skills & Keywords",
    earned: skillPoints,
    max: 10,
    status: skillPoints >= 8 ? "pass" : "warn"
  });

  // 6. Education & Certifications (Max 10 pts)
  let eduPoints = 0;
  const edus = resume.education || [];
  if (edus.length > 0 && edus[0].school && edus[0].degree) eduPoints += 7;
  else suggestions.push("List your formal education (Degree, Institution name, Graduation year).");

  const certs = resume.certifications || [];
  if (certs.length > 0) eduPoints += 3;
  score += eduPoints;
  breakdown.push({
    category: "Education & Credentials",
    earned: eduPoints,
    max: 10,
    status: eduPoints >= 7 ? "pass" : "warn"
  });

  // Determine overall status
  let rating = "Needs Work";
  let color = "#ef4444"; // red
  if (score >= 90) {
    rating = "ATS Optimized";
    color = "#10b981"; // green
  } else if (score >= 75) {
    rating = "Good";
    color = "#3b82f6"; // blue
  } else if (score >= 50) {
    rating = "Moderate";
    color = "#f59e0b"; // amber
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    rating,
    color,
    breakdown,
    suggestions: suggestions.slice(0, 4), // Top 4 priority recommendations
    metricCount,
    detectedVerbs: Array.from(detectedVerbs)
  };
}

// Export for Node or browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { analyzeATS, ACTION_VERBS };
}
