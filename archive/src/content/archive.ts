export type ContentBlock =
  | { type: 'paragraph' | 'heading' | 'quote'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[] }
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
// Demonstration content and dates only. Replace with the supplied case studies.
export const projects: Project[] = [
  {
    slug: 'aws-storage-platform', title: 'AWS Storage Platform', category: 'Cloud Engineering', date: '2026-03-12',
    tools: ['AWS S3', 'IAM', 'AWS CLI', 'CloudWatch'], tags: ['Object storage', 'Access control', 'Observability'],
    summary: 'Designing a resilient storage foundation with deliberate access controls and lifecycle policies.',
    executiveSummary: 'A foundation, not just a bucket. This placeholder case study explores a storage platform built around durable objects, least-privilege access, and clear operational visibility. The final project narrative and evidence will replace this demonstration content.',
    sections: [
      { id: 'context', title: 'Context & objectives', blocks: [
        { type: 'paragraph', text: 'A storage platform must do more than retain files. It needs explicit ownership, predictable retention, and a clear answer to who can read or change each object. This example outlines those decisions without claiming production results.' },
        { type: 'heading', text: 'Design constraints' },
        { type: 'list', items: ['Keep objects private by default.', 'Separate administrative access from application access.', 'Make retention rules and operational signals explicit.'] },
      ] },
      { id: 'implementation', title: 'Platform implementation', blocks: [
        { type: 'paragraph', text: 'The demonstration architecture separates the application role, object storage, and monitoring. Versioning protects against unintended replacement; lifecycle rules manage transitions as objects age.' },
        { type: 'diagram', code: 'Application\n    │\n    └── IAM role · least privilege\n            │\n            └── S3 bucket · private\n                    ├── Object versioning\n                    ├── Lifecycle policies\n                    └── CloudWatch metrics' },
        { type: 'code', language: 'Shell', code: 'aws s3api put-bucket-versioning \\\n  --bucket archive-storage-example \\\n  --versioning-configuration Status=Enabled' },
      ] },
      { id: 'reflection', title: 'Validation & reflection', blocks: [
        { type: 'quote', text: 'A configuration is only useful when its behavior can be verified.' },
        { type: 'paragraph', text: 'Validation would include testing allowed and denied operations, restoring an earlier object version, and checking that monitoring reflects those actions. Actual findings will be added with the full case study.' },
        { type: 'callout', label: 'Key lesson', text: 'Durability and access control are different concerns. A resilient platform makes both visible and tests them independently.' },
      ] },
    ],
  },
  {
    slug: 'aws-vpc-network-security', title: 'AWS VPC Network Security', category: 'Network Security', date: '2026-02-18',
    tools: ['AWS VPC', 'Security Groups', 'NACLs', 'VPC Flow Logs'], tags: ['Network isolation', 'Defense in depth', 'Traffic analysis'],
    summary: 'Building network boundaries that make traffic paths explicit, observable, and defensible.',
    executiveSummary: 'Security starts with the boundaries. This placeholder examines a segmented VPC, controlled traffic paths, and the difference between security groups and network access control lists. It is a layout demonstration, not a report of completed deployment findings.',
    sections: [
      { id: 'architecture', title: 'Network architecture', blocks: [
        { type: 'paragraph', text: 'The example places internet-facing resources in a public subnet and application resources in a private subnet. Route tables define reachability; security controls determine which reachable traffic is allowed.' },
        { type: 'diagram', code: 'VPC · 10.0.0.0/16\n├── Public subnet · 10.0.1.0/24\n│   ├── Internet gateway route\n│   └── Load balancer\n└── Private subnet · 10.0.2.0/24\n    ├── Application tier\n    └── No direct inbound internet route' },
      ] },
      { id: 'controls', title: 'Controls & verification', blocks: [
        { type: 'heading', text: 'Layered access policies' },
        { type: 'list', items: ['Allow application traffic only from the load balancer security group.', 'Review subnet-level rules separately from resource-level rules.', 'Use flow logs to investigate accepted and rejected traffic.'] },
        { type: 'code', language: 'Shell', code: 'aws ec2 describe-security-groups \\\n  --filters Name=vpc-id,Values=vpc-example \\\n  --query "SecurityGroups[*].[GroupId,GroupName]"' },
        { type: 'callout', label: 'Key lesson', text: 'A private subnet is a routing decision, not a complete security policy. Reachability and authorization must both be reviewed.' },
      ] },
    ],
  },
  {
    slug: 'zeus-malware-analysis', title: 'Zeus Malware Analysis', category: 'Security Research', date: '2026-01-24',
    tools: ['Wireshark', 'Ghidra', 'Isolated sandbox'], tags: ['Malware analysis', 'Static analysis', 'Network forensics'],
    summary: 'Tracing malicious behavior through controlled observation and evidence-led analysis.',
    executiveSummary: 'Observe first. Conclude carefully. This placeholder describes an evidence-led approach to studying Zeus malware in an isolated environment. No real sample indicators, execution results, or attribution claims are included in this demonstration.',
    sections: [
      { id: 'scope', title: 'Scope & containment', blocks: [
        { type: 'paragraph', text: 'The investigation begins with containment. An isolated lab, controlled network access, and recoverable snapshots keep analysis separate from everyday systems. Findings must distinguish direct observations from hypotheses.' },
        { type: 'list', items: ['Record sample provenance and cryptographic hashes.', 'Capture a clean baseline before observation.', 'Avoid exposing the lab to production systems or unrestricted networks.'] },
      ] },
      { id: 'analysis', title: 'Analysis workflow', blocks: [
        { type: 'heading', text: 'From artifacts to evidence' },
        { type: 'paragraph', text: 'Static inspection and controlled behavioral observation provide different views of a sample. The final narrative will connect each finding to its supporting artifact, including network traces where available.' },
        { type: 'quote', text: 'An indicator is a starting point for investigation, not a conclusion on its own.' },
        { type: 'callout', label: 'Key lesson', text: 'Keep the distinction between observed behavior and inferred intent explicit. Reproducible evidence makes a technical conclusion defensible.' },
      ] },
    ],
  },
] satisfies Project[];
projects.sort((a, b) => b.date.localeCompare(a.date));
export function displayDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
}
