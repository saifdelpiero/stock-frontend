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
import {
  PermissionData,
  permissionService,
} from "../../services/permission.service";
import Checkbox from "../../components/form/input/Checkbox";

const editRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required and must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .min(2, "Description is required and must be at least 2 characters")
    .max(200, "Description must be at most 200 characters"),
  permissionIds: z
    .array(z.number())
    .min(1, "At least one permission must be selected"),
});

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const [permissions, setPermissions] = useState<PermissionData | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValues,
    formState: { errors },
  } = useForm<CreateRoleDto>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
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
          permissionIds: roleData.role.Permissions.map((p) => p.id),
        });
        setStatus("success");
      })
      .catch((err: any) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      })
      .finally(() => {
        setStatus("idle");
      });
    return () => controller.abort();
  }, [id]);

  // get permissions for checkbox list
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    permissionService
      .getAll()
      .then((data) => {
        setPermissions(data);
        setStatus("success");
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      });
    return () => controller.abort();
  }, []);

  const handleEditRole = async (formData: CreateRoleDto) => {
    if (!id) {
      return;
    }

    setStatus("loading");
    try {
      await roleService.update(parseInt(id), formData);
      setStatus("success");
      navigate("/roles");
    } catch (error: any) {
      setError(
        error?.["response"]?.["data"]?.["error"] ||
          "An error occurred while updating the role.",
      );
      setStatus("error");
    }
  };

  const setPermissionValues = (permissionId: number, checked: boolean) => {
    setValues((prevValues) => {
      const permissions = prevValues.permissionIds || [];
      if (checked) {
        return {
          ...prevValues,
          permissionIds: [...permissions, permissionId],
        };
      } else {
        return {
          ...prevValues,
          permissionIds: permissions.filter(
            (id: number) => id !== permissionId,
          ),
        };
      }
    });
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

  //   if (error) {
  //     return (
  //       <div className="">
  //         <div
  //           className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  //           role="alert"
  //         >
  //           <strong className="font-bold">Error: </strong>
  //           <span className="block sm:inline">
  //             {error || "Something went wrong while fetching users."}
  //           </span>
  //           <span
  //             className="absolute top-0 bottom-0 right-0 px-4 py-3"
  //             onClick={() => setError(null)}
  //           >
  //             <svg
  //               className="fill-current h-6 w-6 text-red-500"
  //               role="button"
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 20 20"
  //             >
  //               <title>Close</title>
  //               <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
  //             </svg>
  //           </span>
  //         </div>
  //       </div>
  //     );
  //   }

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
                <Label htmlFor="permissions">Permissions</Label>
                {permissions?.groups && permissions.groups.length > 0 ? (
                  permissions.groups.map((group) => (
                    <div key={group.id} className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {group.Permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              checked={
                                getValues("permissionIds")?.includes(
                                  permission.id,
                                ) || false
                              }
                              onChange={(checked) => {
                                setPermissionValues(permission.id, checked);
                              }}
                            />
                            <span className="block text-sm text-gray-700 dark:text-gray-400">
                              {permission.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No permissions available.
                  </p>
                )}

                {errors.permissionIds && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.permissionIds.message}
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
