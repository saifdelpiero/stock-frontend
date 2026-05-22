import axiosInstance from "../api/axiosInstance";

export type Role = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type RoleData = {
  success: boolean;
  roles: Role[];
};

export const roleService = {
  getAll: () => axiosInstance.get<RoleData>("/roles").then((r) => r.data),
  update: (id: number, data: Partial<Role>) =>
    axiosInstance.put<Role>(`/roles/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/roles/${id}`),
  create: (data: Omit<Role, "id">) =>
    axiosInstance.post<Role>("/roles", data).then((r) => r.data),
};
