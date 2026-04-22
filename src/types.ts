export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  source?: string;
}

export interface Blogpost {
  id: string;
  authorId: number;
  title: string;
  content: string;
  excerpt?: string;
  bannerUrl?: string;
  videoUrl?: string;
  category?: string;
  tags: string[];
  readTime?: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: number;
  blogpostId: number;
  readPercent: number;
  completed: boolean;
  lastReadAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  requirement?: string;
}

export interface UserBadge extends Badge {
  awardedAt: Date;
}

export interface VirtualLab {
  id: string;
  blogpostId: number;
  title: string;
  description?: string;
  instructions?: string;
  codeTemplate?: string;
  expectedOutput?: string;
  order: number;
}

export interface Quiz {
  id: string;
  blogpostId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
}

export interface GraphNode {
  id: string;
  title: string;
  linkCount: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type ViewMode = 'editor' | 'graph';
