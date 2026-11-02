/**
 * Preloaded Sample Resume Profiles for Universal ATS Resume Builder
 */

const SAMPLE_PROFILES = {
  software_engineer: {
    personal: {
      fullName: "Alex Morgan",
      jobTitle: "Senior Full Stack Software Engineer",
      email: "alex.morgan@email.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      website: "https://alexmorgan.dev",
      linkedin: "linkedin.com/in/alexmorgan-dev",
      github: "github.com/alexmorgan",
      photo: ""
    },
    summary: "Results-driven Senior Full Stack Engineer with 7+ years of experience designing scalable distributed systems, cloud-native microservices, and high-performance web applications. Led engineering initiatives that boosted system throughput by 45%, slashed cloud infrastructure costs by $1.2M annually, and achieved 99.99% uptime for 10M+ daily active users.",
    experience: [
      {
        id: "exp_1",
        title: "Senior Software Engineer",
        company: "Stripe",
        location: "San Francisco, CA",
        startDate: "2022-03",
        endDate: "",
        current: true,
        bullets: [
          "Architected and deployed high-throughput payment ingestion pipeline processing 25,000+ TPS with sub-80ms p99 latency.",
          "Spearheaded migration of legacy monolithic backend to Go and Node.js microservices on AWS EKS, reducing cloud operational overhead by 38% ($1.2M/yr).",
          "Engineered automated idempotency and reconciliation engine, reducing billing dispute rates by 62% across 450,000 merchant accounts.",
          "Mentored 6 junior and mid-level software engineers, conducting rigorous code reviews and driving CI/CD deployment frequency from bi-weekly to 14x daily."
        ]
      },
      {
        id: "exp_2",
        title: "Software Engineer",
        company: "Airbnb",
        location: "San Francisco, CA",
        startDate: "2019-06",
        endDate: "2022-02",
        current: false,
        bullets: [
          "Built customer-facing booking and search discovery interface in React, TypeScript, and GraphQL, improving page conversion rates by 14.5%.",
          "Implemented Redis distributed caching layer across search endpoints, slashing database read queries by 70% and accelerating page render times by 320ms.",
          "Collaborated with security and compliance teams to enforce OAuth2 and role-based access control (RBAC), passing SOC-2 Type II audit with zero findings."
        ]
      },
      {
        id: "exp_3",
        title: "Junior Backend Developer",
        company: "Twilio",
        location: "Denver, CO",
        startDate: "2017-08",
        endDate: "2019-05",
        current: false,
        bullets: [
          "Developed RESTful communication APIs in Python (FastAPI/Django) and PostgreSQL serving 12M+ monthly SMS webhook payloads.",
          "Created automated integration test suites with 94% test coverage, cutting production bug regression rates by 40%."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "B.S. in Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2013-08",
        endDate: "2017-05",
        gpa: "3.85 / 4.0 (Dean's Honor List)"
      }
    ],
    skills: {
      technical: ["TypeScript", "JavaScript (ES6+)", "Go (Golang)", "Python", "React.js", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS (EKS, S3, RDS, Lambda)", "Terraform", "Git"],
      soft: ["System Architecture", "Cross-Functional Leadership", "Agile & Scrum", "Mentorship", "Technical Writing"]
    },
    projects: [
      {
        id: "proj_1",
        name: "OpenTelemetry Metrics Visualizer",
        tech: "Go, React, ClickHouse, Docker",
        link: "github.com/alexmorgan/opentelemetry-viz",
        description: "Open-source distributed tracing visualizer with 1,800+ GitHub stars; ingested and analyzed 100M+ real-time trace events with sub-second queries."
      },
      {
        id: "proj_2",
        name: "Cloud-Native API Gateway",
        tech: "Node.js, Redis, Envoy, Terraform",
        link: "github.com/alexmorgan/edge-gateway",
        description: "Zero-latency rate-limiting edge proxy supporting sliding window token-bucket rate limiting with Redis clustered storage."
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        date: "2023",
        url: "aws.amazon.com/verify"
      },
      {
        id: "cert_2",
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation (CNCF)",
        date: "2022",
        url: "cncf.io/verify"
      }
    ],
    custom: {
      title: "Patents & Publications",
      items: [
        "Co-inventor: US Patent 11,245,678 — 'Dynamic Load Balancing Across Clustered Database Partitions', Granted 2023.",
        "Keynote Speaker at QCon San Francisco 2023: 'Scaling Microservices to 25,000 Transactions Per Second'."
      ]
    }
  },

  product_manager: {
    personal: {
      fullName: "Elena Rostova",
      jobTitle: "Lead Technical Product Manager",
      email: "elena.rostova@email.com",
      phone: "+1 (555) 789-0123",
      location: "New York, NY",
      website: "https://elenarostova.co",
      linkedin: "linkedin.com/in/elena-rostova",
      github: "",
      photo: ""
    },
    summary: "Customer-obsessed Lead Technical Product Manager with 8+ years of B2B SaaS and consumer tech experience. Led cross-functional squads across product, design, and data science to scale ARR from $12M to $48M. Proven expertise in data-driven discovery, AI-assisted workflows, and growth experiment loops.",
    experience: [
      {
        id: "exp_1",
        title: "Lead Product Manager",
        company: "Datadog",
        location: "New York, NY",
        startDate: "2021-04",
        endDate: "",
        current: true,
        bullets: [
          "Owned product roadmap and go-to-market for Cloud SIEM security analytics platform, generating $36M incremental ARR within 24 months.",
          "Directed team of 24 engineers and 3 designers, running weekly discovery interviews with Fortune 500 CISOs to prioritize enterprise features.",
          "Introduced automated threat anomaly alerts powered by LLMs, driving a 52% reduction in mean time to detect (MTTD) for enterprise clients."
        ]
      },
      {
        id: "exp_2",
        title: "Senior Product Manager",
        company: "Shopify",
        location: "New York, NY",
        startDate: "2018-09",
        endDate: "2021-03",
        current: false,
        bullets: [
          "Spearheaded international merchant checkout checkout redesign, improving checkout completion rate by 8.4% across 1.2M stores.",
          "Designed and shipped multi-currency settlement system, driving $180M in gross merchandise volume (GMV) within first 6 months of launch."
        ]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "M.B.A. in Technology Management",
        school: "Columbia Business School",
        location: "New York, NY",
        startDate: "2016-08",
        endDate: "2018-05",
        gpa: "Honors"
      },
      {
        id: "edu_2",
        degree: "B.S. in Information Systems",
        school: "New York University",
        location: "New York, NY",
        startDate: "2012-08",
        endDate: "2016-05",
        gpa: "Magna Cum Laude"
      }
    ],
    skills: {
      technical: ["Product Strategy", "Go-To-Market (GTM)", "SQL & Data Analytics", "A/B Testing & Mixpanel", "User Research", "Agile Roadmap Planning", "Jira & Linear", "Figma", "API Design Basics"],
      soft: ["Executive Stakeholder Management", "Negotiation", "Public Speaking", "Team Mentorship"]
    },
    projects: [
      {
        id: "proj_1",
        name: "Enterprise Security Audit Workflow",
        tech: "PostgreSQL, Python, Mixpanel, Figma",
        link: "datadoghq.com",
        description: "Enterprise self-serve compliance reporting engine adopted by 800+ global enterprises, reducing sales cycle friction by 3 weeks."
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Pragmatic Certified Product Manager (PMC-III)",
        issuer: "Pragmatic Institute",
        date: "2020",
        url: ""
      }
    ],
    custom: {
      title: "Languages & Interests",
      items: [
        "English (Native), French (Fluent), Spanish (Conversational)",
        "Fintech, AI Product Development, Marathon Running (NYC Marathon Finisher)"
      ]
    }
  },

  blank: {
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photo: ""
    },
    summary: "",
    experience: [
      {
        id: "exp_1",
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        bullets: [""]
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: ""
      }
    ],
    skills: {
      technical: [],
      soft: []
    },
    projects: [],
    certifications: [],
    custom: {
      title: "Additional Details",
      items: []
    }
  }
};
