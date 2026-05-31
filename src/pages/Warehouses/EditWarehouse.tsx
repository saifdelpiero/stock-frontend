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
  CreateWarehouseDto,
  Warehouse,
  warehouseService,
} from "../../services/warehouse.service";

const createWarehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required and must be at least 2 characters")
    .max(100),
  type: z
    .string()
    .trim()
    .min(2, "Type is required and must be at least 2 characters")
    .max(100),
  address: z
    .string()
    .trim()
    .min(2, "Address is required and must be at least 2 characters")
    .max(255),
  min_stock: z.number().min(0, "Minimum stock must be a non-negative number"),
});

export default function EditWarehouse() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateWarehouseDto>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: {
      name: "",
      type: "",
      address: "",
      min_stock: 0,
    },
  });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setStatus("loading");
    warehouseService
      .getById(parseInt(id))
      .then((warehouseData: { success: boolean; warehouse: Warehouse }) => {
        reset({
          name: warehouseData.warehouse.name,
          type: warehouseData.warehouse.type,
          address: warehouseData.warehouse.address,
          min_stock: warehouseData.warehouse.min_stock,
        });
        setStatus("success");
      })
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

  const handleUpdateWarehouse = async (formData: CreateWarehouseDto) => {
    if (!id) {
      setError("Invalid warehouse ID.");
      return;
    }
    setStatus("loading");
    try {
      await warehouseService.update(parseInt(id), formData);
      setStatus("success");
      navigate("/warehouses");
    } catch (error: any) {
      setStatus("error");
      setError(
        error?.["response"]?.["data"]?.["error"] ||
          "An error occurred while updating the warehouse.",
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
        title="Stock Management System | Update Warehouse"
        description="Stock Management System Update Warehouse Page"
      />
      <PageBreadcrumb pageTitle="Update Warehouse" />
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-6">
          <ComponentCard title="Update Warehouse">
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
              onSubmit={handleSubmit(handleUpdateWarehouse)}
            >
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className={inputClasses}
                    {...register("name")}
                    placeholder="Enter Warehouse Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    className={inputClasses}
                    {...register("address")}
                    placeholder="Enter Address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Select Type</Label>
                <select
                  {...register("type")}
                  className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    getValues("type")
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

                  <option
                    value="physique"
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Physique
                  </option>
                  <option
                    value="logic"
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    logic
                  </option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Minimum Stock</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="min_stock"
                    className={inputClasses}
                    {...register("min_stock", { valueAsNumber: true })}
                    placeholder="Enter Minimum Stock"
                  />
                  {errors.min_stock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.min_stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700  dark:text-gray-400"
                >
                  Update Warehouse
                </button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
