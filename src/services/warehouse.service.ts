import axiosInstance from "../api/axiosInstance";

export type Warehouse = {
  id: number;
  name: string;
  adress: string;
  type: string;
  min_stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateWarehouseDto = {
  name: string;
  adress: string;
  type: string;
  min_stock: number;
};

export type WarehouseData = {
  success: boolean;
  warehouses: {
    data: Warehouse[];
    page: number;
    total: number;
    totalPages: number;
  };
};

export const warehouseService = {
  getAll: () => axiosInstance.get("/warehouses"),
  getById: (id: number) => axiosInstance.get(`/warehouses/${id}`),
  update: (id: number, data: CreateWarehouseDto) =>
    axiosInstance.put(`/warehouses/${id}`, data),
  remove: (id: number) => axiosInstance.delete(`/warehouses/${id}`),
  create: (data: CreateWarehouseDto) => axiosInstance.post("/warehouses", data),
};
