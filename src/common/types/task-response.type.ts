export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  assignee: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
