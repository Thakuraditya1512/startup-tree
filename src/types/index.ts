// Global type definitions can go here

export interface UserTask {
  id: string;
  user_id: string;
  module_id: string;
  title: string;
  status: string;
  type: string;
  content_url?: string;
  content_body?: string;
  completed_at?: string | null;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  xp: number;
}
