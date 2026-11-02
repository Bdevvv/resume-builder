---
name: resume-builder
description: Use when the user wants to create, generate, or update an ATS-optimized resume for a candidate from scratch, job description, or profile data. Creates a dedicated folder in the candidate's name, generates a self-contained Resume.io-style HTML builder/preview file, and compiles an A4 vector PDF.
---

# Resume Builder Skill

Generates high-impact, ATS-optimized resumes with 8+ Resume.io-cloned templates (London, Stockholm, Toronto, Dublin, Vienna, Sydney, Berlin, Athens). 
Every resume is constructed with strict A4 print geometry, bullet-proof list alignment (no orphan bullet wrapping), and live ATS compliance auditing.

## When to Use
- "Create a resume for [Candidate Name]"
- "Make an ATS resume from this profile / LinkedIn text"
- "Generate resume for [Candidate] applying for [Role]"
- "Build resume from scratch"
- "Update [Candidate]'s resume"

## The Workflow

### 1. Extract & Format Candidate Information
From the user's prompt, uploaded file, or past chat history, assemble the candidate's information:
- **Full Name** & **Target Job Title**
- **Contact Details**: Email, Phone, Location (City, State/Country), LinkedIn URL, GitHub/Portfolio
- **Professional Summary**: 30–80 words with core tech stack, years of experience, and top accomplishments
- **Employment History**: Role, Company, Location, Dates (YYYY-MM), and 3–5 accomplishment bullets
  - Every bullet must begin with a strong power action verb (e.g., *Architected*, *Spearheaded*, *Overhauled*, *Engineered*, *Scaled*)
  - Include quantifiable metrics (% improvement, dollar savings, throughput numbers, team sizes)
- **Education**: Degree, Institution, Location, Graduation Year, GPA/Honors
- **Skills**: Categorized into technical and core strengths
- **Key Projects & Certifications**: Name, technologies, links, and credentials

### 2. Generate Candidate Workspace via CLI
Execute the zero-dependency CLI tool:

```bash
node /Users/bhadreshdas/Hadon/resume-builder/bin/resume-cli generate \
  --name "<Candidate Name>" \
  --title "<Target Job Title>" \
  --email "<email>" \
  --phone "<phone>" \
  --location "<City, State>" \
  --summary "<Summary text>" \
  --template london \
  [--input profile.json] \
  [--out-dir "/custom/path"]
```

Or pass a JSON profile:
```bash
node /Users/bhadreshdas/Hadon/resume-builder/bin/resume-cli generate \
  --name "<Candidate Name>" \
  --input /path/to/profile.json
```

### 3. Automatic Output Generation
The CLI automatically:
1. Creates a dedicated directory: `/Users/bhadreshdas/Hadon/<Candidate Name> resume/`
2. Generates `resume.html` containing the clean Resume.io-style editor and live template preview
3. Generates `resume_data.json` and `resume_data.js`
4. Bundles offline styles (`css/`, `js/`, `lib/`)
5. Compiles a crisp, printable A4 vector `resume.pdf`

### 4. Report Results to User
Present the generated files as clickable links:
- 📂 **Folder**: [Candidate Workspace](file:///Users/bhadreshdas/Hadon/<Candidate Name>%20resume/)
- 📄 **HTML Viewer/Editor**: [resume.html](file:///Users/bhadreshdas/Hadon/<Candidate Name>%20resume/resume.html)
- 📥 **Printable PDF**: [resume.pdf](file:///Users/bhadreshdas/Hadon/<Candidate Name>%20resume/<Candidate Name>_Resume.pdf)

Explain that the user can double-click `resume.html` directly in any browser to review, tweak any detail, switch templates, or print/download.
