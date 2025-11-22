export const roles = ["user", "admin"] as const;
export type Role = (typeof roles)[number];

export type CreateTagResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export type TagWithStats = {
  id: number;
  tagName: string;
  createdBy?: string | null;
  courseCount: number;
}

export type TagModalProps = {
  onTagCreated?: () => void;
};