import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./purchase-order-history.css";
import {
  PurchaseOrderHistoryData,
  purchaseOrderHistoryService,
} from "../../services/purchase-order-history.service";

type Status = "idle" | "loading" | "success" | "error";

export default function PurchaseOrderHistory() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [purchaseOrderHistoriesData, setPurchaseOrderHistoriesData] =
    useState<PurchaseOrderHistoryData>();

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    if (!id) {
      setError("Purchase order ID is required.");
      setStatus("error");
      return;
    }

    purchaseOrderHistoryService
      .getByPurchaseOrderId(parseInt(id))
      .then((data: any) => {
        setPurchaseOrderHistoriesData(data);
        setStatus("success");
      })
      .catch((err: any) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (status === "loading") {
    return (
      <div className="flex  justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {error || "Something went wrong while fetching users."}
          </span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Stock Management System | Purchase Order History Page"
        description="Stock Management System Purchase Order History Page"
      />
      <PageBreadcrumb pageTitle="Purchase Order History" />
      <div className="space-y-6">
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
          {/* Card Header */}
          <div className="px-6 py-5">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Purchase Order History
              </h3>
            </div>
          </div>

          {purchaseOrderHistoriesData?.purchaseOrderHistories &&
          purchaseOrderHistoriesData?.purchaseOrderHistories?.data.length >
            0 ? (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">
                <table className="min-w-full">
                  <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                    <tr>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        id
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Quantity Ordered
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Quantity Received
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Supplier
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Created By
                      </th>
                      <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {purchaseOrderHistoriesData?.purchaseOrderHistories.data.map(
                      (purchaseOrder, index) => (
                        <tr key={purchaseOrder.id}>
                          <td className="px-5 py-4 text-gray-500 sm:px-6 text-start dark:text-gray-400">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {purchaseOrder.quantity_ordered}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {purchaseOrder.quantity_received}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {purchaseOrder.status}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {purchaseOrder.PurchaseOrder?.Supplier.name ?? ""}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {`${purchaseOrder.User?.firstName ?? ""} ${purchaseOrder.User?.lastName ?? ""}`}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {formatDate(purchaseOrder.createdAt)}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="p-4">No purchase order histories found.</p>
          )}
        </div>
      </div>
    </>
  );
}
