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
  RoleId: number; // Allow both number and string for RoleId
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
  RoleId: number | ""; // Allow both number and string for RoleId
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
  getAll: (page: number = 1, search: string = "") => {
    const params = new URLSearchParams({ page: page.toString(), search });
    return axiosInstance
      .get<UserData>("/users", { params })
      .then((r) => r.data);
  },
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
