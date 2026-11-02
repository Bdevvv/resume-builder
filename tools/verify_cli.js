/**
 * Automated Verification Suite for Resume CLI & Candidate Automation
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CLI_PATH = path.resolve(__dirname, "../bin/resume-cli");
const CANDIDATE_NAME = "Maya Lin";
const CANDIDATE_DIR = path.resolve(__dirname, "../../Maya Lin resume");

console.log("=== RESUME CLI & CANDIDATE AUTOMATION VERIFICATION ===");
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

try {
  // Clean up candidate directory before test if exists
  if (fs.existsSync(CANDIDATE_DIR)) {
    fs.rmSync(CANDIDATE_DIR, { recursive: true, force: true });
  }

  // 1. Test CLI Help / Show
  const showOutput = execSync(`node "${CLI_PATH}" show`, { encoding: "utf-8" });
  assert(showOutput.includes("RESUME:"), "resume-cli show prints resume summary");
  assert(showOutput.includes("ATS SCORE:"), "resume-cli show computes ATS score");

  // 2. Test Candidate Package Generation
  console.log(`\nTesting 'generate' command for candidate: ${CANDIDATE_NAME}...`);
  const genOutput = execSync(
    `node "${CLI_PATH}" generate --name "${CANDIDATE_NAME}" --title "Lead AI Architect" --email "maya.lin@ai.com" --phone "+1 (555) 018-9999" --location "San Francisco, CA" --summary "Pioneering Lead AI Architect with 8+ years of deep learning research and scalable LLM inference experience. Spearheaded distributed training pipelines reducing training time by 42% ($2.1M compute savings)." --template london`,
    { encoding: "utf-8" }
  );

  assert(genOutput.includes("Generated candidate package"), "generate command reports success");
  assert(fs.existsSync(CANDIDATE_DIR), "Candidate directory was created");

  const htmlPath = path.join(CANDIDATE_DIR, "resume.html");
  assert(fs.existsSync(htmlPath), "Candidate resume.html was generated");

  const jsonPath = path.join(CANDIDATE_DIR, "data", "resume_data.json");
  assert(fs.existsSync(jsonPath), "Candidate data/resume_data.json was generated");

  const jsPath = path.join(CANDIDATE_DIR, "data", "resume_data.js");
  assert(fs.existsSync(jsPath), "Candidate data/resume_data.js was generated");

  const cssPath = path.join(CANDIDATE_DIR, "css", "templates.css");
  assert(fs.existsSync(cssPath), "Candidate offline assets/css/templates.css was copied");

  // Verify candidate data accuracy
  const savedData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  assert(savedData.personal.fullName === CANDIDATE_NAME, "Candidate name matches in JSON");
  assert(savedData.personal.jobTitle === "Lead AI Architect", "Candidate title matches in JSON");
  assert(savedData.summary.includes("compute savings"), "Candidate summary matches in JSON");

  // 3. Test Incremental Job Addition
  console.log("\nTesting incremental 'add-job' command...");
  execSync(
    `node "${CLI_PATH}" add-job --title "Principal Research Scientist" --company "DeepMind" --location "London, UK" --start "2020-01" --bullets "Engineered reinforcement learning framework;Accelerated simulation throughput by 3.5x"`,
    { encoding: "utf-8" }
  );

  const updatedJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/resume_data.json"), "utf-8"));
  assert(updatedJson.experience[0].title === "Principal Research Scientist", "New job added to experience list");
  assert(updatedJson.experience[0].bullets.length === 2, "Job bullets parsed correctly");

  // 4. Test Template Bullet Alignment (No isolated dot spans)
  const templatesJs = fs.readFileSync(path.join(__dirname, "../js/templates.js"), "utf-8");
  assert(!templatesJs.includes("<span class=\"contact-sep\">•</span>"), "Eliminated isolated wrapping dot spans from contact row");

  const templatesCss = fs.readFileSync(path.join(__dirname, "../css/templates.css"), "utf-8");
  assert(templatesCss.includes("list-style-position: outside !important;"), "List styles anchored to outside position");
  assert(templatesCss.includes("@page {\n    size: A4 portrait;\n    margin: 0;\n  }"), "Exact A4 print rules present in CSS");

  console.log("\n================================================");
  console.log(`Verification Summary: ${passed} Passed, ${failed} Failed`);
} catch (err) {
  console.error("Test execution failed:", err.message);
  if (err.stdout) console.log(err.stdout);
  if (err.stderr) console.error(err.stderr);
  process.exit(1);
}
