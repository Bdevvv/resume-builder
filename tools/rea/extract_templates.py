"""
Reverse-Engineered Resume.io Template Specifications
Extracted using REA / web inspection tools.
"""
import json

TEMPLATE_SPECS = {
    "london": {
        "name": "London",
        "category": "Classic / ATS Gold Standard",
        "layout": "single-column",
        "description": "Ultra-clean single-column executive layout with centered header, horizontal separators, high density, and 100% ATS parser compatibility.",
        "fontFamily": "Inter, -apple-system, sans-serif",
        "headerStyle": "centered-compact",
        "sectionStyle": "underline-accent",
        "defaultColor": "#2163CA",
        "palette": ["#212121", "#2163CA", "#5121CA", "#CA3D21", "#CA9421"]
    },
    "stockholm": {
        "name": "Stockholm",
        "category": "Modern Two-Column",
        "layout": "two-column-sidebar",
        "description": "Scandinavian modern layout with a dedicated sidebar for contact, skills, languages, and education, leaving the main canvas for impactful career achievements.",
        "fontFamily": "Roboto, sans-serif",
        "headerStyle": "left-aligned-banner",
        "sectionStyle": "caps-letterspaced",
        "defaultColor": "#2196F3",
        "palette": ["#0F141F", "#673AB7", "#2196F3", "#22A860", "#FF4D4D"]
    },
    "toronto": {
        "name": "Toronto",
        "category": "Contemporary Bold",
        "layout": "banner-split",
        "description": "High-impact colored header banner with applicant name and role, transitioning into structured two-column grids for clean readability.",
        "fontFamily": "Inter, sans-serif",
        "headerStyle": "solid-color-banner",
        "sectionStyle": "left-accent-bar",
        "defaultColor": "#172F53",
        "palette": ["#232323", "#172F53", "#361146", "#160A45", "#324739"]
    },
    "dublin": {
        "name": "Dublin",
        "category": "Minimalist High-Density",
        "layout": "single-column",
        "description": "Clean, understated minimalism. Left accent border markings on section headings and bullet-point hierarchy favored by corporate recruiters.",
        "fontFamily": "Arial, sans-serif",
        "headerStyle": "left-aligned-minimal",
        "sectionStyle": "vertical-pip-accent",
        "defaultColor": "#084C41",
        "palette": ["#084C41", "#87300D", "#10365C", "#3E1D53", "#242935"]
    },
    "vienna": {
        "name": "Vienna",
        "category": "Sophisticated Corporate",
        "layout": "single-column-timeline",
        "description": "Refined typography, elegant thin divider rules, inline company & location tags, and subtle timeline indicators for employment history.",
        "fontFamily": "Georgia, serif",
        "headerStyle": "classic-inline",
        "sectionStyle": "thin-rule-divider",
        "defaultColor": "#1E3A8A",
        "palette": ["#1E3A8A", "#047857", "#B45309", "#6D28D9", "#374151"]
    },
    "sydney": {
        "name": "Sydney",
        "category": "Creative Two-Column",
        "layout": "two-column-tinted",
        "description": "Modern colored sidebar with badge skills, progress meters, and dynamic visual hierarchy suited for tech, marketing, and product leadership.",
        "fontFamily": "Inter, sans-serif",
        "headerStyle": "sidebar-integrated",
        "sectionStyle": "pill-badge-headings",
        "defaultColor": "#082A4D",
        "palette": ["#082A4D", "#581010", "#1D473A", "#32084D", "#1B212F"]
    },
    "berlin": {
        "name": "Berlin",
        "category": "Tech & Engineering",
        "layout": "compact-grid",
        "description": "Engineered for technical resumes: categorized skill matrix (languages, frameworks, tools), dense metric-driven bullet points, and high information bandwidth.",
        "fontFamily": "Roboto, -apple-system, sans-serif",
        "headerStyle": "two-column-header",
        "sectionStyle": "boxed-headings",
        "defaultColor": "#2563EB",
        "palette": ["#18181B", "#2563EB", "#059669", "#DC2626", "#D97706"]
    },
    "athens": {
        "name": "Athens",
        "category": "Academic & Traditional",
        "layout": "single-column-academic",
        "description": "Classic academic and formal layout with serif typography (Garamond/Georgia), centered traditional headings, and elegant line work.",
        "fontFamily": "Garamond, Georgia, serif",
        "headerStyle": "centered-traditional",
        "sectionStyle": "double-line-divider",
        "defaultColor": "#3C78D8",
        "palette": ["#3C78D8", "#C799A6", "#90909E", "#909580", "#212121"]
    }
}

if __name__ == "__main__":
    with open("/Users/bhadreshdas/Hadon/resume-builder/tools/rea/extracted_templates_spec.json", "w") as f:
        json.dump(TEMPLATE_SPECS, f, indent=2)
    print("Saved extracted_templates_spec.json successfully.")
