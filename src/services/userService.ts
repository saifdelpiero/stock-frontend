import axiosInstance from "../api/axiosInstance";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  RoleId: number;
};

export type UserData = {
  success: boolean;
  users: {
    data: User[];
    page: number;
    total: number;
    totalPages: number;
  };
};

export const userService = {
  getAll: () => axiosInstance.get<UserData>("/users").then((r) => r.data),
  update: (id: number, data: Partial<User>) =>
    axiosInstance.put<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/users/${id}`),
  create: (data: Omit<User, "id">) =>
    axiosInstance.post<User>("/users", data).then((r) => r.data),
};
