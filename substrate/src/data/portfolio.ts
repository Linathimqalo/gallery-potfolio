export const portfolio = {
  "bio": "Infrastructure and security professional with 5+ years across systems administration, cloud-hosted environments, and production incident response. Hands-on with AWS, Terraform, IAM, and security monitoring across 100+ production websites and fintech payment environments. Building cloud engineering capability and skilled in server management, threat detection, and incident response across on-premises and cloud environments. Proven in leading teams, streamlining operations, and minimizing downtime while supporting innovation.",
  "pillars": [
    {
      "name": "Cloud",
      "description": "Building and securing cloud environments with Terraform, IAM, and S3."
    },
    {
      "name": "Infrastructure",
      "description": "Server administration, DNS, and multi-tenant production environments."
    },
    {
      "name": "Systems",
      "description": "Windows and Linux administration, monitoring, and incident response."
    },
    {
      "name": "Security",
      "description": "WAF, email security, endpoint hardening, and threat detection."
    }
  ],
  "skills": [
    {
      "name": "Cloud & IaC",
      "items": "AWS · Terraform · KMS · IAM · S3"
    },
    {
      "name": "SIEM & Monitoring",
      "items": "Wazuh · Security Onion · PfSense · TPOT · PCAP Analysis · Incident Response"
    },
    {
      "name": "Threat Detection & Response",
      "items": "YARA Rules · CVE Exploitation · Vulnerability Scanning · Nessus · OpenVAS · Malware Analysis"
    },
    {
      "name": "Penetration Testing",
      "items": "Kali Linux · Nmap · Metasploit · Burp Suite · Enumeration · Privilege Escalation"
    },
    {
      "name": "Security Tools",
      "items": "Firewall Config · VPNs (Fortinet, SoftEther) · Server Hardening · DAC · SSL/TLS"
    },
    {
      "name": "OS & Servers",
      "items": "Windows Server 2022 · Ubuntu · Active Directory · MacOS"
    },
    {
      "name": "Cloud & Virtualization",
      "items": "VMware · VirtualBox · Azure · GCP · Cloudflare"
    },
    {
      "name": "Development & Tools",
      "items": "HTML · CSS · JavaScript · Python · Node.js · React · C# · Git · GitHub · WordPress · Plesk · cPanel · Vercel · MySQL · MongoDB · REST APIs"
    },
    {
      "name": "Networking & Infrastructure",
      "items": "DNS · DHCP · VLANs · TCP/IP · Router/Switch Config · Backup & Recovery · Imaging · DR Planning"
    }
  ],
  "roles": [
    {
      "title": "Technical Support Specialist",
      "company": "Figment Design Labs",
      "dates": "April 2026 – Present",
      "location": "Johannesburg, South Africa",
      "year": "2026",
      "bullets": [
        "Provide first- and second-line technical support for payment and fintech systems, investigating system, connectivity, transaction, and application issues in production.",
        "Monitor system and site availability, identify incidents, and coordinate escalation to internal and external teams through to resolution.",
        "Troubleshoot POS systems, payment devices, network connectivity, and integrated services, supporting onsite technicians remotely where required.",
        "Work within PCI DSS-aligned environments, handling 90+ tickets monthly and maintaining operational reliability across payment systems."
      ]
    },
    {
      "title": "Systems Administrator",
      "company": "BeMySocial",
      "dates": "Feb 2024 – March 2026",
      "location": "Remote, United Kingdom",
      "year": "2024",
      "bullets": [
        "Managed infrastructure for 100+ production client websites with 99.9% uptime.",
        "Implemented WAF, firewall, and email security controls, reducing security incidents by 75%.",
        "Coordinated a cross-functional team of 5 to absorb workload after the sole developer departed, covering infrastructure, design, and client-facing responsibilities."
      ]
    },
    {
      "title": "IT Support Technician",
      "company": "IT Solutions",
      "dates": "Apr 2023 – Jan 2024",
      "location": "Grahamstown, South Africa",
      "year": "2023",
      "bullets": [
        "Provided technical support for 200+ end-users across multiple departments",
        "Configured and maintained network infrastructure and security systems",
        "Reduced ticket resolution time by 40% through process optimization",
        "Implemented user training programs improving security awareness by 65%"
      ]
    },
    {
      "title": "Freelance Web Developer",
      "company": "Independent",
      "dates": "2021 – 2022",
      "location": "Remote",
      "year": "2021",
      "bullets": [
        "Developed 15+ responsive websites for small businesses and startups",
        "Specialized in modern web technologies and user experience design",
        "Managed full project lifecycle from requirements to deployment",
        "Built long-term relationships with clients resulting in 80% repeat business"
      ]
    },
    {
      "title": "LAN Admin Intern",
      "company": "Damelin",
      "dates": "2020",
      "location": "East London, South Africa",
      "year": "2020",
      "bullets": [
        "Assisted in network administration and maintenance for educational facility",
        "Gained hands-on experience with enterprise networking equipment",
        "Supported IT infrastructure serving 500+ students and staff",
        "Participated in security audits and compliance assessments"
      ]
    }
  ],
  "projects": [
    {
      "title": "AWS Storage Platform",
      "category": "Cloud Engineering",
      "description": "Four-phase AWS engineering project built in a local emulator. Progressive build: CLI fundamentals → Terraform automation → security controls → detection and incident response. Fully Terraform-managed with automated auditing, remote state, and a documented incident-response workflow.",
      "tags": "AWS CLI · Terraform · IAM · S3",
      "url": "https://github.com/Linathimqalo/aws-storage-platform",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-storage-platform"
    },
    {
      "title": "AWS VPC Network Security",
      "category": "Cloud Engineering",
      "description": "Three-tier VPC design with defence-in-depth network controls, built in Floci and managed with Terraform. Public, private-app, and private-data tiers with routing isolation, security groups, NACLs, and VPC Flow Logs. Includes misconfiguration drill, detection engineering, and dual-path remediation.",
      "tags": "AWS VPC · Terraform · Security Groups · NACLs",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/01-vpc-three-tier",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-vpc-three-tier"
    },
    {
      "title": "S3 Secure Bucket",
      "category": "Cloud Engineering",
      "description": "Hardened S3 bucket with KMS encryption, strict deny policies, and access logging. Defense-in-depth approach with Block Public Access, customer-managed keys, and TLS enforcement.",
      "tags": "AWS S3 · KMS · IAM · Terraform",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/02-s3-secure-bucket",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-s3-secure-bucket"
    },
    {
      "title": "Comparative Cloud Honeypot Analysis",
      "category": "Cybersecurity",
      "description": "Enterprise-grade honeypot system for threat intelligence and attack pattern analysis comparing GCP vs Azure deployments.",
      "tags": "T-POT · Docker · ELK Stack · GCP",
      "url": "https://github.com/Linathimqalo/cloud-honeypot-analysis",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/cloud-honeypot-analysis"
    },
    {
      "title": "Threat Detection Honeypot",
      "category": "Cybersecurity",
      "description": "Multi-honeypot environment on AWS EC2 using T-Pot framework to capture, analyze, and visualize real-world cyber attacks. Exposes 40+ vulnerable containers while isolating admin access.",
      "tags": "T-Pot · Docker · EC2 · Elasticsearch",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/03-honeypot",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-threat-detection-honeypot"
    },
    {
      "title": "Zeus Banking Trojan",
      "category": "Security Research",
      "description": "Deep dive malware analysis of Zeus banking trojan using static and dynamic analysis techniques.",
      "tags": "Malware Analysis · IDA Pro · OllyDbg · Wireshark",
      "url": "https://github.com/Linathimqalo/Malware-Analysis",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/zeus-malware-analysis"
    },
    {
      "title": "IAM Access Analyzer",
      "category": "Security",
      "description": "Continuous compliance baseline enforcing least privilege via IAM Access Analyzer. Detects cross-account resource sharing and unused IAM roles over 90-day windows.",
      "tags": "AWS IAM · Terraform · Compliance",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/04-iam-access-analyzer",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-iam-access-analyzer"
    },
    {
      "title": "Serverless Pipeline",
      "category": "Serverless",
      "description": "Event-driven serverless architecture processing file uploads via S3, Lambda, and DynamoDB. Computes SHA-256 hashes with strict least-privilege IAM and full observability.",
      "tags": "AWS Lambda · S3 · DynamoDB · Python",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/05-lambda-s3-iam",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-serverless-pipeline"
    },
    {
      "title": "EC2 + RDS Three-Tier",
      "category": "Cloud Architecture",
      "description": "Production-style three-tier architecture with public EC2, private RDS PostgreSQL, dynamic secrets management via Secrets Manager, and zero-key access via SSM.",
      "tags": "AWS EC2 · RDS · PostgreSQL · Flask",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/06-ec2-rds-three-tier",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/ec2-rds-three-tier"
    },
    {
      "title": "Centralized Logging",
      "category": "Security",
      "description": "Audit and forensic analysis pipeline with CloudTrail, S3, Glue, and Athena. Serverless SQL query interface for rapid security incident investigation with log integrity validation.",
      "tags": "AWS CloudTrail · Athena · Glue · S3",
      "url": "https://github.com/Linathimqalo/aws-cloud-labs/tree/main/07-monitoring-detection",
      "caseStudy": "https://the-archive-portfolio.vercel.app/projects/aws-cloudtrail-athena-forensics"
    },
    {
      "title": "Luxury Portfolio Web Application",
      "category": "Full-Stack Development",
      "description": "A premium personal portfolio platform with blog, projects, certifications, and customizable themes powered by Supabase and Next.js.",
      "tags": "Next.js · TypeScript · Supabase",
      "url": "https://github.com/Linathimqalo/velvet-ink-forge",
      "caseStudy": null
    },
    {
      "title": "SIEM/SOC Lab Environment",
      "category": "Infrastructure",
      "description": "Complete Security Operations Center laboratory setup with multiple SIEM platforms and security tools.",
      "tags": "Wazuh · Splunk · Security Onion",
      "url": null,
      "caseStudy": null
    },
    {
      "title": "SharePoint Migration Project",
      "category": "Enterprise",
      "description": "Enterprise SharePoint migration improving team collaboration and productivity across multiple departments.",
      "tags": "SharePoint · Office 365 · PowerShell",
      "url": null,
      "caseStudy": null
    },
    {
      "title": "Personal Finance Management Platform",
      "category": "Finance",
      "description": "A full-stack finance app for tracking budgets, transactions, goals, debts, and investments with real-time reporting and insights.",
      "tags": "React · TypeScript · Supabase",
      "url": "https://github.com/Linathimqalo/lumin-wealth",
      "caseStudy": null
    },
    {
      "title": "Deloitte Cybersecurity Simulation",
      "category": "Professional Development",
      "description": "Cybersecurity job simulation focusing on breach analysis and incident response reporting.",
      "tags": "Incident Response · Forensic Analysis · NIST Framework",
      "url": null,
      "caseStudy": null
    }
  ]
};
