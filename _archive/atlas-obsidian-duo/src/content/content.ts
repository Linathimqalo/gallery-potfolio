export const content = {
  person: {
    name: "Linathi Mqalo",
    role: "Cloud Security Engineer",
    location: "Johannesburg",
  },
  editions: {
    atlas: { name: "Atlas", subtitle: "The Editorial Edition" },
    obsidian: { name: "Obsidian", subtitle: "The Spatial Edition" },
  },
  entry: {
    prompt: "CHOOSE YOUR EDITION — YOU CAN SWITCH AT ANY TIME",
    autoSelected: "AUTO-SELECTED ATLAS — SWITCH ANY TIME",
  },
  hero: {
    label: "[ PORTFOLIO · 2026 ]",
    disciplines: "Cloud · Infrastructure · Security · Systems",
    tagline: "Building and securing cloud infrastructure across AWS and Azure.",
    metrics: [{ value: "100+", label: "Websites Managed" }, { value: "5+", label: "Years Experience" }],
  },
  sections: [
    { id: "about", number: "01", label: "About" },
    { id: "skills", number: "02", label: "Skills" },
    { id: "experience", number: "03", label: "Experience" },
    { id: "projects", number: "04", label: "Projects" },
    { id: "contact", number: "05", label: "Contact" },
  ],
  about: {
    bio: "Infrastructure and security professional with 5+ years across systems administration, cloud-hosted environments, and production incident response. Hands-on with AWS, Terraform, IAM, and security monitoring across 100+ production websites and fintech payment environments. Building cloud engineering capability and skilled in server management, threat detection, and incident response across on-premises and cloud environments. Proven in leading teams, streamlining operations, and minimizing downtime while supporting innovation.",
    domains: [
      { label: "Cloud", description: "Building and securing cloud environments with Terraform, IAM, and S3." },
      { label: "Infrastructure", description: "Server administration, DNS, and multi-tenant production environments." },
      { label: "Systems", description: "Windows and Linux administration, monitoring, and incident response." },
      { label: "Security", description: "WAF, email security, endpoint hardening, and threat detection." },
    ],
  },
  skills: [
    { group: "Cloud & IaC", technologies: ["AWS", "Terraform", "KMS", "IAM", "S3"] },
    { group: "SIEM & Monitoring", technologies: ["Wazuh", "Security Onion", "PfSense", "TPOT", "PCAP Analysis", "Incident Response"] },
    { group: "Threat Detection & Response", technologies: ["YARA Rules", "CVE Exploitation", "Vulnerability Scanning", "Nessus", "OpenVAS", "Malware Analysis"] },
    { group: "Penetration Testing", technologies: ["Kali Linux", "Nmap", "Metasploit", "Burp Suite", "Enumeration", "Privilege Escalation"] },
    { group: "Security Tools", technologies: ["Firewall Config", "VPNs (Fortinet, SoftEther)", "Server Hardening", "DAC", "SSL/TLS"] },
    { group: "OS & Servers", technologies: ["Windows Server 2022", "Ubuntu", "Active Directory", "MacOS"] },
    { group: "Cloud & Virtualization", technologies: ["VMware", "VirtualBox", "Azure", "GCP", "Cloudflare"] },
    { group: "Development & Tools", technologies: ["HTML", "CSS", "JavaScript", "Python", "Node.js", "React", "C#", "Git", "GitHub", "WordPress", "Plesk", "cPanel", "Vercel", "MySQL", "MongoDB", "REST APIs"] },
    { group: "Networking & Infrastructure", technologies: ["DNS", "DHCP", "VLANs", "TCP/IP", "Router/Switch Config", "Backup & Recovery", "Imaging", "DR Planning"] },
  ],
  experience: [
    { dates: "April 2026 – Present", role: "Technical Support Specialist", company: "Figment Design Labs", location: "Johannesburg, South Africa", wins: [
      "Provide first- and second-line technical support for payment and fintech systems, investigating system, connectivity, transaction, and application issues in production.",
      "Monitor system and site availability, identify incidents, and coordinate escalation to internal and external teams through to resolution.",
      "Troubleshoot POS systems, payment devices, network connectivity, and integrated services, supporting onsite technicians remotely where required.",
      "Work within PCI DSS-aligned environments, handling 90+ tickets monthly and maintaining operational reliability across payment systems.",
    ] },
    { dates: "Feb 2024 – March 2026", role: "Systems Administrator", company: "BeMySocial", location: "Remote, United Kingdom", wins: [
      "Managed infrastructure for 100+ production client websites with 99.9% uptime.",
      "Implemented WAF, firewall, and email security controls, reducing security incidents by 75%.",
      "Coordinated a cross-functional team of 5 to absorb workload after the sole developer departed, covering infrastructure, design, and client-facing responsibilities.",
    ] },
    { dates: "Apr 2023 – Jan 2024", role: "IT Support Technician", company: "IT Solutions", location: "Grahamstown, South Africa", wins: [
      "Provided technical support for 200+ end-users across multiple departments", "Configured and maintained network infrastructure and security systems", "Reduced ticket resolution time by 40% through process optimization", "Implemented user training programs improving security awareness by 65%",
    ] },
    { dates: "2021 – 2022", role: "Freelance Web Developer", company: "Independent", location: "Remote", wins: [
      "Developed 15+ responsive websites for small businesses and startups", "Specialized in modern web technologies and user experience design", "Managed full project lifecycle from requirements to deployment", "Built long-term relationships with clients resulting in 80% repeat business",
    ] },
    { dates: "2020", role: "LAN Admin Intern", company: "Damelin", location: "East London, South Africa", wins: [
      "Assisted in network administration and maintenance for educational facility", "Gained hands-on experience with enterprise networking equipment", "Supported IT infrastructure serving 500+ students and staff", "Participated in security audits and compliance assessments",
    ] },
  ],
  projects: {
    heading: "Selected Work",
    viewLabel: "View",
    featuredLabel: "Featured",
    featured: [
      { title: "AWS Storage Platform", year: "2026", category: "Cloud Engineering", description: "Four-phase AWS engineering project built in a local emulator. Progressive build: CLI fundamentals → Terraform automation → security controls → detection and incident response. Fully Terraform-managed with automated auditing, remote state, and a documented incident-response workflow.", tags: ["AWS CLI", "Terraform", "IAM", "S3", "KMS", "Detection Engineering", "Incident Response"], href: "https://linathimqalo-portfolio.vercel.app/projects/aws-storage-platform", code: "https://github.com/Linathimqalo/aws-storage-platform" },
      { title: "AWS VPC Network Security", year: "2026", category: "Cloud Engineering", description: "Three-tier VPC design with defence-in-depth network controls, built in Floci and managed with Terraform. Public, private-app, and private-data tiers with routing isolation, security groups, NACLs, and VPC Flow Logs. Includes misconfiguration drill, detection engineering, and dual-path remediation.", tags: ["AWS VPC", "Terraform", "Security Groups", "NACLs", "Flow Logs", "Network Security"], href: "https://linathimqalo-portfolio.vercel.app/projects/aws-vpc-network-security", code: "https://github.com/Linathimqalo/aws-storage-platform" },
    ],
    secondary: [
      { title: "Comparative Cloud Honeypot Analysis", category: "Cybersecurity", description: "Enterprise-grade honeypot system for threat intelligence and attack pattern analysis comparing GCP vs Azure deployments.", tags: ["T-POT", "Docker", "ELK Stack", "GCP", "Azure", "Threat Intelligence"], href: "https://linathimqalo-portfolio.vercel.app/projects/cloud-honeypot-analysis" },
      { title: "Zeus Banking Trojan", category: "Security Research", description: "Deep dive malware analysis of Zeus banking trojan using static and dynamic analysis techniques.", tags: ["Malware Analysis", "IDA Pro", "OllyDbg", "Wireshark", "Virtual Machines", "YARA Rules"], href: "https://linathimqalo-portfolio.vercel.app/projects/zeus-malware-analysis" },
      { title: "Luxury Portfolio Web Application", category: "Full-Stack Development", description: "A premium personal portfolio platform with blog, projects, certifications, and customizable themes powered by Supabase and Next.js.", tags: ["Next.js", "TypeScript", "Supabase", "TailwindCSS", "ShadCN UI", "Framer Motion"], href: "https://github.com/Linathimqalo/velvet-ink-forge" },
      { title: "SIEM/SOC Lab Environment", category: "Infrastructure", description: "Complete Security Operations Center laboratory setup with multiple SIEM platforms and security tools.", tags: ["Wazuh", "Splunk", "Security Onion", "TheHive5", "MISP", "Suricata", "Elasticsearch"], href: "" },
    ],
    index: [
      { title: "SharePoint Migration Project", description: "Enterprise SharePoint migration improving team collaboration and productivity across multiple departments.", tags: ["SharePoint", "Office 365", "PowerShell", "Migration Tools", "Azure AD"], href: "" },
      { title: "Personal Finance Management Platform", description: "A full-stack finance app for tracking budgets, transactions, goals, debts, and investments with real-time reporting and insights.", tags: ["React", "TypeScript", "Supabase", "TailwindCSS", "Lovable", "PostgreSQL", "REST APIs"], href: "https://github.com/Linathimqalo/lumin-wealth" },
      { title: "Deloitte Cybersecurity Simulation", description: "Cybersecurity job simulation focusing on breach analysis and incident response reporting.", tags: ["Incident Response", "Forensic Analysis", "NIST Framework", "Risk Assessment", "Reporting"], href: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_z7MYArvHSWyZGuezg_1750605608939_completion_certificate.pdf" },
    ],
  },
  contact: {
    heading: "Let's build something.",
    emailLabel: "Email", email: "mqalolinathi@gmail.com",
    locationLabel: "Location", location: "Johannesburg, South Africa (Remote work available globally)",
    responseLabel: "Response Time", response: "I typically respond to messages within 24 hours during business days.",
    socials: [{ label: "LinkedIn", href: "https://linkedin.com/in/linathi-mqalo-8ab653194" }, { label: "GitHub", href: "https://github.com/Linathimqalo" }],
    footer: "© 2026 Linathi Mqalo · Built with restraint",
  },
  controls: { light: "Switch to light theme", dark: "Switch to dark theme", openMenu: "Open navigation", closeMenu: "Close navigation", editionPending: "Obsidian edition — coming next", skip: "Skip to content" },
} as const;

export type PortfolioContent = typeof content;
export type Edition = keyof typeof content.editions;