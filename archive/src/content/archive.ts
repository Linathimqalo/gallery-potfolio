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
  { name: 'Atlas', label: 'A spatial interpretation', url: 'https://the-atlas-portfolio.vercel.app' },
  { name: 'Obsidian', label: 'A cinematic interpretation', url: 'https://the-obsidian-portfolio.vercel.app' },
  { name: 'Substrate', label: 'A systems interpretation', url: 'https://the-substrate-portfolio.vercel.app' },
];
export const displayDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

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
          { type: 'heading', text: '1. Test the audit script from day one' },
          { type: 'paragraph', text: 'The bug existed for a full phase. In a real environment, that\'s a window during which exposure could go undetected. The script should have been tested against a known-bad bucket the moment it was written.' },
          { type: 'heading', text: '2. Use Terraform modules earlier' },
          { type: 'paragraph', text: 'The module refactor in Phase 5B reduced ~25 resource blocks to five module calls. That structure should have been in place from Phase 2 - copying config between phases led to a missing-resource error that cost time.' }
        ]
      }
    ]
  },
  {
    slug: 'ec2-rds-three-tier',
    title: 'EC2 + RDS Three-Tier Architecture - Case Study',
    category: 'Cloud Architecture',
    date: '2026-10-17',
    tools: ['AWS', 'EC2', 'RDS', 'Secrets Manager', 'SSM', 'Terraform', 'Python', 'Flask'],
    tags: ['Three-tier', 'VPC', 'IAM', 'Security', 'PostgreSQL'],
    summary: 'Building a production-style web application with private databases, dynamic secrets management, and zero-key access.',
    executiveSummary: 'This project documents the deployment of a classic three-tier architecture on AWS. A public-facing EC2 instance runs a Python Flask application, which communicates with a private PostgreSQL RDS database. The architecture implements strict network isolation, ensuring the database is unreachable from the internet. Hardcoded credentials are eliminated via AWS Secrets Manager, and SSH is completely disabled in favor of AWS Systems Manager (SSM). The project proves the ability to build, secure, and connect a full-stack application using Infrastructure as Code (Terraform).',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Web Tier: EC2 instance (t3.micro) in a public subnet, running nginx as a reverse proxy to Flask.' },
          { type: 'paragraph', text: 'Data Tier: RDS PostgreSQL in a private data subnet. No internet gateway route.' },
          { type: 'paragraph', text: 'Secrets: AWS Secrets Manager stores the generated database password.' },
          { type: 'paragraph', text: 'Access: SSM Session Manager replaces SSH for administrative access.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Security Group Chaining for the Database' },
          { type: 'paragraph', text: 'The RDS database security group does not allow inbound traffic based on CIDR blocks (e.g., 10.0.0.0/16). Instead, it allows inbound port 5432 exclusively from the EC2 application security group ID (security_groups = [aws_security_group.app_sg.id]). This is an identity-based rule. Even if a new server is launched in the public subnet, it cannot talk to the database unless it has the specific app-sg attached.' },
          { type: 'heading', text: 'Decision 2: No SSH Keys, Use SSM' },
          { type: 'paragraph', text: 'The EC2 instance is launched without a key pair. Port 22 is not open on the security group. Administrative access is handled entirely via AWS Systems Manager. This eliminates the risk of stolen SSH keys and ensures every administrative command is logged in CloudTrail.' },
          { type: 'heading', text: 'Decision 3: Dynamic Secrets, Not Environment Variables' },
          { type: 'paragraph', text: 'Rather than hardcoding the database password in the EC2 user_data script or passing it as a plain-text environment variable, the Python application uses the boto3 library to fetch the credentials from Secrets Manager at runtime. The EC2 IAM role is scoped to only allow secretsmanager:GetSecretValue for that specific secret ARN.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'In this project, the misconfiguration was a race condition during deployment.' },
          { type: 'heading', text: 'Break 1: The Race Condition' },
          { type: 'paragraph', text: 'During the initial deployment, the EC2 user_data script attempted to fetch the secret before the RDS database had finished provisioning and before Terraform had written the secret to Secrets Manager.' },
          { type: 'paragraph', text: 'Result: The app crashed with a ResourceNotFoundException.' },
          { type: 'paragraph', text: 'Detection: The application returned a 500 error, and CloudWatch logs showed the failure.' },
          { type: 'paragraph', text: 'Remediation: Fixed by changing the Python app to fetch the secret dynamically at runtime, and adding depends_on in Terraform to ensure RDS fully created before EC2 boots.' },
          { type: 'heading', text: 'Break 2: The user_data Cache' },
          { type: 'paragraph', text: 'After fixing the script, Terraform applied the change but the error persisted. Terraform updated the user_data in the EC2 metadata, but AWS does not re-run user_data on an existing instance.' },
          { type: 'paragraph', text: 'Remediation: Used terraform apply -replace="aws_instance.app_server" to force the destruction and recreation of the instance, ensuring the new script executed.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'While this project didn\'t include a custom bash script, detection was handled via:' },
          { type: 'paragraph', text: 'AWS Config / Terraform: Drift detection ensures the security groups remain exactly as coded.' },
          { type: 'paragraph', text: 'RDS Configuration: publicly_accessible = false was explicitly set in Terraform to prevent any accidental public IP assignment.' },
          { type: 'paragraph', text: 'IAM Access Analyzer: Ensured the EC2 role had no unintended cross-account trust.' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'Remediation in this project was heavily focused on the Terraform lifecycle.' },
          { type: 'paragraph', text: 'Containment: Destroyed the broken EC2 instance.' },
          { type: 'paragraph', text: 'Reconciliation: Ran terraform apply to restore declarative state.' },
          { type: 'paragraph', text: 'Verification: Curled the endpoint to confirm the JSON response ({"status":"success", "total_visits": 3}) and checked RDS metrics to confirm active connections.' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'curl http://<ec2-ip> returned the expected JSON success message.' },
          { type: 'paragraph', text: 'nc -zv <rds-endpoint> 5432 from a local machine timed out, proving the DB was not publicly accessible.' },
          { type: 'paragraph', text: 'SSM Session Manager successfully connected and allowed execution of psql commands.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: user_data is a one-time execution.' },
          { type: 'paragraph', text: 'Changing user_data in Terraform updates the metadata, but it does not trigger a reboot or re-run. To test changes, you must force instance replacement (-replace).' },
          { type: 'heading', text: 'Lesson 2: depends_on is critical for legacy infrastructure.' },
          { type: 'paragraph', text: 'Terraform builds in parallel. If an EC2 instance depends on a database, you must explicitly tell Terraform to wait for the RDS instance to finish creating.' },
          { type: 'heading', text: 'Lesson 3: Identity-based Security Groups scale better.' },
          { type: 'paragraph', text: 'Using security group IDs instead of CIDR blocks means you can scale the app tier without ever updating the database firewall rules.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Add an Application Load Balancer (ALB). While the public EC2 instance works, a production setup would place the EC2 in a private subnet and route traffic through an ALB.' },
          { type: 'paragraph', text: 'Use a Parameter Store instead of Secrets Manager for cheaper environments, though Secrets Manager is better for rotation.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'A fully functional, secure three-tier application deployed entirely via Terraform. The database is completely isolated, credentials are dynamically retrieved, and administrative access is securely audited via SSM. Cost: ~$0.10 for the duration of the lab.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 06-ec2-rds-three-tier/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'cloud-honeypot-analysis',
    title: 'Comparative Cloud Honeypot Analysis - Case Study',
    category: 'Cybersecurity',
    date: '2026-10-10',
    tools: ['T-Pot', 'Docker', 'ELK Stack', 'GCP', 'Azure', 'Security'],
    tags: ['Honeypot', 'Threat Intelligence', 'Docker', 'Elasticsearch', 'Multi-Cloud'],
    summary: 'Enterprise-grade honeypot system for threat intelligence and attack pattern analysis comparing GCP vs Azure deployments.',
    executiveSummary: 'This project documents the deployment of T-Pot multi-honeypot systems across both Google Cloud Platform and Microsoft Azure. The goal was to build comparative threat intelligence collection platforms to analyze attack patterns across different cloud providers. The architecture exposes multiple vulnerable Docker containers (SSH, SMB, RDP, HTTP) to the internet while strictly isolating the administrative dashboard and SSH access. The deployment successfully captured thousands of brute-force and exploit attempts, providing raw data for comparative threat intelligence analysis between the two cloud environments.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Compute: Multiple VM instances across GCP and Azure running Ubuntu.' },
          { type: 'paragraph', text: 'Containers: 41 Docker containers managed by the T-Pot framework per instance.' },
          { type: 'paragraph', text: 'Storage: EBS volumes and Azure disks for logs and Elasticsearch indices.' },
          { type: 'paragraph', text: 'Access: Administrative access (Kibana, SSH) restricted via Security Groups and Network Security Groups to trusted IPs.' }
        ]
      },
      {
        id: 'comparative-analysis',
        title: 'Comparative Analysis',
        blocks: [
          { type: 'heading', text: '02 — Comparative Analysis' },
          { type: 'paragraph', text: 'GCP Deployment: Google Cloud Compute Engine with Cloud Armor for DDoS protection.' },
          { type: 'paragraph', text: 'Azure Deployment: Azure Virtual Machines with Azure Firewall integration.' },
          { type: 'paragraph', text: 'Comparison Metrics: Attack volume, geographic distribution, attack types, response times, and false positive rates across both platforms.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '03 — Detection Engineering' },
          { type: 'paragraph', text: 'The T-Pot platform provides comprehensive detection capabilities:' },
          { type: 'paragraph', text: 'Suricata: Inspects network traffic for known exploit signatures.' },
          { type: 'paragraph', text: 'Cowrie: Emulates an SSH server, logging every username and password attempted.' },
          { type: 'paragraph', text: 'Dionaea: Emulates Windows SMB/MSSQL vulnerabilities to capture malware payloads.' },
          { type: 'paragraph', text: 'Detection Outcome: Captured 285,000+ attacks across both cloud providers, enabling comparative analysis of threat patterns and geographic distribution.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '04 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Cloud providers exhibit different attack patterns.' },
          { type: 'paragraph', text: 'The geographic distribution and types of attacks varied significantly between GCP and Azure, suggesting different threat actor targeting preferences.' },
          { type: 'heading', text: 'Lesson 2: Native cloud security tools integrate differently.' },
          { type: 'paragraph', text: 'GCP Cloud Armor and Azure Firewall offer different capabilities and APIs, requiring platform-specific configurations for equivalent security postures.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '05 — Outcome' },
          { type: 'paragraph', text: 'Successfully deployed comparative honeypot infrastructure across two major cloud providers. Captured, parsed, and visualized real-world attack traffic, proving the ability to build complex, multi-container security infrastructure with strict network isolation and enabling comparative threat intelligence analysis.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '06 — Repository' },
          { type: 'paragraph', text: 'The full project is in the cloud-honeypot-analysis repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/cloud-honeypot-analysis' }
        ]
      }
    ]
  },
  {
    slug: 'zeus-malware-analysis',
    title: 'Zeus Banking Trojan - Malware Analysis Case Study',
    category: 'Security Research',
    date: '2026-10-15',
    tools: ['IDA Pro', 'OllyDbg', 'Wireshark', 'Virtual Machines', 'YARA Rules'],
    tags: ['Malware Analysis', 'Reverse Engineering', 'Banking Trojan', 'Static Analysis', 'Dynamic Analysis'],
    summary: 'Deep dive malware analysis of Zeus banking trojan using static and dynamic analysis techniques.',
    executiveSummary: 'This project documents a comprehensive malware analysis of the Zeus banking trojan, one of the most notorious financial malware families. The analysis employed both static and dynamic techniques including disassembly with IDA Pro, debugging with OllyDbg, network traffic analysis with Wireshark, and behavioral analysis in isolated virtual machines. The investigation uncovered the trojan\'s C2 communication protocols, encryption mechanisms, data exfiltration methods, and anti-analysis techniques. The analysis produced YARA rules for detection and detailed documentation of the malware\'s infection chain and persistence mechanisms.',
    sections: [
      {
        id: 'analysis-methodology',
        title: 'Analysis Methodology',
        blocks: [
          { type: 'heading', text: '01 — Analysis Methodology' },
          { type: 'paragraph', text: 'Static Analysis: Disassembly and reverse engineering using IDA Pro to understand the malware\'s code structure and functionality.' },
          { type: 'paragraph', text: 'Dynamic Analysis: Debugging with OllyDbg to observe runtime behavior and trace execution flow.' },
          { type: 'paragraph', text: 'Network Analysis: Wireshark packet capture to identify C2 communication and data exfiltration.' },
          { type: 'paragraph', text: 'Behavioral Analysis: Execution in isolated VMs to observe system modifications and persistence mechanisms.' }
        ]
      },
      {
        id: 'key-findings',
        title: 'Key Findings',
        blocks: [
          { type: 'heading', text: '02 — Key Findings' },
          { type: 'heading', text: 'C2 Communication' },
          { type: 'paragraph', text: 'The malware uses encrypted HTTP/HTTPS communications with hardcoded C2 servers. Command-and-control packets use RC4 encryption with custom obfuscation to evade detection.' },
          { type: 'heading', text: 'Data Exfiltration' },
          { type: 'paragraph', text: 'Zeus captures banking credentials, browser cookies, and system information. Data is exfiltrated in encrypted POST requests to the C2 server at regular intervals.' },
          { type: 'heading', text: 'Anti-Analysis Techniques' },
          { type: 'paragraph', text: 'The malware implements multiple anti-debugging and anti-VM techniques including API hooking, process hollowing, and environment checks to detect analysis environments.' }
        ]
      },
      {
        id: 'detection-signatures',
        title: 'Detection Signatures',
        blocks: [
          { type: 'heading', text: '03 — Detection Signatures' },
          { type: 'paragraph', text: 'YARA Rules: Created custom YARA rules based on unique strings and code patterns identified during static analysis.' },
          { type: 'paragraph', text: 'IOC Indicators: Documented specific file hashes, registry keys, and network indicators of compromise for detection.' },
          { type: 'paragraph', text: 'Behavioral Signatures: Identified characteristic system modifications and process injection patterns for behavioral detection systems.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '04 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Multi-technique analysis is essential.' },
          { type: 'paragraph', text: 'Static analysis alone missed critical runtime behaviors. Combining static, dynamic, and network analysis provided a complete picture of the malware\'s capabilities.' },
          { type: 'heading', text: 'Lesson 2: Isolation is non-negotiable.' },
          { type: 'paragraph', text: 'Malware analysis requires strict isolation using dedicated VMs with network segmentation to prevent accidental infection of analysis systems.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '05 — Outcome' },
          { type: 'paragraph', text: 'Completed comprehensive malware analysis of Zeus banking trojan, producing detailed technical documentation, YARA detection rules, and IOC lists suitable for integration into security monitoring systems.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '06 — Repository' },
          { type: 'paragraph', text: 'The full project is in the Malware-Analysis repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/Malware-Analysis' }
        ]
      }
    ]
  },
  {
    slug: 'aws-threat-detection-honeypot',
    title: 'AWS Threat Detection & Honeypot - Case Study',
    category: 'Security',
    date: '2026-10-17',
    tools: ['AWS', 'EC2', 'Docker', 'T-Pot', 'Ubuntu', 'Security Groups'],
    tags: ['Honeypot', 'Threat Intelligence', 'Security', 'Docker', 'Elasticsearch'],
    summary: 'Deploying a multi-honeypot environment to capture, analyze, and visualize real-world cyber attacks in the cloud.',
    executiveSummary: 'This project documents the deployment of a T-Pot multi-honeypot on AWS EC2. The goal was to build a live threat intelligence collection platform. The architecture exposes 40+ vulnerable Docker containers (SSH, SMB, RDP, HTTP) to the internet while strictly isolating the administrative dashboard and SSH access to a single trusted IP. The deployment required overcoming memory constraints by provisioning an 8GB swapfile to stabilize Elasticsearch and Kibana under heavy attack loads. The honeypot successfully captured thousands of brute-force and exploit attempts, providing raw data for threat intelligence analysis.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Compute: EC2 m7i-flex.large (2 vCPU, 8GB RAM) running Ubuntu 24.04.' },
          { type: 'paragraph', text: 'Containers: 41 Docker containers managed by the T-Pot framework.' },
          { type: 'paragraph', text: 'Storage: 40GB gp3 EBS volume for logs and Elasticsearch indices.' },
          { type: 'paragraph', text: 'Access: Administrative access (Kibana, SSH) restricted via Security Groups to a single admin_cidr IP.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Separation of Attack Surface and Admin Plane' },
          { type: 'paragraph', text: 'The security group allows inbound traffic from 0.0.0.0/0 on ports 1–64293 to capture attacks. However, ports 64294–64300 (which include SSH, Cockpit, and the Kibana web interface) are strictly locked down to the administrator\'s public IP (/32 CIDR). This prevents attackers from pivoting from the honeypot data plane into the management plane.' },
          { type: 'heading', text: 'Decision 2: Minimal IAM Role' },
          { type: 'paragraph', text: 'The EC2 instance is assigned an IAM role with only AmazonSSMManagedInstanceCore. No S3 access, no Secrets Manager access, and no EC2 permissions are granted. If an attacker somehow breaks out of a Docker container and achieves host-level code execution, their AWS privileges are null.' },
          { type: 'heading', text: 'Decision 3: Swap Provisioning for Stability' },
          { type: 'paragraph', text: 'T-Pot\'s 40+ containers (specifically Elasticsearch and Kibana) can easily exceed 8GB of RAM during a high-volume attack. Instead of upgrading the EC2 instance (which would increase cost), we provisioned an 8GB swapfile with vm.swappiness=10. This prioritizes RAM but allows the system to survive traffic spikes without OOM (Out Of Memory) killing the logging pipeline.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'The "drill" here was dealing with the harsh reality of public internet exposure.' },
          { type: 'heading', text: 'Break 1: The T-Pot OS Compatibility' },
          { type: 'paragraph', text: 'T-Pot\'s upstream installer requires Ubuntu 26.04, but the latest available AWS AMI is 24.04. The installer failed immediately with a version mismatch.' },
          { type: 'paragraph', text: 'Remediation: Patched the install.sh script and the Ansible playbook (tpot.yml) to accept the version string "24.04" instead of "26.04". The Docker containers ran perfectly without modification.' },
          { type: 'heading', text: 'Break 2: The Silent OOM Killer' },
          { type: 'paragraph', text: 'Within 24 hours, Kibana became unresponsive. Investigation via docker ps showed Elasticsearch had restarted multiple times. The 8GB RAM was completely exhausted, and the Linux kernel was killing processes.' },
          { type: 'paragraph', text: 'Remediation: Created an 8GB swapfile, enabled it with swapon, and added it to /etc/fstab. Verified system stability under load.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'The T-Pot platform inherently is the detection engineering tool.' },
          { type: 'paragraph', text: 'Suricata: Inspects network traffic for known exploit signatures.' },
          { type: 'paragraph', text: 'Cowrie: Emulates an SSH server, logging every username and password attempted.' },
          { type: 'paragraph', text: 'Dionaea: Emulates Windows SMB/MSSQL vulnerabilities to capture malware payloads.' },
          { type: 'paragraph', text: 'Detection Outcome: Captured 285,000+ attacks on GCP/Azure previously; on AWS, the honeypot captured immediate automated scanning within minutes of the public IP being assigned.' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'No external threat remediation was needed (the attacks were the point). Internal system remediation consisted of ensuring Docker containers remained healthy and logs were not lost.' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Confirmed 41 Docker containers running via docker ps | wc -l.' },
          { type: 'paragraph', text: 'Verified Kibana dashboard was accessible at https://<ip>:64297 via the admin IP.' },
          { type: 'paragraph', text: 'Validated that attack traffic was populating Elasticsearch indices in real-time.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Cloud services are scanned instantly.' },
          { type: 'paragraph', text: 'The moment the EC2 instance received a public IP, automated SSH brute-force attempts began. There is no "grace period" on the internet.' },
          { type: 'heading', text: 'Lesson 2: Memory is the silent bottleneck.' },
          { type: 'paragraph', text: 'T-Pot looks lightweight, but Elasticsearch is a Java application that requires significant RAM. Swap is a mandatory safety net for honeypots on standard instances.' },
          { type: 'heading', text: 'Lesson 3: Upstream scripts often lag behind cloud AMIs.' },
          { type: 'paragraph', text: 'T-Pot expected an OS that AWS doesn\'t yet offer. Being comfortable reading and patching shell scripts and Ansible YAML files is a critical cloud engineering skill.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Use a managed logging pipeline. Instead of relying on local Elasticsearch, I would route the honeypot logs to CloudWatch or an external SIEM (like Splunk or Microsoft Sentinel) to decouple storage from compute.' },
          { type: 'paragraph', text: 'Automate teardown. Honeypots are expensive to run 24/7. A scheduled Lambda function that destroys the CloudFormation/Terraform stack after 7 days would prevent bill shock.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'Successfully deployed a high-interaction honeypot on AWS. Captured, parsed, and visualized real-world attack traffic, proving the ability to build complex, multi-container security infrastructure with strict network isolation. Cost: ~$16 for 7 days of compute.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 03-honeypot/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'aws-cloudtrail-athena-forensics',
    title: 'AWS Centralized Logging & Forensics - Case Study',
    category: 'Security',
    date: '2026-10-17',
    tools: ['AWS', 'CloudTrail', 'S3', 'Athena', 'Glue', 'IAM', 'SNS'],
    tags: ['Logging', 'Forensics', 'SQL', 'Audit', 'Security'],
    summary: 'Centralizing AWS API audit logs and building a serverless SQL query interface for rapid security incident investigation.',
    executiveSummary: 'This project documents the deployment of an audit and forensic analysis pipeline. AWS CloudTrail was configured as a Multi-Region trail with log file integrity validation, routing logs securely to a tightly controlled S3 bucket. To solve the problem of unreadable JSON logs, AWS Glue and Amazon Athena were deployed to create a schema and query interface. This allowed for rapid SQL-based investigation of API activity. Additionally, IAM Access Analyzer was enabled to detect overly permissive resource policies and unused permissions.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Log Source: CloudTrail (Multi-Region) generating JSON logs.' },
          { type: 'paragraph', text: 'Storage: S3 bucket with Block Public Access, bucket policies restricting access, and log integrity validation enabled.' },
          { type: 'paragraph', text: 'Query Engine: AWS Glue (Data Catalog) defining the table schema, and Amazon Athena (Workgroup) running SQL queries directly against S3.' },
          { type: 'paragraph', text: 'Identity Auditing: IAM Access Analyzer (External and Unused Access analyzers).' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Log File Validation' },
          { type: 'paragraph', text: 'CloudTrail was configured with enable_log_file_validation = true. This creates a digest file for every log file, allowing an investigator to cryptographically prove that the logs have not been tampered with or deleted by an attacker.' },
          { type: 'heading', text: 'Decision 2: Partition Projection over Crawlers' },
          { type: 'paragraph', text: 'Instead of using an AWS Glue Crawler (which costs money to run and takes time to schedule), I used Athena Partition Projection. This allows the table to dynamically calculate the S3 path based on the date (e.g., AWSLogs/2026/10/18/), reducing query costs and latency.' },
          { type: 'heading', text: 'Decision 3: IAM Access Analyzer for Least Privilege' },
          { type: 'paragraph', text: 'Enabled two analyzers: one for external access (detecting if any resource, like an S3 bucket, is shared outside the account) and one for unused access (detecting roles that haven\'t been used in 90 days). This automates policy drift detection.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'The challenge here was Terraform state management and API limits.' },
          { type: 'heading', text: 'Break 1: The GuardDuty API Block' },
          { type: 'paragraph', text: 'Attempted to deploy Amazon GuardDuty via Terraform, but the API rejected the request with SubscriptionRequiredException.' },
          { type: 'paragraph', text: 'Root Cause: New AWS accounts on the Free Plan require a manual "Activation" in the console before Security APIs can be enabled.' },
          { type: 'paragraph', text: 'Remediation: Deferred GuardDuty. Documented the limitation and successfully deployed CloudTrail and Athena instead.' },
          { type: 'heading', text: 'Break 2: The Empty Query Result' },
          { type: 'paragraph', text: 'After deploying Athena, the initial query returned 0 rows.' },
          { type: 'paragraph', text: 'Root Cause: Athena\'s partition projection relies on time. CloudTrail writes logs with a slight delay, and the timezone boundaries (UTC vs local) caused the query to look in yesterday\'s folder, which didn\'t exist yet.' },
          { type: 'paragraph', text: 'Remediation: Ran MSCK REPAIR TABLE cloudtrail_logs to force Athena to scan the S3 bucket and register the partitions manually.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'The core detection capability here is Forensic SQL.' },
          { type: 'code', language: 'sql', code: 'SELECT eventname, sourceipaddress, useridentity.username, eventtime FROM cloudtrail_logs WHERE eventname = \'DeleteBucket\' LIMIT 10;' },
          { type: 'paragraph', text: 'This allows a Cloud Security Engineer to rapidly trace an incident: Who deleted the bucket? From what IP? At what time?' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'When an incident occurs, this pipeline is the first step in remediation. By querying Athena, you can identify the compromised IAM key or the malicious IP address. You would then use the CLI to revoke the IAM key or update the WAF to block the IP.' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Successfully queried 47.89 KB of CloudTrail logs in 1.3 seconds.' },
          { type: 'paragraph', text: 'Confirmed Athena returned 10 rows of actual AWS API activity.' },
          { type: 'paragraph', text: 'Verified CloudTrail was actively writing .json.gz files to the S3 bucket.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Free Plan limitations exist.' },
          { type: 'paragraph', text: 'Not all AWS services can be automated immediately on a new account. Manual activation is sometimes required before Terraform can manage them.' },
          { type: 'heading', text: 'Lesson 2: Partition projection beats Crawlers for cost.' },
          { type: 'paragraph', text: 'Crawlers are expensive and slow. Projection tells Athena exactly where the data is, cutting query times and eliminating crawler costs.' },
          { type: 'heading', text: 'Lesson 3: JSON parsing in Athena can be tricky.' },
          { type: 'paragraph', text: 'CloudTrail logs are deeply nested JSON. Defining the correct schema in Glue (struct<...>) is essential for querying fields like userIdentity.username.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Enable GuardDuty manually first. Next time, I would enable GuardDuty in the console immediately after account creation, then import it into Terraform.' },
          { type: 'paragraph', text: 'Convert logs to Parquet. JSON is slow and expensive to query. In a production environment, I would use a Lambda function to convert CloudTrail JSON to Parquet format in S3, which speeds up Athena queries by 10x and reduces cost.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'Built a permanent, serverless forensic query tool. The project demonstrates the ability to design a multi-service security pipeline (CloudTrail, S3, Glue, Athena) and write complex IAM and S3 bucket policies to secure the logs. Cost: ~$0.10.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 07-monitoring-detection/ and 08-athena-cloudtrail/ folders of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'aws-serverless-pipeline',
    title: 'Event-Driven Serverless Pipeline - Case Study',
    category: 'Serverless',
    date: '2026-10-17',
    tools: ['AWS', 'Lambda', 'S3', 'DynamoDB', 'Python', 'CloudWatch'],
    tags: ['Serverless', 'Lambda', 'Event-Driven', 'DynamoDB', 'IAM'],
    summary: 'Building an automated, event-driven architecture to process file uploads, compute cryptographic hashes, and store metadata.',
    executiveSummary: 'This project documents the deployment of an event-driven serverless pipeline on AWS. When a file is uploaded to an S3 bucket, it automatically triggers a Python Lambda function. The function reads the object, computes its SHA-256 hash, and writes the metadata to a DynamoDB table. The architecture focuses heavily on least-privilege IAM, ensuring the Lambda execution role can only read from the specific S3 bucket, write to the specific DynamoDB table, and log to CloudWatch. The project demonstrates the ability to build scalable, decoupled cloud-native applications.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Ingestion: S3 bucket (blocked public access, versioning enabled).' },
          { type: 'paragraph', text: 'Compute: AWS Lambda (Python 3.12) triggered by S3 ObjectCreated events.' },
          { type: 'paragraph', text: 'Storage: Amazon DynamoDB (On-Demand billing) storing file metadata (Key, Size, SHA-256, Timestamp).' },
          { type: 'paragraph', text: 'Observability: CloudWatch Logs capturing execution traces and latency.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Least-Privilege Execution Role' },
          { type: 'paragraph', text: 'The Lambda function was granted an IAM role with explicit, scoped permissions:' },
          { type: 'list', items: ['s3:GetObject on the specific bucket ARN.', 'dynamodb:PutItem on the specific table ARN.', 'logs:CreateLogStream and logs:PutLogEvents on the specific CloudWatch Log Group.'] },
          { type: 'paragraph', text: 'No wildcards (*) were used. If the function is compromised, the blast radius is limited to reading from that one bucket and writing to that one table.' },
          { type: 'heading', text: 'Decision 2: Lambda Resource Policy' },
          { type: 'paragraph', text: 'The S3 bucket is granted permission to invoke the Lambda function via a Resource Policy. This policy strictly limits the invoker to s3.amazonaws.com and requires the SourceArn to match the specific S3 bucket. This prevents other AWS services or external accounts from triggering the function.' },
          { type: 'heading', text: 'Decision 3: Idempotency via DynamoDB Primary Key' },
          { type: 'paragraph', text: 'The DynamoDB table uses the object_key as the primary key. If the same file is uploaded twice, the Lambda function overwrites the existing record rather than creating duplicate entries. (In a production environment with versioned buckets, the versionId would also be included in the key).' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'The challenge here was navigating AWS account concurrency limits.' },
          { type: 'heading', text: 'Break 1: The Reserved Concurrency Limit' },
          { type: 'paragraph', text: 'Attempted to set reserved_concurrent_executions = 5 to cap costs. The deployment failed with InvalidParameterCombination.' },
          { type: 'paragraph', text: 'Root Cause: AWS enforces a minimum unreserved concurrency floor of 10. On a new account with a total limit of 10, reserving 5 drops the unreserved pool below the floor.' },
          { type: 'paragraph', text: 'Remediation: Removed the reserved concurrency setting. Documented the limitation and relied on the account-level quota.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'The pipeline inherently generates forensic data. The SHA-256 hash written to DynamoDB acts as an integrity check. In a security context, if a file on the S3 bucket is altered, its hash will no longer match the hash stored in DynamoDB, triggering an alert in downstream systems.' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'No external threats were present in this lab. Remediation focused on resolving the Terraform state issues.' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Uploaded a test file (test-upload.txt) to S3.' },
          { type: 'paragraph', text: 'Verified the Lambda triggered automatically within 5 seconds.' },
          { type: 'paragraph', text: 'Queried DynamoDB and confirmed the SHA-256 hash matched the local sha256sum output exactly.' },
          { type: 'paragraph', text: 'Tested URL-encoded keys (uploading a file with spaces in the name) and confirmed the Python urllib.parse.unquote_plus handled it correctly.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Cold starts are measurable.' },
          { type: 'paragraph', text: 'CloudWatch Logs showed the first invocation took 964ms (500ms init + 462ms execution). The second invocation took 453ms. For latency-sensitive applications, Provisioned Concurrency is required.' },
          { type: 'heading', text: 'Lesson 2: S3 event payloads are complex.' },
          { type: 'paragraph', text: 'S3 sends a deeply nested JSON object containing bucket details, request parameters, and the object key. Knowing how to parse this in Python (event[\'Records\'][0][\'s3\'][\'object\'][\'key\']) is essential.' },
          { type: 'heading', text: 'Lesson 3: Reserved concurrency is not free to configure.' },
          { type: 'paragraph', text: 'AWS limits how much you can reserve on new accounts. Always check account quotas before hardcoding concurrency limits in Terraform.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Use SQS as a buffer. If a massive number of files are uploaded simultaneously, Lambda could throttle. Placing an SQS queue between S3 and Lambda would buffer the requests and process them reliably.' },
          { type: 'paragraph', text: 'Increase memory for larger files. 128MB of RAM is fine for text files, but hashing a 1GB image would cause an OOM crash.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'Built a fully serverless, event-driven pipeline with strict least-privilege IAM and full observability. The project demonstrates the ability to connect multiple AWS services via triggers and API calls without managing any servers. Cost: $0.00.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 05-lambda-s3-iam/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'aws-vpc-three-tier',
    title: 'AWS Three-Tier VPC - Case Study',
    category: 'Networking',
    date: '2026-10-17',
    tools: ['AWS', 'VPC', 'Terraform', 'CloudWatch'],
    tags: ['VPC', 'Networking', 'Subnets', 'Routing', 'Security'],
    summary: 'Designing and deploying a highly available, segmented network foundation on AWS.',
    executiveSummary: 'This project documents the design and deployment of a production-grade Virtual Private Cloud (VPC) on AWS. The architecture spans two Availability Zones and implements strict network segmentation across public, private application, and private data tiers. It utilizes an Internet Gateway for public access and an S3 Gateway Endpoint to provide secure, cost-effective access to S3 for the private tiers without requiring a NAT Gateway. VPC Flow Logs are routed to CloudWatch for continuous network auditing.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'VPC: 10.0.0.0/16 in eu-north-1.' },
          { type: 'paragraph', text: 'Public Subnets: 2 subnets (one per AZ) with route to Internet Gateway.' },
          { type: 'paragraph', text: 'Private App Subnets: 2 subnets (one per AZ) with route to S3 Gateway Endpoint.' },
          { type: 'paragraph', text: 'Private Data Subnets: 2 subnets (one per AZ) with no internet route.' },
          { type: 'paragraph', text: 'Logging: VPC Flow Logs to CloudWatch.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: No NAT Gateway' },
          { type: 'paragraph', text: 'A NAT Gateway costs ~$32/month. By using an S3 Gateway Endpoint, the private subnets can still access S3 (where our logs and assets live) without a NAT. This saves money and reduces the attack surface.' },
          { type: 'heading', text: 'Decision 2: Multi-AZ' },
          { type: 'paragraph', text: 'All resources are deployed across two Availability Zones (eu-north-1a and eu-north-1b). If one AZ fails, the other remains operational.' },
          { type: 'heading', text: 'Decision 3: Segregated Route Tables' },
          { type: 'paragraph', text: 'The public route table points to the Internet Gateway. The private route tables do not. If a security group in a private subnet is accidentally misconfigured, the routing table still prevents internet access.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'This project did not include a break/fix drill, but laid the foundation for the drills in Project 6.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'Enabled VPC Flow Logs to CloudWatch. This captures IP traffic going to and from network interfaces in the VPC, which is critical for incident response (e.g., identifying which IP address was scanning the subnet).' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'N/A (Foundation project).' }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Confirmed 6 subnets across 2 AZs.' },
          { type: 'paragraph', text: 'Verified public route tables pointed to IGW.' },
          { type: 'paragraph', text: 'Verified private route tables lacked an IGW route.' },
          { type: 'paragraph', text: 'Verified Flow Logs were active.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Subnet naming is cosmetic.' },
          { type: 'paragraph', text: 'A subnet is only "public" if it has a route to a IGW. You can name a subnet "public" but if it has no route, it is private.' },
          { type: 'heading', text: 'Lesson 2: Gateway Endpoints are free.' },
          { type: 'paragraph', text: 'There is no reason to route S3 traffic through a NAT Gateway. Gateway Endpoints are free and keep the traffic within the AWS network.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Add VPC Endpoints for other services (SSM, Secrets Manager, ECR) to eliminate the need for any internet access in the private subnets.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'A highly available, secure VPC foundation that supports all subsequent AWS projects. Cost: $0.00.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 01-vpc-three-tier/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'aws-iam-access-analyzer',
    title: 'IAM Access Analyzer & Policy Drift - Case Study',
    category: 'Security',
    date: '2026-10-17',
    tools: ['AWS', 'IAM', 'Terraform'],
    tags: ['IAM', 'Least Privilege', 'Compliance', 'Auditing'],
    summary: 'Enforcing the principle of least privilege by continuously auditing IAM roles and resource policies.',
    executiveSummary: 'This project documents the deployment of AWS IAM Access Analyzer to continuously monitor the AWS account for overly permissive resource policies and unused IAM permissions. Using Terraform, two account-level analyzers were deployed: one to detect cross-account resource sharing (e.g., a public S3 bucket) and another to identify unused IAM roles and permissions over a 90-day window. This establishes a continuous compliance baseline and supports the principle of least privilege.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Analyzer 1: External Access Analyzer (detects resources like S3 buckets or IAM roles shared outside the account).' },
          { type: 'paragraph', text: 'Analyzer 2: Unused Access Analyzer (detects IAM roles/users that haven\'t been used in 90 days).' },
          { type: 'paragraph', text: 'Deployment: Terraform.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Account-Level over Organization-Level' },
          { type: 'paragraph', text: 'The analyzers were deployed at the Account level (type = "ACCOUNT"). An Organization-level analyzer requires AWS Organizations, which is unnecessary for a single-account lab.' },
          { type: 'heading', text: 'Decision 2: 90-Day Window for Unused Access' },
          { type: 'paragraph', text: 'AWS recommends 90 days to account for quarterly review cycles. Setting the unused_access_age = 90 ensures that permissions used at least once a quarter are not falsely flagged as "unused".' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'This was a simple deployment, but the "drill" is waiting for the first scan.' },
          { type: 'heading', text: 'Observation 1: The "Check Back Later" State' },
          { type: 'paragraph', text: 'After deployment, the AWS console did not immediately show findings. It displayed "Check back later to view the summary."' },
          { type: 'paragraph', text: 'Root Cause: Access Analyzer takes up to 24 hours to complete its first full scan of all resources.' },
          { type: 'paragraph', text: 'Remediation: Documented the delay. Future deployments should plan for this initial propagation time.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'The analyzers are the detection mechanism. When a developer accidentally makes an S3 bucket public, the External Access Analyzer immediately flags it. When a contractor leaves the company and their IAM key is left active but unused, the Unused Access Analyzer flags it.' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'When findings appear, the standard remediation path is:' },
          { type: 'list', items: ['Identify the resource via the ARN in the finding.', 'Update the bucket policy or IAM role to remove the public access.', 'Archive the finding in the console.'] }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Deployed 2 analyzers via Terraform in 10 seconds.' },
          { type: 'paragraph', text: 'Verified both analyzers were active in the AWS Console.' },
          { type: 'paragraph', text: 'Confirmed the 90-day configuration was applied to the unused analyzer.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Access Analyzer is free.' },
          { type: 'paragraph', text: 'Unlike most AWS security tools, both the External and Unused Access analyzers are completely free. There is no excuse not to enable them in every account.' },
          { type: 'heading', text: 'Lesson 2: CloudTrail is the underlying engine.' },
          { type: 'paragraph', text: 'The Unused Access Analyzer relies on CloudTrail logs to determine if a role or user has been active.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Enable Organization-level Analyzer if I were managing multiple AWS accounts.' },
          { type: 'paragraph', text: 'Integrate with Security Hub to aggregate Access Analyzer findings alongside other security alerts.' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'A foundational security control that continuously enforces least privilege. It replaces manual IAM reviews with automated, API-driven compliance. Cost: $0.00.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 04-iam-access-analyzer/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  },
  {
    slug: 'aws-s3-secure-bucket',
    title: 'S3 Secure Bucket - Case Study',
    category: 'Storage',
    date: '2026-10-17',
    tools: ['AWS', 'S3', 'KMS', 'IAM', 'Terraform'],
    tags: ['S3', 'Security', 'Encryption', 'KMS', 'Policies'],
    summary: 'Deploying a hardened S3 bucket with KMS encryption, strict deny policies, and access logging.',
    executiveSummary: 'This project documents the deployment of a highly secure S3 bucket environment. Since S3 misconfigurations are the leading cause of cloud data breaches, the architecture applies defense-in-depth: Block Public Access at four levels, server-side encryption using a customer-managed KMS key, bucket policies that deny non-TLS traffic and unencrypted uploads, and access logging to a separate bucket.',
    sections: [
      {
        id: 'architecture',
        title: 'Architecture',
        blocks: [
          { type: 'heading', text: '01 — Architecture' },
          { type: 'paragraph', text: 'Main Bucket: Stores data, encrypted with AWS KMS (SSE-KMS).' },
          { type: 'paragraph', text: 'Logging Bucket: Stores access logs for the main bucket.' },
          { type: 'paragraph', text: 'KMS Key: Customer-managed key with annual rotation.' },
          { type: 'paragraph', text: 'Policies: Bucket policy denying non-TLS requests and denying uploads without KMS encryption.' }
        ]
      },
      {
        id: 'security-design',
        title: 'Security Design Decisions',
        blocks: [
          { type: 'heading', text: '02 — Security Design Decisions' },
          { type: 'heading', text: 'Decision 1: Customer-Managed KMS Key' },
          { type: 'paragraph', text: 'Instead of using the default AWS-managed key, we provisioned a Customer-Managed Key (CMK). This gives us control over the key policy, allows for annual key rotation, and provides a clear audit trail in CloudTrail of who used the key and when.' },
          { type: 'heading', text: 'Decision 2: Explicit Deny for Non-TLS' },
          { type: 'paragraph', text: 'The bucket policy contains an explicit Deny for any request where aws:SecureTransport is false. This guarantees that data cannot be uploaded or downloaded over unencrypted HTTP.' },
          { type: 'heading', text: 'Decision 3: StringNotEqualsIfExists for KMS' },
          { type: 'paragraph', text: 'We enforce that uploads must use aws:kms encryption. However, we use StringNotEqualsIfExists instead of StringNotEquals. This allows the AWS CLI (which sometimes sends implicit encryption headers) to upload the file while still relying on the bucket\'s default encryption.' }
        ]
      },
      {
        id: 'misconfiguration-drill',
        title: 'The Misconfiguration Drill',
        blocks: [
          { type: 'heading', text: '03 — The Misconfiguration Drill' },
          { type: 'callout', label: 'Note', text: 'The drill here was navigating IAM and CLI behavior.' },
          { type: 'heading', text: 'Break 1: The "AccessDenied" on Upload' },
          { type: 'paragraph', text: 'After applying the bucket policy, uploading a test file via the AWS CLI failed with AccessDenied.' },
          { type: 'paragraph', text: 'Root Cause: The CLI was defaulting to AES256 encryption, which the bucket policy blocked.' },
          { type: 'paragraph', text: 'Remediation: Forced the CLI to use --sse aws:kms to match the policy requirements, proving the deny policy was actively working.' }
        ]
      },
      {
        id: 'detection-engineering',
        title: 'Detection Engineering',
        blocks: [
          { type: 'heading', text: '04 — Detection Engineering' },
          { type: 'paragraph', text: 'Access logging is enabled. Every GET or PUT request is logged to the separate logging bucket, providing a full audit trail for incident response.' }
        ]
      },
      {
        id: 'remediation',
        title: 'Remediation',
        blocks: [
          { type: 'heading', text: '05 — Remediation' },
          { type: 'paragraph', text: 'If a data leak is suspected:' },
          { type: 'list', items: ['Check the logging bucket for unauthorized GET requests.', 'Rotate the KMS key (if necessary).', 'Verify Block Public Access is still enabled.'] }
        ]
      },
      {
        id: 'verification',
        title: 'Verification',
        blocks: [
          { type: 'heading', text: '06 — Verification' },
          { type: 'paragraph', text: 'Confirmed Block Public Access was enabled.' },
          { type: 'paragraph', text: 'Confirmed KMS encryption was active on uploaded objects.' },
          { type: 'paragraph', text: 'Confirmed the deny policy blocked an unencrypted upload.' },
          { type: 'paragraph', text: 'Confirmed logs were written to the log bucket.' }
        ]
      },
      {
        id: 'key-lessons',
        title: 'Key Lessons',
        blocks: [
          { type: 'heading', text: '07 — Key Lessons' },
          { type: 'heading', text: 'Lesson 1: Bucket policies are evaluated before IAM policies.' },
          { type: 'paragraph', text: 'An explicit Deny in a bucket policy overrides an Allow in an IAM policy. This is why the bucket policy is the strongest control for preventing data exposure.' },
          { type: 'heading', text: 'Lesson 2: CLI behavior varies.' },
          { type: 'paragraph', text: 'The AWS CLI on Windows Git Bash behaves slightly differently than on Linux. Knowing how to handle StringNotEqualsIfExists is critical for cross-platform compatibility.' }
        ]
      },
      {
        id: 'what-id-do-differently',
        title: 'What I\'d Do Differently',
        blocks: [
          { type: 'heading', text: '08 — What I\'d Do Differently' },
          { type: 'paragraph', text: 'Use S3 Object Lock. For compliance reasons, enabling Object Lock prevents even the root user from deleting files for a set period (WORM model).' }
        ]
      },
      {
        id: 'outcome',
        title: 'Outcome',
        blocks: [
          { type: 'heading', text: '09 — Outcome' },
          { type: 'paragraph', text: 'A bulletproof S3 bucket configuration that prevents public exposure and enforces encryption at rest and in transit. Cost: <$0.50.' }
        ]
      },
      {
        id: 'repository',
        title: 'Repository',
        blocks: [
          { type: 'heading', text: '10 — Repository' },
          { type: 'paragraph', text: 'The full project is in the 02-s3-secure-bucket/ folder of the aws-cloud-labs repository.' },
          { type: 'paragraph', text: 'github.com/Linathimqalo/aws-cloud-labs' }
        ]
      }
    ]
  }
];
