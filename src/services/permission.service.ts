import axiosInstance from "../api/axiosInstance";

export type Permission = {
  id: number;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  PermissionGroupId: number;
};

export type PermissionGroup = {
  id: number;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Permissions: Permission[];
};

export type PermissionData = {
  success: boolean;
  groups: PermissionGroup[];
};

export type CreatePermissionDto = {
  name: string;
  key: string;
  permissionIds: number[];
};

export const permissionService = {
  getAll: () =>
    axiosInstance.get<PermissionData>("/permission-groups").then((r) => r.data),
};
