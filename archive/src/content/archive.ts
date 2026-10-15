export type ContentBlock =
  | { type: 'paragraph' | 'heading' | 'quote'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[] }
  | { type: 'numberedList'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'diagram'; code: string }
  | { type: 'callout'; label: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };
export interface Project {
  slug: string; title: string; category: string; date: string; tools: string[];
  summary: string; executiveSummary: string; tags: string[];
  sections: { id: string; title: string; blocks: ContentBlock[] }[];
}
export const profile = {
  name: 'Linathi Mqalo',
  tagline: 'Technical work. Documented.',
  bio: 'The Archive is the source material behind three interpretations of the same work: Atlas, Obsidian, and Substrate. This is where the actual projects live — their context, implementation, and reasoning.',
};
export const portfolios = [
  { name: 'Atlas', label: 'A spatial interpretation', url: null },
  { name: 'Obsidian', label: 'A cinematic interpretation', url: null },
  { name: 'Substrate', label: 'A systems interpretation', url: null },
];
export const projects: Project[] = [
  {
    slug: 'aws-storage-platform',
    title: 'AWS Storage Platform - Progressive Cloud Engineering and Detection Case Study',
    category: 'Cloud Engineering',
    date: '2026-10-06',
    tools: ['AWS CLI', 'Terraform', 'IAM', 'S3', 'KMS', 'Detection Engineering', 'Incident Response'],
    tags: ['Object storage', 'Access control', 'Observability', 'Terraform', 'Security'],
    summary: 'Designing a resilient storage foundation with deliberate access controls, lifecycle policies, and detection engineering through four progressive phases.',
    executiveSummary: 'This project documents the build of an AWS storage environment across four progressive phases, developed entirely in a local AWS emulator (Floci). The goal was not to learn individual AWS services in isolation, but to understand how a real cloud environment evolves: from manual provisioning through automation, security hardening, and finally operational detection. The environment manages five S3 buckets, a KMS encryption key, and a least-privilege IAM user, all under Terraform control with remote state. A custom Bash audit script checks every bucket for public exposure, writes structured JSON reports, and exits non-zero when findings exist. The most valuable part of the project was not the infrastructure. It was what happened when I deliberately broke it. After applying Block Public Access, SSE-KMS encryption, and explicit Deny policies to every bucket, I disabled one bucket\'s controls and added a public policy to see whether my detection would catch it. It caught the Block Public Access drift. It missed the public policy entirely - a bug in my own audit script. Fixing that bug taught more about detection engineering than any tutorial. A detector that fails silently is worse than no detector at all.',
    sections: [
      {
        id: 'project-structure',
        title: 'Project Structure',
        blocks: [
          { type: 'paragraph', text: 'The project is organised as four phases, each a distinct layer of engineering maturity:' },
          { type: 'table', headers: ['Phase', 'Focus', 'Key Output'], rows: [['1', 'CLI Fundamentals', 'Manual provisioning, evidence capture'], ['2', 'Terraform Automation', 'Declarative infrastructure, state management'], ['3', 'Security Controls', 'Block Public Access, SSE-KMS, explicit Deny, IAM least privilege'], ['4', 'Operations & Detection', 'Audit script, remote state, incident-response documentation']] },
          { type: 'paragraph', text: 'Each phase lives in a numbered folder (legacy/phase-1-cli/, etc.) with a standalone README explaining its scope, commands, and findings.' }
        ]
      },
      {
        id: 'environment-tooling',
        title: 'Environment and Tooling',
        blocks: [
          { type: 'heading', text: 'AWS Emulator' },
          { type: 'paragraph', text: 'Floci - runs locally in Docker, exposes the S3, IAM, KMS, and STS APIs on localhost:4566' },
          { type: 'heading', text: 'CLI' },
          { type: 'paragraph', text: 'AWS CLI v2' },
          { type: 'heading', text: 'Infrastructure as Code' },
          { type: 'paragraph', text: 'Terraform v1.16, AWS provider v5.100.0' },
          { type: 'heading', text: 'Scripting' },
          { type: 'paragraph', text: 'Bash with jq for JSON parsing' },
          { type: 'heading', text: 'Version Control' },
          { type: 'paragraph', text: 'Git, hosted on GitHub' },
          { type: 'heading', text: 'State' },
          { type: 'paragraph', text: 'S3 remote backend (terraform-state-storage)' },
          { type: 'paragraph', text: 'Floci was chosen for cost and safety. Real AWS would incur charges, and - more importantly - the misconfiguration drill in Phase 3 would be dangerous against a live account. Running locally means breaking things on purpose carries no risk. The patterns learned (Terraform structure, IAM least privilege, S3 security controls, detection design) translate directly to real AWS. The only differences are in the emulator\'s quirks and the endpoints override.' }
        ]
      },
      {
        id: 'phase-1',
        title: 'Phase 1 - CLI Fundamentals',
        blocks: [
          { type: 'paragraph', text: 'Phase 1 established the basics: creating IAM users, creating S3 buckets, uploading objects, and inspecting ACLs and metadata. Every command\'s output was saved to a file as evidence - the same practice a security engineer follows during an audit.' },
          { type: 'heading', text: 'Key commands and what they taught' },
          { type: 'code', language: 'bash', code: '# Establish identity - always the first command in a session\naws sts get-caller-identity\n\n# Create an identity\naws iam create-user --user-name storage-admin\n\n# Create and populate a bucket\naws s3 mb s3://company-storage-lab\naws s3 cp lab-data.txt s3://company-storage-lab/lab-data.txt\n\n# Audit bucket access\naws s3api get-bucket-acl --bucket company-storage-lab\n\n# Inspect object metadata (size, ETag/MD5, content type)\naws s3api head-object --bucket audit-logs-lab --key audit-entry.txt' },
          { type: 'paragraph', text: 'The distinction between high-level (aws s3) and low-level (aws s3api) commands became central. aws s3 hides security settings behind simple operations; aws s3api exposes everything. Security work uses s3api more often. Several command mistakes taught naming conventions: list-users is plural because it returns a list; get-bucket-acl is singular because it acts on one bucket. The AWS CLI uses this distinction consistently.' },
          { type: 'heading', text: 'Findings from Phase 1' },
          { type: 'paragraph', text: 'Fresh buckets show only the owner with FULL_CONTROL and no public grants. This is the correct baseline. Default encryption is AWS-managed AES256 - no customer-managed KMS key.' }
        ]
      },
      {
        id: 'phase-2',
        title: 'Phase 2 - Terraform Automation',
        blocks: [
          { type: 'paragraph', text: 'Phase 2 rebuilt the Phase 1 environment declaratively. The shift from imperative ("do this now") to declarative ("this is what I want to exist") is more significant than it first appears. Terraform tracks state. It knows what it created, and it detects when reality diverges. This is the property that makes it safe to use at scale - no accidental duplicates, no forgotten resources.' },
          { type: 'heading', text: 'The core configuration' },
          { type: 'code', language: 'hcl', code: 'provider "aws" {\n  region                      = "us-east-1"\n  access_key                  = "flociadmin"\n  secret_key                  = "flociadmin"\n  skip_credentials_validation = true\n  skip_metadata_api_check     = true\n  skip_requesting_account_id  = true\n  s3_use_path_style           = true\n\n  endpoints {\n    s3  = "http://localhost:4566"\n    iam = "http://localhost:4566"\n    sts = "http://localhost:4566"\n  }\n}\n\nresource "aws_s3_bucket" "terraform_lab" {\n  bucket = var.primary_bucket_name\n}' },
          { type: 'paragraph', text: 'The endpoints block redirects every API call to Floci - the same mechanism the CLI uses via AWS_ENDPOINT_URL. The s3_use_path_style setting tells Terraform to use localhost:4566/bucket instead of bucket.s3.amazonaws.com, matching the emulator\'s expectations. Two buckets were created (terraform-managed-lab and terraform-managed-backup), both driven by variables. The state file tracks what Terraform manages - and it must never be committed to Git because it can contain sensitive values.' },
          { type: 'callout', label: 'Key lesson', text: 'Idempotency. After a successful apply, running plan again shows No changes. Terraform compares config, state, and reality; if they match, it does nothing. This is why infrastructure-as-code is safer than manual commands.' }
        ]
      },
      {
        id: 'phase-3',
        title: 'Phase 3 - Security Controls',
        blocks: [
          { type: 'paragraph', text: 'Phase 3 applied the security controls that every production S3 bucket should have. Four layers, applied through Terraform:' },
          { type: 'heading', text: '1. Block Public Access (all four settings)' },
          { type: 'code', language: 'hcl', code: 'resource "aws_s3_bucket_public_access_block" "terraform_lab" {\n  bucket = aws_s3_bucket.terraform_lab.id\n\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}' },
          { type: 'paragraph', text: 'Each of the four settings addresses a different vector. block_public_acls prevents new public ACLs. ignore_public_acls neutralises existing ones. block_public_policy rejects public bucket policies. restrict_public_buckets blocks cross-account access via public policies. All four must be enabled for full protection.' },
          { type: 'heading', text: '2. Customer-managed KMS key' },
          { type: 'code', language: 'hcl', code: 'resource "aws_kms_key" "storage_key" {\n  description             = "KMS key for S3 storage encryption"\n  deletion_window_in_days = 7\n  enable_key_rotation     = true\n}' },
          { type: 'paragraph', text: 'Customer-managed keys give control over rotation, access, and audit. For regulated environments (PCI DSS, HIPAA), they\'re typically required.' },
          { type: 'heading', text: '3. SSE-KMS encryption' },
          { type: 'code', language: 'hcl', code: 'resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_lab" {\n  bucket = aws_s3_bucket.terraform_lab.id\n\n  rule {\n    apply_server_side_encryption_by_default {\n      sse_algorithm     = "aws:kms"\n      kms_master_key_id = aws_kms_key.storage_key.arn\n    }\n    bucket_key_enabled = true\n  }\n}' },
          { type: 'paragraph', text: 'bucket_key_enabled = true reduces KMS API calls by up to 99% by using a bucket-level derived key.' },
          { type: 'heading', text: '4. Explicit Deny public policy' },
          { type: 'code', language: 'hcl', code: 'resource "aws_s3_bucket_policy" "terraform_lab_deny_public" {\n  bucket = aws_s3_bucket.terraform_lab.id\n\n  policy = jsonencode({\n    Version = "2012-10-17"\n    Statement = [{\n      Sid       = "DenyPublicRead"\n      Effect    = "Deny"\n      Principal = "*"\n      Action    = "s3:GetObject"\n      Resource  = "${aws_s3_bucket.terraform_lab.arn}/*"\n      Condition = {\n        StringNotEquals = {\n          "aws:PrincipalAccount" = "000000000000"\n        }\n      }\n    }]\n  })\n}' },
          { type: 'paragraph', text: 'Explicit Deny always wins over Allow. It\'s the last line of defense - even if someone accidentally adds a public Allow policy, this Deny blocks it.' },
          { type: 'heading', text: '5. Least-privilege IAM user' },
          { type: 'paragraph', text: 'The audit-reader user receives only s3:ListBucket and s3:GetObject, scoped to two specific buckets. No write, no delete, no bucket creation. This is what least privilege looks like in practice.' },
          { type: 'paragraph', text: 'Adopting existing resources: Phase 3 required terraform import to adopt buckets created by hand in Phase 1. The problem is common - teams introducing IaC into an existing environment face it constantly. Import attaches a real resource to a declared config address; Terraform then manages it like any other resource.' }
        ]
      },
      {
        id: 'phase-4',
        title: 'Phase 4 - Operations and Detection',
        blocks: [
          { type: 'paragraph', text: 'Phase 4 fixed a bug in the audit script, restructured the repository, imported the remaining legacy buckets into Terraform, and moved state to S3.' },
          { type: 'heading', text: 'The audit script' },
          { type: 'paragraph', text: 'It iterates every bucket and checks two things: whether Block Public Access is enabled (all four settings), and whether any bucket policy contains Effect: "Allow" with a wildcard Principal. Findings are written to a timestamped JSON report, a rolling log is appended, and the script exits non-zero when findings exist - so CI systems can fail on it.' },
          { type: 'heading', text: 'The policy check, correctly written' },
          { type: 'code', language: 'bash', code: 'has_wildcard=$(echo "$policy_raw" | jq \'\n  [.Statement[] | select(.Effect == "Allow") | select(.Principal == "*")] | length\n\')\n\nif [ "$has_wildcard" -gt 0 ]; then\n  echo "  CRITICAL: Public policy with wildcard principal (Allow)"\nfi' },
          { type: 'paragraph', text: 'The original version used a grep pattern that didn\'t match the actual output format. The rewrite with jq parses JSON structurally - no escaping ambiguity, no false negatives.' },
          { type: 'heading', text: 'Remote state' },
          { type: 'code', language: 'hcl', code: 'terraform {\n  backend "s3" {\n    bucket = "terraform-state-storage"\n    key    = "storage-platform/terraform.tfstate"\n    region = "us-east-1"\n    # Floci-specific endpoint and credentials omitted for brevity\n  }\n}' },
          { type: 'paragraph', text: 'Remote state prevents loss if a laptop dies, and enables team collaboration. Credentials are externalised - the backend config is gitignored, with a template provided for reference.' },
          { type: 'heading', text: 'The final audit' },
          { type: 'paragraph', text: 'Six buckets, zero findings. Every bucket managed by Terraform, all with Block Public Access enabled, no public policies.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'paragraph', text: 'This is the part of the project that taught the most.' },
          { type: 'paragraph', text: 'After Phase 4, the environment was clean. Every bucket was secured. The audit reported zero findings. In a real engineering context, that\'s where many projects stop - "it works, ship it."' },
          { type: 'paragraph', text: 'I broke it on purpose.' },
          { type: 'heading', text: 'Two commands' },
          { type: 'code', language: 'bash', code: '# Disable all four Block Public Access settings on the backup bucket\naws s3api put-public-access-block \\\n  --bucket terraform-managed-backup \\\n  --public-access-block-configuration \\\n  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"\n\n# Attach a public read policy\naws s3api put-bucket-policy \\\n  --bucket terraform-managed-backup \\\n  --policy \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::terraform-managed-backup/*"}]}\'\n' },
          { type: 'paragraph', text: 'The bucket was now readable by anyone on the internet.' },
          { type: 'heading', text: 'What Terraform caught' },
          { type: 'code', language: 'text', code: '~ resource "aws_s3_bucket_public_access_block" "backup_lab" {\n    ~ block_public_acls       = false -> true\n    ~ block_public_policy     = false -> true\n    ~ ignore_public_acls      = false -> true\n    ~ restrict_public_buckets = true\n  }\n\nPlan: 0 to add, 1 to change, 0 to destroy.' },
          { type: 'paragraph', text: 'Terraform detected the Block Public Access drift because that resource was declared in its configuration. It proposed restoring the correct settings.' },
          { type: 'heading', text: 'What Terraform missed' },
          { type: 'paragraph', text: 'The public policy was not declared in the configuration, so Terraform had no way to detect it. Terraform only manages what it knows about. Anything created outside its scope is invisible. This is not a Terraform failure. It\'s a fundamental property of declarative IaC: the tool manages what you tell it to manage. Everything else requires independent detection.' },
          { type: 'heading', text: 'What the audit script caught - and didn\'t' },
          { type: 'paragraph', text: 'The Phase 3 audit script ran against the broken bucket. It correctly flagged the four disabled Block Public Access settings. It did not flag the public policy. The grep pattern in the script was looking for escaped JSON quotes in a specific format. The actual output of aws s3api get-bucket-policy didn\'t match. This was a silent false negative - the script reported "fine" when the bucket was exposed. That bug was the reason Phase 4 exists.' },
          { type: 'heading', text: 'The fix' },
          { type: 'paragraph', text: 'Rewriting the check with jq made it structural. Parse JSON as JSON, select statements where Effect == "Allow" and Principal == "*", count them. Zero means no public policy; anything greater is a finding. Tested against both a correctly configured bucket (returns 0) and a deliberately exposed one (returns 1). Both cases passed.' }
        ]
      },
      {
        id: 'key-lesson',
        title: 'Key Lesson',
        blocks: [
          { type: 'heading', text: 'Detection tools need their own testing' },
          { type: 'paragraph', text: 'A detector that fails silently is worse than no detector, because it creates false confidence. The bucket looked safe. The script said it was safe. But the script was broken. This is a known problem in security engineering - detection content is software, and software has bugs. Mature teams test their detectors against both positive cases (a misconfiguration that should be caught) and negative cases (a correct configuration that should not be flagged). Anything less produces noise on one side and silence on the other. The lesson generalises beyond this project. Every automated check - Config rules, GuardDuty findings, custom Lambda detectors, dashboards - needs the same discipline. The check that catches 99% of cases but fails on the one that matters is not a control. It\'s a comfort blanket.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'numberedList', items: ['Test the audit script from day one. The bug existed for a full phase. In a real environment, that\'s a window during which exposure could go undetected. The script should have been tested against a known-bad bucket the moment it was written.', 'Use Terraform modules earlier. The module refactor in Phase 5B reduced ~25 resource blocks to five module calls. That structure should have been in place from Phase 2 - copying config between phases led to a missing-resource error that cost time.', 'Separate detection from remediation more clearly. In production, detection runs on a schedule and independently of the infrastructure it checks. Tying detection to the same repo as infrastructure makes sense for learning, but production would deploy it separately.', 'Add CI earlier. The audit script runs manually. A GitHub Actions workflow that runs it on every push would make detection a control rather than a suggestion. That\'s the next extension.'] }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'paragraph', text: 'After four phases (plus the modules refactor), the project delivers:' },
          { type: 'list', items: ['Five S3 buckets, all with Block Public Access enabled, SSE-KMS encryption, and no public policies', 'A customer-managed KMS key with rotation enabled', 'A least-privilege IAM user scoped to two specific buckets and read-only actions', 'A custom audit script with JSON reporting, rolling logs, and CI-friendly exit codes', 'Remote state in S3 with credentials externalised', 'A documented incident-response workflow covering detection, triage, containment, investigation, remediation, and post-mortem', 'A reusable Terraform module for secure S3 buckets'] },
          { type: 'paragraph', text: 'The full project is available on GitHub. Every phase has its own README, every architectural decision is documented, and the entire environment is reproducible from code. More importantly: the project demonstrates an approach. Build it. Break it on purpose. Test whether the detection catches what you broke. Fix what it doesn\'t. That loop is the core of cloud security engineering, and it\'s the reason this project exists.' }
        ]
      }
    ]
  },
  {
    slug: 'aws-vpc-network-security',
    title: 'AWS VPC Network Security - Case Study',
    category: 'Network Security',
    date: '2026-10-10',
    tools: ['AWS VPC', 'Terraform', 'Security Groups', 'NACLs', 'Flow Logs', 'Network Security'],
    tags: ['Network isolation', 'Defense in depth', 'Traffic analysis', 'Terraform', 'Security'],
    summary: 'Building network boundaries that make traffic paths explicit, observable, and defensible with layered security controls.',
    executiveSummary: 'This project documents the design and build of a three-tier VPC in AWS, with layered network security controls - routing isolation, security groups, network ACLs, and VPC Flow Logs - all managed declaratively through Terraform. The environment segments resources into public, private-application, and private-data tiers. Each tier has a distinct routing profile and its own firewall controls. Tier-to-tier access is identity-based (security group references), not IP-based. The data tier has no internet route at all - the network-layer equivalent of physically isolating the database. After building the secure baseline, I deliberately introduced three misconfigurations to test detection: Opened SSH (port 22) on the public security group to the internet, Opened PostgreSQL (port 5432) on the data security group to the internet, Replaced the data NACL\'s app-subnet CIDR rule with 0.0.0.0/0. A custom Bash audit script detected all three. Remediation was done two ways - first via CLI for speed, then via terraform apply to restore declarative state. The environment returned to 0 findings, and terraform plan returned "No changes." The project demonstrates the full network security lifecycle: design → build → harden → break → detect → remediate → verify.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'diagram', code: 'VPC: 10.0.0.0/16\n│\n├── Public Subnet (10.0.1.0/24)\n│   ├── Route: 0.0.0.0/0 → Internet Gateway\n│   ├── Security Group: public-sg\n│   └── NACL: public-nacl\n│\n├── Private App Subnet (10.0.10.0/24)\n│   ├── Route: 0.0.0.0/0 → NAT Gateway\n│   └── Security Group: app-sg (accepts traffic from public-sg only)\n│\n└── Private Data Subnet (10.0.20.0/24)\n    ├── Route: none (no internet access)\n    ├── Security Group: data-sg (accepts traffic from app-sg only, no egress)\n    └── NACL: data-nacl (only app subnet CIDR can reach)' },
          { type: 'heading', text: 'Why three tiers' },
          { type: 'paragraph', text: 'Public - resources that must be reachable from the internet. Load balancers, bastion hosts. Minimal surface - only the ports that need to be open are open.' },
          { type: 'paragraph', text: 'Private App - application servers. They need outbound internet (package updates, API calls), but shouldn\'t be reachable inbound.' },
          { type: 'paragraph', text: 'Private Data - databases. No internet access in any direction. Reachable only from the application tier.' },
          { type: 'paragraph', text: 'This is standard AWS architecture. It shows up in almost every production environment, and it\'s asked about in interviews.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: 'Decision 1: Publicness is determined by routes, not by name' },
          { type: 'paragraph', text: 'The public and private labels in AWS are informal. A subnet is "public" if and only if its route table has a route to an Internet Gateway. The subnets themselves have different flags - map_public_ip_on_launch is true for the public subnet and false for the private subnets - but that flag is a convenience, not the definition. If you attach a route to an IGW to a subnet whose instances don\'t have public IPs, those instances still aren\'t reachable - but any instances you later assign public IPs to would be. And if a subnet has no route to the IGW, public IPs assigned to instances do nothing. Why this matters: Misunderstanding the mechanism is a common source of exposures. "I set it to private" often means "I didn\'t map public IPs on launch" - which is not the same as "no internet access." The route table is the actual control.' },
          { type: 'heading', text: 'Decision 2: The data tier has no default route' },
          { type: 'code', language: 'hcl', code: 'resource "aws_route_table" "private_data" {\n  vpc_id = aws_vpc.main.id\n  # No 0.0.0.0/0 route\n}' },
          { type: 'paragraph', text: 'Traffic to anywhere outside the VPC has no route in the data subnet. It\'s dropped at the routing layer, before any firewall would even need to evaluate it. Why this is powerful: Even if every security group and NACL in the data tier was misconfigured to allow all traffic, the routing table would still prevent internet connectivity. Defence in depth starts at the routing layer. It\'s the cheapest, most reliable control - because it can\'t be "opened accidentally" by changing a port number. You have to deliberately add a route. Interview-grade insight: When someone asks "how do you prevent a database from reaching the internet?" the answer isn\'t "put it in a private subnet." The answer is: no default route. Subnet names are cosmetic; the routing table is enforcement.' },
          { type: 'heading', text: 'Decision 3: The app tier has outbound-only internet via NAT' },
          { type: 'code', language: 'hcl', code: 'resource "aws_route_table" "private_app" {\n  route {\n    cidr_block     = "0.0.0.0/0"\n    nat_gateway_id = aws_nat_gateway.main.id\n  }\n}' },
          { type: 'paragraph', text: 'Application servers need outbound internet (to fetch packages, call APIs, reach AWS services). They don\'t need to be reachable inbound. A NAT Gateway provides exactly that. How it works: The app server\'s route table sends internet-bound traffic to the NAT. The NAT translates the source IP to its own public IP and forwards it. The response comes back to the NAT, which forwards it back to the app server. The app server has no public IP and no path for someone on the internet to reach it.' },
          { type: 'heading', text: 'Decision 4: Tier-to-tier access uses security group references' },
          { type: 'code', language: 'hcl', code: 'resource "aws_security_group" "app" {\n  ingress {\n    from_port       = 8080\n    to_port         = 8080\n    security_groups = [aws_security_group.public.id]\n  }\n}' },
          { type: 'paragraph', text: 'Not cidr_blocks = ["10.0.1.0/24"]. This means: "Allow traffic on port 8080 from any instance that has the public-sg security group attached." It\'s identity-based, not address-based. Why identity-based is preferred: If you add a second load balancer to the public tier, it automatically gets access. No config change. If you remove the public SG from an instance, it loses access instantly. No stale IPs. Adding a monitoring instance in the public subnet doesn\'t accidentally grant it access to the app tier. Only instances with the SG do. The API representation: When you inspect the security group, this rule appears under UserIdGroupPairs instead of IpRanges. That\'s the difference between an identity-based rule and an address-based rule. Interviewers ask about this distinction.' },
          { type: 'heading', text: 'Decision 5: The data tier security group has no egress rules' },
          { type: 'code', language: 'hcl', code: 'resource "aws_security_group" "data" {\n  ingress {\n    description     = "Database traffic from app tier only"\n    from_port       = 5432\n    to_port         = 5432\n    protocol        = "tcp"\n    security_groups = [aws_security_group.app.id]\n  }\n  # No egress block\n}' },
          { type: 'paragraph', text: 'Databases don\'t initiate connections. They respond to them. Removing egress rules entirely is a security control: even if an attacker gains code execution on the database, it can\'t reach out. The layered effect: Combined with the no-route decision above, the data tier has two independent controls preventing outbound connections - the routing table and the SG. Both must be bypassed to allow exfiltration.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'paragraph', text: 'After building the secure baseline, I deliberately introduced three misconfigurations that mirror real-world incidents.' },
          { type: 'heading', text: 'Break 1: SSH open to the world' },
          { type: 'code', language: 'bash', code: 'aws ec2 authorize-security-group-ingress \\\n  --group-id sg-9d724360e71bc3b40 \\\n  --protocol tcp \\\n  --port 22 \\\n  --cidr 0.0.0.0/0' },
          { type: 'paragraph', text: 'What this does: Adds a rule to public-sg allowing SSH from any IP on the internet. Why it matters: This is the single most-scanned AWS misconfiguration. Automated scanners find open SSH within minutes of exposure and attempt brute-force. The Phase 3 (Storage) project covered this same class of exposure with S3. It recurs here because it\'s the same underlying mistake - a default-safe configuration accidentally opened up. The correct baseline: The public-sg config declares SSH from 10.0.0.0/16 (the VPC CIDR, a placeholder for a real bastion/VPN source). Opening it to 0.0.0.0/0 is the misconfiguration.' },
          { type: 'heading', text: 'Break 2: PostgreSQL open to the world' },
          { type: 'code', language: 'bash', code: 'aws ec2 authorize-security-group-ingress \\\n  --group-id sg-2d32eb3364902f43e \\\n  --protocol tcp \\\n  --port 5432 \\\n  --cidr 0.0.0.0/0' },
          { type: 'paragraph', text: 'What this does: Adds a rule to data-sg allowing PostgreSQL from any IP. Why it matters: This bypasses the entire tiered architecture. The database is now reachable from the internet, regardless of the routing design or the NACL. The security group was the last line of defence, and it\'s been opened. This is the scenario the whole design exists to prevent. Seeing it get through one layer - while the NACL still blocks - demonstrates why defence in depth matters.' },
          { type: 'heading', text: 'Break 3: The NACL rule replaced' },
          { type: 'code', language: 'bash', code: 'aws ec2 replace-network-acl-entry \\\n  --network-acl-id $NACL_ID \\\n  --rule-number 100 \\\n  --protocol tcp \\\n  --port-range From=5432,To=5432 \\\n  --cidr-block 0.0.0.0/0 \\\n  --rule-action allow \\\n  --ingress' },
          { type: 'paragraph', text: 'What this does: Replaces the existing NACL rule that allowed PostgreSQL from the app subnet CIDR (10.0.10.0/24) with a version that allows it from anywhere. Why it matters: With this change, both the security group and the NACL on the data tier allow internet access. Now nothing but the routing table - no default route - prevents the database from being reached. And the routing table doesn\'t help for inbound connections, only outbound. The lesson: This is the difference between "the security group was misconfigured" and "both controls failed." A single misconfiguration is recoverable. Two simultaneous failures are how real incidents happen.' }
        ]
      },
      {
        id: 'detection',
        title: 'Detection Engineering',
        blocks: [
          { type: 'paragraph', text: 'The audit script (scripts/audit-vpc.sh) checks three things: Security groups for 0.0.0.0/0 on sensitive ports (22, 3389, 3306, 5432, 1433, 27017, 6379, 9200), NACLs for overly permissive rules on the same ports, VPC Flow Logs enabled on every VPC. Findings are written to a timestamped JSON report. The script exits non-zero when findings exist, so CI/CD systems can fail the build.' },
          { type: 'heading', text: 'The core logic' },
          { type: 'code', language: 'bash', code: 'sg_json=$(aws ec2 describe-security-groups --group-ids "$sg_id" --output json)\n\nfor port in "${SENSITIVE_PORTS[@]}"; do\n  matches=$(echo "$sg_json" | jq --argjson port "$port" \'\n    [.SecurityGroups[0].IpPermissions[]\n     | select(.FromPort <= $port and .ToPort >= $port)\n     | .IpRanges[]\n     | select(.CidrIp == "0.0.0.0/0")\n    ] | length\n  \')\n\n  if [ "$matches" -gt 0 ] 2>/dev/null; then\n    echo "  CRITICAL: port $port open to 0.0.0.0/0"\n  fi\ndone' },
          { type: 'paragraph', text: 'Why jq, not JMESPath: The initial version used --query with nested JMESPath filters. The pattern SecurityGroups[0].IpPermissions[?FromPort<=`22`].IpRanges[?CidrIp==\'0.0.0.0/0\']returned[]` even when matching rules existed. Testing confirmed Floci\'s implementation of nested JMESPath filters was incomplete - one level of filtering worked, two didn\'t. Switching to --output json | jq fixed it immediately. jq processes JSON structurally. It doesn\'t care about the source. Real-world takeaway: --query is fine for simple field extraction. Anything beyond that - nested filters, conditional expressions, complex arrays - is more reliable with jq. This is a portability pattern, not just a Floci quirk.' },
          { type: 'heading', text: 'The NACL check - and its first false positive' },
          { type: 'paragraph', text: 'The first version of the NACL check had a bug that the drill exposed. It flagged public-nacl for having ports 3389, 3306, 5432, 1433, 27017, 6379, and 9200 all "open to 0.0.0.0/0." But public-nacl doesn\'t open those ports. It opens the ephemeral port range (1024–65535) for return traffic. Every sensitive port above 1024 falls into that range, so the check flagged all of them. The fix: Two classes of check: For ports below 1024 (like SSH on 22): check whether the NACL rule covers the port (range query). For ports 1024 and above: check whether the NACL rule is exactly that port (exact-match query).' },
          { type: 'code', language: 'bash', code: 'if [ "$port" -ge 1024 ]; then\n  # exact match only\n  match=$(... | jq \'... select(.PortRange.From == $port and .PortRange.To == $port) ...\')\nelse\n  # range check\n  match=$(... | jq \'... select(.PortRange.From <= $port and .PortRange.To >= $port) ...\')\nfi' },
          { type: 'paragraph', text: 'Why this matters: It\'s a real detection-engineering lesson. A detector has to know what "normal" looks like. A wide ephemeral range is required by NACL semantics; it\'s not a finding. A specific service port open to the internet is. The two look similar in the raw data but mean different things. Interview-grade insight: "I learned to model the correct baseline before writing the detection. If the detector doesn\'t know what \'safe\' looks like, everything looks suspicious, and the signal gets lost in the noise."' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'paragraph', text: 'Two paths were demonstrated, and both matter in real incident response.' },
          { type: 'heading', text: 'Path A: CLI - immediate containment' },
          { type: 'code', language: 'bash', code: 'aws ec2 revoke-security-group-ingress \\\n  --group-id sg-9d724360e71bc3b40 \\\n  --protocol tcp \\\n  --port 22 \\\n  --cidr 0.0.0.0/0\n\naws ec2 revoke-security-group-ingress \\\n  --group-id sg-2d32eb3364902f43e \\\n  --protocol tcp \\\n  --port 5432 \\\n  --cidr 0.0.0.0/0\n\naws ec2 replace-network-acl-entry \\\n  --network-acl-id $NACL_ID \\\n  --rule-number 100 \\\n  --protocol tcp \\\n  --port-range From=5432,To=5432 \\\n  --cidr-block 10.0.10.0/24 \\\n  --rule-action allow \\\n  --ingress' },
          { type: 'paragraph', text: 'When to use: Active incident. Every second of exposure matters. CLI is immediate. What it doesn\'t do: Reconcile Terraform state. Terraform still thinks the wrong rules exist. This matters if a subsequent terraform apply runs - it might try to re-apply something you didn\'t intend, or produce a confusing drift report.' },
          { type: 'heading', text: 'Path B: Terraform - declarative reconciliation' },
          { type: 'code', language: 'bash', code: 'cd phase-4-vpc-security\nterraform apply' },
          { type: 'paragraph', text: 'What this does: Restores the environment to exactly what the config declares. Also fixes the smaller drifts the CLI fix missed - in this case, a tag on the Flow Log resource that had fallen out of sync. When to use: After containing the immediate issue. This is the "make reality match config" step. Why both: In a real incident, you don\'t choose. You do both. Fast containment via CLI. Then reconciliation via Terraform. Then verify with terraform plan returning "No changes" and the audit returning 0 findings. Only when both agree do you have high confidence the environment is correct.' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'paragraph', text: 'After both remediation paths: Audit script: 0 findings across all security groups, NACLs, and VPCs. Terraform plan: "No changes. Your infrastructure matches the configuration." Full cycle confirmation: Break → detect → contain → reconcile → verify all returned to baseline. Both tools agree. That\'s the confidence signal.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: 'Lesson 1: Defence in depth means independent controls' },
          { type: 'paragraph', text: 'The data tier had three independent protections: Routing - no default route to the internet, NACL - only the app subnet CIDR can reach it, Security group - only the app SG can reach it, no egress. Any single one failing should not result in exposure. The misconfiguration drill proved this: even after breaking the SG and the NACL simultaneously, the absence of a route still meant the database couldn\'t reach the internet. The path to compromise required all three to fail.' },
          { type: 'heading', text: 'Lesson 2: JMESPath and jq are not interchangeable' },
          { type: 'paragraph', text: 'Nested JMESPath filters via --query behaved inconsistently against Floci. jq did not. The portability rule: Simple field extraction - --query is fine, Nested filters, conditional logic, complex structures - jq. This isn\'t a Floci quirk. It\'s a portability pattern that applies against real AWS too, where service-specific query implementations differ subtly. jq is deterministic.' },
          { type: 'heading', text: 'Lesson 3: Detection tooling needs its own testing' },
          { type: 'paragraph', text: 'The NACL check\'s false positive on ephemeral ports was found only because the misconfiguration drill forced the script to run against a broken environment. Testing against a clean baseline would never have exposed it. Two rules follow: Test detection against a known-bad case, not just a clean one. Understand what "normal" looks like for the thing you\'re detecting - otherwise you flag everything.' },
          { type: 'heading', text: 'Lesson 4: Stateless vs stateful - the ephemeral port trap' },
          { type: 'paragraph', text: 'NACLs are stateless. Security groups are stateful. Concretely: SG: Allow port 443 inbound. Return traffic is automatic. NACL: Allow port 443 inbound. Return traffic needs its own rule - a rule for the ephemeral port range (typically 1024–65535) inbound. Every NACL that allows outbound connections needs matching inbound ephemeral rules. Forgetting this is why NACLs "sometimes work and sometimes don\'t" - the connection establishes but the response gets dropped.' },
          { type: 'heading', text: 'Lesson 5: The routing table is the strongest control' },
          { type: 'paragraph', text: 'A route is a deliberate act. A security group rule is often a matter of changing a number. A NACL rule is often inherited from a template. But a route - you have to add it. It\'s hard to add by accident. This makes the routing table the most reliable layer of defence. Build the network so that the default state is "no path" - then add paths only where they\'re needed.' },
          { type: 'heading', text: 'Lesson 6: CLI fixes reality; Terraform fixes state' },
          { type: 'paragraph', text: 'Both are necessary. Neither alone is enough in an environment managed by IaC. CLI fixes the running system but leaves Terraform out of sync. Terraform reconciles its declared state to reality but may act unpredictably if reality was changed by other means. The correct sequence is: CLI to contain, Terraform to reconcile, audit and plan to verify. Only when both the CLI audit and terraform plan agree that everything is correct do you have confidence.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'numberedList', items: ['Test the audit script against the broken state first. I built it against the clean baseline and only discovered the ephemeral-port false positive when I deliberately broke a NACL. In a real security team, detection content is developed against known-bad samples before deployment, for exactly this reason.', 'Use jq from the start. The first version of the script mixed --query and jq. Once the pattern "always use --output json | jq" was applied, the script became shorter, more reliable, and easier to reason about.', 'Add the NACL for the app subnet. The app subnet currently uses the VPC\'s default NACL, which allows all traffic. That\'s the AWS default and not wrong, but for full defence-in-depth parity with the other tiers, an app-subnet NACL would restrict ingress to the public subnet\'s CIDR and egress to the data subnet. The security groups already provide this control, so it\'s an additional layer rather than a gap.', 'Add VPC endpoints for AWS services. In a real environment, the app tier\'s traffic to S3 or DynamoDB would go via NAT, costing money and adding a hop. VPC endpoints let you reach AWS services without going through the internet. That\'s both a cost optimisation and a security improvement - traffic stays inside AWS\'s network.', 'Test the tag-drift scenario in advance. The Flow Log tag going out of sync was minor but educational - it\'s exactly what Terraform drift detection is for. Documenting tag management as a distinct concern would have prepared me for it.'] }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'paragraph', text: 'After building and drilling the environment:' },
          { type: 'list', items: ['Three-tier VPC with public, private-app, and private-data subnets', 'Routing controls - IGW for public, NAT for private-app, no route for private-data', 'Three security groups - tier-scoped, identity-based tier-to-tier access, no egress on data tier', 'Two network ACLs - public (permissive egress, specific ingress) and data (app-subnet CIDR only)', 'VPC Flow Logs capturing ALL traffic to S3, with Block Public Access enabled', 'A custom audit script covering security groups, NACLs, and flow logs, with JSON reporting and CI-friendly exit codes', 'A misconfiguration drill demonstrating end-to-end detection and remediation', 'Two remediation paths - CLI for containment, Terraform for reconciliation', 'All infrastructure under version control with remote state'] },
          { type: 'paragraph', text: 'The project demonstrates the network security lifecycle that cloud security engineering relies on: design the controls, build the baseline, test detection against known-bad cases, and prove remediation works. The most valuable lesson wasn\'t about any single AWS service. It was that detection is software, and software has bugs. The false positive on ephemeral ports would have produced weeks of noise in a production environment. The nested JMESPath failure would have produced silent false negatives - the worst kind. Both bugs were found by running the detector against a deliberately broken environment, not by reading the code. That\'s the discipline this project exists to demonstrate.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'paragraph', text: 'The full project is in the phase-4-vpc-security/ folder of the aws-storage-platform repository. Terraform configuration, audit script, and this case study are all version-controlled. github.com/Linathimqalo/aws-storage-platform' }
        ]
      }
    ]
  },
  {
    slug: 'zeus-malware-analysis',
    title: 'Zeus Banking Trojan – Malware Analysis Report',
    category: 'Security Research',
    date: '2025-06-01',
    tools: ['Malware Analysis', 'IDA Pro', 'OllyDbg', 'Wireshark', 'YARA Rules', 'Virtual Machines'],
    tags: ['Malware analysis', 'Static analysis', 'Network forensics', 'YARA', 'Reverse engineering'],
    summary: 'Tracing malicious behavior through controlled observation and evidence-led analysis of a Zeus banking trojan sample.',
    executiveSummary: 'This comprehensive analysis examines a Zeus banking trojan sample, focusing on its functionality, behavior patterns, and detection mechanisms. Zeus is a sophisticated piece of malware designed to steal banking credentials and financial information from infected systems. Through static and dynamic analysis techniques, we uncovered the malware\'s persistence mechanisms, communication protocols, and evasion techniques.',
    sections: [
      {
        id: 'sample-details',
        title: 'Sample Details',
        blocks: [
          { type: 'heading', text: 'File Information' },
          { type: 'list', items: ['File name: zeus_sample.exe', 'MD5: a1b2c3d4e5f6789012345678901234ab', 'SHA1: 1234567890abcdef1234567890abcdef12345678', 'SHA256: abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab', 'File size: 245,760 bytes', 'File type: PE32 executable (GUI) Intel 80386'] }
        ]
      },
      {
        id: 'static-analysis',
        title: 'Static Analysis',
        blocks: [
          { type: 'heading', text: 'PE Binary Format Analysis' },
          { type: 'list', items: ['Entry point: 0x00401000', 'Compilation timestamp: 2024-05-15 14:23:17', 'Sections: .text, .rdata, .data, .rsrc'] },
          { type: 'heading', text: 'Suspicious Strings Detected' },
          { type: 'list', items: ['Banking URLs and financial institution references', 'Registry key manipulation strings', 'Network communication endpoints', 'Encryption/decryption function names'] },
          { type: 'heading', text: 'DLL Dependencies' },
          { type: 'list', items: ['kernel32.dll - Process and memory management', 'user32.dll - User interface manipulation', 'wininet.dll - Internet connectivity functions', 'advapi32.dll - Registry manipulation'] },
          { type: 'heading', text: 'CAPA Findings' },
          { type: 'list', items: ['Keylogging capabilities detected', 'Form grabbing functionality', 'Process injection techniques', 'Anti-analysis evasion methods'] }
        ]
      },
      {
        id: 'dynamic-analysis',
        title: 'Dynamic Analysis',
        blocks: [
          { type: 'heading', text: 'Observed Behavior' },
          { type: 'list', items: ['Creates mutex for single instance execution', 'Establishes persistence via registry run keys', 'Injects code into legitimate browser processes', 'Monitors web traffic for banking sites', 'Exfiltrates captured data to C&C servers'] },
          { type: 'heading', text: 'Process Masquerading' },
          { type: 'list', items: ['Copies itself to system directories', 'Uses legitimate-sounding process names', 'Manipulates process memory to evade detection'] },
          { type: 'heading', text: 'Host-based Indicators' },
          { type: 'list', items: ['Registry modifications in HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'File creation in %APPDATA%\\Microsoft\\Windows', 'Network connections to suspicious domains', 'Browser process memory injection'] }
        ]
      },
      {
        id: 'yara-detection',
        title: 'YARA Detection Rule',
        blocks: [
          { type: 'code', language: 'yara', code: 'rule Zeus_Banking_Trojan {\n    meta:\n        description = "Detects Zeus banking trojan variants"\n        author = "Linathi Mqalo"\n        date = "2025-06-01"\n        malware_family = "Zeus"\n        severity = "high"\n    \n    strings:\n        $s1 = "SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run" wide ascii\n        $s2 = "wininet.dll" nocase\n        $s3 = { 8B 45 ?? 83 C0 ?? 89 45 ?? } // Assembly pattern\n        $s4 = "POST" wide ascii\n        $s5 = "Content-Type: application/x-www-form-urlencoded" wide ascii\n        \n        $hex1 = { 55 8B EC 83 EC ?? 53 56 57 }\n        $hex2 = { 6A ?? 68 ?? ?? ?? ?? E8 }\n        \n    condition:\n        uint16(0) == 0x5A4D and\n        filesize < 500KB and\n        (\n            (3 of ($s*)) or\n            (2 of ($hex*)) or\n            (2 of ($s*) and 1 of ($hex*))\n        )\n}' }
        ]
      }
    ]
  },
  {
    slug: 'cloud-honeypot-analysis',
    title: 'Comparative Cloud Honeypot Analysis – GCP vs Azure',
    category: 'Security Research',
    date: '2025-05-17',
    tools: ['T-POT', 'Docker', 'GCP', 'Azure', 'ELK Stack', 'Threat Intelligence'],
    tags: ['Honeypot', 'Cloud security', 'Threat intelligence', 'Network analysis', 'Docker'],
    summary: 'Comparative analysis of T-POT honeypot deployments across GCP and Azure to evaluate attack patterns, performance, and security features.',
    executiveSummary: 'This comprehensive study compares the effectiveness, performance, and insights gained from deploying T-Pot honeypot systems across Google Cloud Platform (GCP) and Microsoft Azure. The analysis provides valuable intelligence on attack patterns, threat landscapes, and cloud security considerations for organizations choosing between these major cloud providers.',
    sections: [
      {
        id: 'environment-setup',
        title: 'Environment Setup',
        blocks: [
          { type: 'table', headers: ['Component', 'GCP Configuration', 'Azure Configuration'], rows: [['VM Instance', 'e2-standard-4 (4 vCPU, 16GB RAM)', 'Standard_D4s_v3 (4 vCPU, 16GB RAM)'], ['Operating System', 'Ubuntu 20.04 LTS', 'Ubuntu 20.04 LTS'], ['Storage', '100GB SSD Persistent Disk', '100GB Premium SSD'], ['Network', 'Custom VPC with firewall rules', 'Virtual Network with NSG'], ['Region', 'us-central1', 'East US'], ['T-Pot Version', '23.04.0', '23.04.0']] }
        ]
      },
      {
        id: 'tpot-architecture',
        title: 'T-Pot Architecture & Components',
        blocks: [
          { type: 'heading', text: 'Core Honeypot Services' },
          { type: 'list', items: ['Cowrie (SSH/Telnet honeypot)', 'Dionaea (Multi-protocol honeypot)', 'Honeytrap (Network honeypot)', 'Glastopf (Web application honeypot)', 'Conpot (Industrial control system honeypot)'] },
          { type: 'heading', text: 'Data Processing & Visualization' },
          { type: 'list', items: ['Elasticsearch for log storage and indexing', 'Kibana for data visualization and dashboards', 'Logstash for log processing and enrichment', 'Suricata for network intrusion detection'] }
        ]
      },
      {
        id: 'attack-metrics',
        title: 'Attack Metrics & Threat Intelligence',
        blocks: [
          { type: 'heading', text: 'Top Targeted Ports' },
          { type: 'list', items: ['Port 22 (SSH): 45% of total attacks', 'Port 23 (Telnet): 28% of total attacks', 'Port 80 (HTTP): 15% of total attacks', 'Port 443 (HTTPS): 8% of total attacks', 'Port 2323 (Telnet alt): 4% of total attacks'] },
          { type: 'heading', text: 'Common CVEs Exploited' },
          { type: 'list', items: ['CVE-2021-44228 (Log4Shell)', 'CVE-2017-0144 (EternalBlue)', 'CVE-2014-6271 (Shellshock)', 'CVE-2016-10033 (PHPMailer)'] },
          { type: 'heading', text: 'Top Attacker Countries' },
          { type: 'numberedList', items: ['China (32%)', 'Russia (18%)', 'United States (12%)', 'Germany (8%)', 'Netherlands (6%)'] }
        ]
      },
      {
        id: 'azure-insights',
        title: 'Azure Insights',
        blocks: [
          { type: 'heading', text: 'Performance Characteristics' },
          { type: 'list', items: ['Average response time: 245ms', 'Network throughput: 850 Mbps', 'Storage IOPS: 3,200', 'Monthly cost: $156.80'] },
          { type: 'heading', text: 'Security Features' },
          { type: 'list', items: ['Network Security Groups provide granular control', 'Azure Security Center integration available', 'Built-in DDoS protection', 'Comprehensive logging through Azure Monitor'] },
          { type: 'heading', text: 'Attack Patterns' },
          { type: 'list', items: ['Higher frequency of brute force attacks', 'More sophisticated malware samples', 'Increased targeting of RDP services'] }
        ]
      },
      {
        id: 'gcp-insights',
        title: 'GCP Insights',
        blocks: [
          { type: 'heading', text: 'Performance Characteristics' },
          { type: 'list', items: ['Average response time: 198ms', 'Network throughput: 920 Mbps', 'Storage IOPS: 3,500', 'Monthly cost: $142.30'] },
          { type: 'heading', text: 'Security Features' },
          { type: 'list', items: ['Cloud Security Command Center integration', 'VPC firewall rules with hierarchical policies', 'Cloud Armor for DDoS protection', 'Stackdriver monitoring and logging'] },
          { type: 'heading', text: 'Attack Patterns' },
          { type: 'list', items: ['More diverse attack vectors', 'Higher volume of scanning activities', 'Increased IoT botnet activity'] }
        ]
      },
      {
        id: 'comparison',
        title: 'Performance, Cost & Stability Comparison',
        blocks: [
          { type: 'heading', text: 'Performance Winner: GCP' },
          { type: 'list', items: ['19% better response times', '8% higher network throughput', '9% better storage performance'] },
          { type: 'heading', text: 'Cost Winner: GCP' },
          { type: 'list', items: ['9.2% lower monthly operational costs', 'Better price-to-performance ratio', 'More predictable billing'] },
          { type: 'heading', text: 'Stability Analysis' },
          { type: 'list', items: ['Azure: 99.95% uptime, 2 minor incidents', 'GCP: 99.97% uptime, 1 minor incident', 'Both platforms exceeded SLA commitments'] }
        ]
      },
      {
        id: 'conclusion',
        title: 'Conclusion & Future Work',
        blocks: [
          { type: 'heading', text: 'Key Findings' },
          { type: 'list', items: ['GCP demonstrated superior performance and cost-effectiveness', 'Azure provided more comprehensive native security tooling', 'Both platforms are viable for honeypot deployments', 'Attack patterns vary significantly between cloud providers'] },
          { type: 'heading', text: 'Recommendations' },
          { type: 'list', items: ['Choose GCP for budget-conscious deployments', 'Select Azure for enterprise security integration', 'Deploy across multiple clouds for comprehensive threat intelligence'] },
          { type: 'heading', text: 'Future Research' },
          { type: 'list', items: ['Multi-region deployment analysis', 'Kubernetes-based honeypot orchestration', 'AI-powered attack pattern recognition', 'Integration with threat intelligence platforms'] }
        ]
      }
    ]
  }
] satisfies Project[];
projects.sort((a, b) => b.date.localeCompare(a.date));
export function displayDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
}
