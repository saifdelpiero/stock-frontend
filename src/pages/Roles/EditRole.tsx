import { useEffect, useState } from "react";
import { CreateRoleDto, Role, roleService } from "../../services/role.service";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./roles.css";

const editRoleSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2, "Description is required"),
});

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleDto>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setStatus("loading");
    roleService
      .getById(parseInt(id))
      .then((roleData: { success: boolean; role: Role }) => {
        reset({
          name: roleData.role.name,
          description: roleData.role.description,
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

  const handleEditRole = async (formData: CreateRoleDto) => {
    if (!id) {
      return;
    }

    setStatus("loading");
    try {
      await roleService.update(parseInt(id), formData);
      setStatus("success");
      navigate("/roles");
    } catch (error) {
      setError("Failed to update role.");
      setStatus("error");
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
    <div>
      <PageMeta
        title="Stock Management System | Create User"
        description="Stock Management System Create User Page"
      />
      <PageBreadcrumb pageTitle="Edit User" />
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-6">
          <ComponentCard title="Edit Role">
            <form className="space-y-6" onSubmit={handleSubmit(handleEditRole)}>
              <div>
                <Label htmlFor="name">Role Name</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    className={inputClasses}
                    {...register("name")}
                    placeholder="Enter role name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <input
                  type="text"
                  id="description"
                  className={inputClasses}
                  {...register("description")}
                  placeholder="Enter role description"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit User
                </button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
