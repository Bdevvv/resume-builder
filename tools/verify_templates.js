/**
 * Verification Test Suite for Universal ATS Resume Builder
 */

const { renderResume, TEMPLATE_MAP } = require("../js/templates.js");
const { analyzeATS } = require("../js/ats-checker.js");
const fs = require("fs");
const path = require("path");

// Read sample profiles
const sampleDataContent = fs.readFileSync(path.join(__dirname, "../js/sample-data.js"), "utf-8");
// Evaluate SAMPLE_PROFILES in node context
const evalContext = {};
const extractSampleProfiles = new Function(sampleDataContent + "; return SAMPLE_PROFILES;");
const SAMPLE_PROFILES = extractSampleProfiles();

console.log("=== UNIVERSAL ATS RESUME BUILDER VERIFICATION ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify Sample Profiles Existence
assert(SAMPLE_PROFILES.software_engineer, "software_engineer profile exists");
assert(SAMPLE_PROFILES.product_manager, "product_manager profile exists");
assert(SAMPLE_PROFILES.blank, "blank profile exists");

// 2. Verify all 8 Templates Render Correctly
const templateKeys = ["london", "stockholm", "toronto", "dublin", "vienna", "sydney", "berlin", "athens"];

templateKeys.forEach(tKey => {
  try {
    const html = renderResume(tKey, SAMPLE_PROFILES.software_engineer);
    assert(typeof html === "string" && html.length > 200, `Template '${tKey}' renders valid HTML with software_engineer profile`);
    assert(html.includes("Alex Morgan"), `Template '${tKey}' includes applicant name`);
    assert(html.includes("Senior Software Engineer"), `Template '${tKey}' includes job title`);
    assert(!html.includes("undefined") && !html.includes("null"), `Template '${tKey}' contains no undefined/null placeholders`);
  } catch (err) {
    assert(false, `Template '${tKey}' failed to render: ${err.message}`);
  }
});

// 3. Verify Blank Profile Handling across all templates
templateKeys.forEach(tKey => {
  try {
    const html = renderResume(tKey, SAMPLE_PROFILES.blank);
    assert(typeof html === "string", `Template '${tKey}' handles blank profile gracefully without crash`);
  } catch (err) {
    assert(false, `Template '${tKey}' crashed on blank profile: ${err.message}`);
  }
});

// 4. Verify ATS Scoring Engine
const seAnalysis = analyzeATS(SAMPLE_PROFILES.software_engineer);
assert(seAnalysis.score >= 90, `Software Engineer sample achieves 90+ ATS score (Actual: ${seAnalysis.score})`);
assert(seAnalysis.rating === "ATS Optimized", `Software Engineer rating is 'ATS Optimized' (Actual: ${seAnalysis.rating})`);
assert(seAnalysis.detectedVerbs.length >= 4, `Detected at least 4 power action verbs (Actual: ${seAnalysis.detectedVerbs.length})`);
assert(seAnalysis.metricCount >= 3, `Detected at least 3 quantifiable metrics (Actual: ${seAnalysis.metricCount})`);

const blankAnalysis = analyzeATS(SAMPLE_PROFILES.blank);
assert(blankAnalysis.score < 30, `Blank profile scores low on ATS meter (Actual: ${blankAnalysis.score})`);
assert(blankAnalysis.suggestions.length > 0, `Blank profile provides actionable suggestions (Count: ${blankAnalysis.suggestions.length})`);

console.log("\n================================================");
console.log(`Verification Summary: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("All tests completed successfully!");
}
