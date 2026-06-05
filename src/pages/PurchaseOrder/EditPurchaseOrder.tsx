import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PurchaseOrder,
  purchaseOrderService,
  UpdatePurchaseOrderDto,
} from "../../services/purchase-order.service";
import {
  Supplier,
  SupplierData,
  supplierService,
} from "../../services/supplier.service";

const updatePurchaseOrderSchema = z.object({
  quantity_ordered: z
    .number()
    .min(0, "Quantity ordered is required and must be greater than 0"),
  supplier_id: z.coerce
    .number<number | "">()
    .positive("Please select a valid supplier"),
});

export default function EditPurchaseOrder() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<any>(null);
  const [suppliersData, setSuppliersData] = useState<SupplierData>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePurchaseOrderDto>({
    resolver: zodResolver(updatePurchaseOrderSchema),
    defaultValues: {
      quantity_ordered: 0,
      supplier_id: 0,
    },
  });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setStatus("loading");
    purchaseOrderService
      .getById(parseInt(id))
      .then(
        (purchaseOrderData: {
          success: boolean;
          purchaseOrder: PurchaseOrder;
        }) => {
          reset({
            quantity_ordered: purchaseOrderData.purchaseOrder.quantity_ordered,
            supplier_id: purchaseOrderData.purchaseOrder.supplier_id,
          });
          setStatus("success");
        },
      )
      .catch((err: any) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
        }
      })
      .finally(() => {
        setStatus("idle");
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    supplierService
      .getAll()
      .then((data: SupplierData) => {
        setSuppliersData(data);
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

  const handleUpdatePurchaseOrder = async (data: UpdatePurchaseOrderDto) => {
    if (!id) {
      setError("Invalid warehouse ID.");
      return;
    }
    setStatus("loading");
    try {
      await purchaseOrderService.update(parseInt(id), data);
      setStatus("success");
      navigate("/purchase-orders");
    } catch (error: any) {
      setStatus("error");
      setError(
        error?.["response"]?.["data"]?.["error"] ||
          "An error occurred while updating the purchase order.",
      );
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;
  inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;

  if (status === "loading") {
    return (
      <div className="flex  justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Stock Management System | Update Purchase Order"
        description="Stock Management System Update Purchase Order Page"
      />
      <PageBreadcrumb pageTitle="Update Purchase Order" />
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-6">
          <ComponentCard title="Update Purchase Order">
            {error && (
              <div className="">
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
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
            )}
            <form
              autoComplete="off"
              className="space-y-6"
              onSubmit={handleSubmit(handleUpdatePurchaseOrder)}
            >
              <div>
                <Label htmlFor="quantity_ordered">Quantity Ordered</Label>
                <div className="relative">
                  <input
                    type="number"
                    id="quantity_ordered"
                    className={inputClasses}
                    {...register("quantity_ordered", { valueAsNumber: true })}
                    placeholder="Enter Quantity Ordered"
                  />
                  {errors.quantity_ordered && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.quantity_ordered.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Select Supplier</Label>
                <select
                  {...register("supplier_id")}
                  className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    getValues("supplier_id")
                      ? "text-gray-800 dark:text-white/90"
                      : "text-gray-400 dark:text-gray-400"
                  } dark:bg-dark-900`}
                >
                  {/* Placeholder option */}
                  <option
                    value=""
                    disabled
                    hidden
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Select an option
                  </option>
                  {/* Map over options */}

                  {suppliersData?.suppliers.data.map((supplier: Supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.supplier_id.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700  dark:text-gray-400"
                >
                  {isSubmitting ? "Updating..." : "Update Purchase Order"}
                </button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
