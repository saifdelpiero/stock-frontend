import axiosInstance from "../api/axiosInstance";

export type Warehouse = {
  id: number;
  name: string;
  address: string;
  type: string;
  min_stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateWarehouseDto = {
  name: string;
  address: string;
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
  getAll: () => axiosInstance.get("/warehouses").then((r) => r.data),
  getById: (id: number) =>
    axiosInstance.get(`/warehouses/${id}`).then((r) => r.data),
  update: (id: number, data: CreateWarehouseDto) =>
    axiosInstance.put(`/warehouses/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/warehouses/${id}`),
  create: (data: CreateWarehouseDto) =>
    axiosInstance.post("/warehouses", data).then((r) => r.data),
};
