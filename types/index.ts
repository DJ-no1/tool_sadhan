export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: any;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
}
