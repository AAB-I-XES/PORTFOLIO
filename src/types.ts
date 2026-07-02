export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  role: string;
  year: string;
  color: 'beige' | 'pink' | 'white' | 'dark';
  accentColor: string;
  isFeatured?: boolean;
  htmlUrl?: string;
  stars?: number;
  forks?: number;
  isFork?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: number; // 1-5 for visual mapping
    iconName: string;
    description: string;
  }[];
}

export interface JourneyMilestone {
  year: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
}
