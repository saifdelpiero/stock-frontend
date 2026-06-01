import axiosInstance from "../api/axiosInstance";

export type PurchaseOrderHistory = {
  id: number;
  quantity_ordered: number;
  quantity_received: number;
  status: string;
  action: string;
  createdAt: string;
  updatedAt: string;
  PurchaseOrder: {
    id: number;
    quantity_ordered: number;
    quantity_received: number;
    status: string;
    createdAt: string;
    Supplier: {
      id: number;
      name: string;
    };
  };
  User: {
    id: number;
    firstName: string;
    lastName: string;
  };
};
export type PurchaseOrderHistoryData = {
  success: boolean;
  purchaseOrderHistories: {
    data: PurchaseOrderHistory[];
    page: number;
    total: number;
    totalPages: number;
  };
};

export const purchaseOrderHistoryService = {
  getByPurchaseOrderId: (purchaseOrderId: number) =>
    axiosInstance
      .get<PurchaseOrderHistoryData>(`/purchase-order-history`, {
        params: {
          purchaseOrder: purchaseOrderId,
        },
      })
      .then((r) => r.data),
};
