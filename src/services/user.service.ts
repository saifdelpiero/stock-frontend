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
  Role: {
    id: number;
    name: string;
  };
};

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  RoleId: number;
  isEnabled: boolean;
};

export type UpdateUserDto = Omit<CreateUserDto, "password">;

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
  getById: (id: number) =>
    axiosInstance
      .get<{ success: boolean; user: User }>(`/users/${id}`)
      .then((r) => r.data),
  update: (id: number, data: Partial<CreateUserDto>) =>
    axiosInstance.put<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/users/${id}`),
  create: (data: CreateUserDto) =>
    axiosInstance.post<User>("/users", data).then((r) => r.data),
};
