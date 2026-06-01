import axiosInstance from "../api/axiosInstance";

export type PurchaseOrder = {
  id: number;
  quantity_received: number;
  quantity_ordered: number;
  supplier_id: number;
  created_by: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Supplier: {
    id: number;
    name: string;
    phone: string;
    address: string;
  };
  User: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

export type CreatePurchaseOrderDto = {
  quantity_ordered: number;
  supplier_id: number;
};

export type PurchaseOrderData = {
  success: boolean;
  purchaseOrders: {
    data: PurchaseOrder[];
    page: number;
    total: number;
    totalPages: number;
  };
};

export const purchaseOrderService = {
  getAll: () =>
    axiosInstance
      .get<PurchaseOrderData>("/purchase-orders")
      .then((r) => r.data),
  getById: (id: number) =>
    axiosInstance
      .get<{
        success: boolean;
        purchaseOrder: PurchaseOrder;
      }>(`/purchase-orders/${id}`)
      .then((r) => r.data),
  update: (id: number, data: CreatePurchaseOrderDto) =>
    axiosInstance
      .put<{
        success: boolean;
        purchaseOrder: PurchaseOrder;
      }>(`/purchase-orders/${id}`, data)
      .then((r) => r.data),
  remove: (id: number) => axiosInstance.delete(`/purchase-orders/${id}`),
  create: (data: CreatePurchaseOrderDto) =>
    axiosInstance.post("/purchase-orders", data).then((r) => r.data),
};
