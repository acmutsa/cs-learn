export const roles = ["user", "admin"] as const;
export type Role = (typeof roles)[number];

export type CreateResponse =
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

export type AllTags = {
  tagName: string;
}

export type CourseWithData = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
  createdBy: string | null;
  tags: string[];
}

export type CourseIdPageProps = {
  params: Promise<{ courseId: string }>;
};