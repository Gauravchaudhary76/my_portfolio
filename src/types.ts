export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  tags: string[];
  highlight: string;
  highlightLabel: string;
  github?: string;
  demo?: string;
  imageAlt: string;
  accent: "green" | "cyan" | "purple" | "amber";
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  category: "coding" | "hackathon" | "certification" | "academic";
  details: string;
  accent: "green" | "cyan" | "purple" | "amber";
}

export interface CodingProfile {
  id: string;
  platform: string;
  username: string;
  stats: string;
  profileUrl: string;
  rank?: string;
  color: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  color: string;
}
