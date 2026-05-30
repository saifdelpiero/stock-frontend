import axiosInstance from "../api/axiosInstance";
import { Permission } from "./permission.service";

export type Role = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  Permissions: Permission[];
};

export type CreateRoleDto = {
  name: string;
  description: string;
  permissionIds?: number[];
};

export type RoleData = {
  success: boolean;
  roles: Role[];
};

export const roleService = {
  getAll: () => axiosInstance.get<RoleData>("/roles").then((r) => r.data),
  getById: (id: number) =>
    axiosInstance
      .get<{ success: boolean; role: Role }>(`/roles/${id}`)
      .then((r) => r.data),
  update: (id: number, data: CreateRoleDto) =>
    axiosInstance.put<Role>(`/roles/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/roles/${id}`),
  create: (data: CreateRoleDto) =>
    axiosInstance.post<Role>("/roles", data).then((r) => r.data),
};
