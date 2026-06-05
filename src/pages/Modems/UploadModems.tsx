import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import { useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";

const uploadModemsSchema = z.object({
  excelFile: z
    .any()
    .refine((files) => files?.length === 1, "An Excel file is required")
    .refine((files) => {
      const file = files?.[0];
      if (!file) return false;
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      return allowedTypes.includes(file.type);
    }, "Only Excel files are allowed")
    .refine((files) => {
      const file = files?.[0];
      if (!file) return false;
      const maxSizeInBytes = 5 * 1024 * 1024;
      return file.size <= maxSizeInBytes;
    }, "File size must be less than 5MB"),
});

type UploadModemsFormData = z.infer<typeof uploadModemsSchema>;

export default function UploadModems() {
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UploadModemsFormData>({
    resolver: zodResolver(uploadModemsSchema),
    defaultValues: {
      excelFile: undefined,
    },
  });

  // Watch the excelFile input to trigger validation when a file is selected
  const excelFiles = watch("excelFile");
  const selectedFileName =
    excelFiles && excelFiles.length > 0 ? excelFiles[0].name : "No file chosen";

  // Custom handler to trigger file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const { ref: excelFileRef, ...restExcelFileRegister } = register("excelFile");

  const handleUploadModems = async (data: any) => {
    if (!id) {
      setError("Invalid warehouse ID.");
      return;
    }
    setStatus("loading");
    try {
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
              onSubmit={handleSubmit(handleUploadModems)}
            >
              <div>
                <input
                  type="file"
                  id="excelFile"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  ref={(e) => {
                    excelFileRef(e);
                    fileInputRef.current = e;
                  }}
                  {...restExcelFileRegister}
                />
                <div>
                  <Label htmlFor="excelFile">Excel File</Label>
                  <div
                    className="flex items-center space-x-4"
                    onClick={handleFileInputClick}
                  >
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={selectedFileName}
                        readOnly
                        className="bg-gray-100 border border-gray-300 text-gray-400 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 w-full upload-file-button"
                      />
                    </div>
                  </div>
                </div>
                {errors.excelFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.form?.message}
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
