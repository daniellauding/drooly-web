export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: { seconds: number };
  recipes?: any[];
}