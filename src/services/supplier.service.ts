import axiosInstance from "../api/axiosInstance";

export type Supplier = {
  id: number;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateSupplierDto = {
  name: string;
  phone: string;
  address: string;
};

export type SupplierData = {
  success: boolean;
  suppliers: {
    data: Supplier[];
    page: number;
    total: number;
    totalPages: number;
  };
};

export const supplierService = {
  getAll: () =>
    axiosInstance.get<SupplierData>("/suppliers").then((r) => r.data),
  getById: (id: number) =>
    axiosInstance
      .get<{ success: boolean; supplier: Supplier }>(`/suppliers/${id}`)
      .then((r) => r.data),
  update: (id: number, data: CreateSupplierDto) =>
    axiosInstance.put<Supplier>(`/suppliers/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/suppliers/${id}`),
  create: (data: CreateSupplierDto) =>
    axiosInstance.post<Supplier>("/suppliers", data).then((r) => r.data),
};
