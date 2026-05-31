import { useEffect, useState } from "react";
import Switch from "../../components/form/switch/Switch";
import { User, userService, UpdateUserDto } from "../../services/user.service";
import { RoleData, roleService } from "../../services/role.service";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./users.css";

const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required and must be at least 2 characters")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name is required and must be at least 2 characters")
    .max(100, "Last name must be less than 100 characters"),
  email: z.email("Invalid email address"),
  RoleId: z.coerce.number<number | "">().positive("Please select a valid role"),
  isEnabled: z.boolean(),
});

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [roles, setRoles] = useState<RoleData | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      RoleId: "",
      isEnabled: false,
    },
  });

  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setStatus("loading");
    const controller = new AbortController();
    roleService
      .getAll()
      .then((data: RoleData) => {
        setRoles(data);
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
  }, []);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setStatus("loading");
    userService
      .getById(parseInt(id))
      .then((userData: { success: boolean; user: User }) => {
        reset({
          firstName: userData.user.firstName,
          lastName: userData.user.lastName,
          email: userData.user.email,
          RoleId: userData.user.RoleId,
          isEnabled: userData.user.isEnabled,
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

  const handleEditUser = async (formData: UpdateUserDto) => {
    if (!id) {
      return;
    }

    setStatus("loading");
    try {
      await userService.update(parseInt(id), formData);
      setStatus("success");
      navigate("/users");
    } catch (error: any) {
      setError(
        error?.["response"]?.["data"]?.["error"] ||
          "An error occurred while updating the user.",
      );
      setStatus("error");
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
        title="Stock Management System | Edit User"
        description="Stock Management System Edit User Page"
      />
      <PageBreadcrumb pageTitle="Edit User" />
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-6">
          <ComponentCard title="Edit User">
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
            <form className="space-y-6" onSubmit={handleSubmit(handleEditUser)}>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    className={inputClasses}
                    {...register("firstName")}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <input
                  type="text"
                  id="lastName"
                  className={inputClasses}
                  {...register("lastName")}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <input
                  type="text"
                  id="email"
                  className={inputClasses}
                  {...register("email")}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Select Role</Label>
                <select
                  {...register("RoleId", { valueAsNumber: true })}
                  className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    getValues("RoleId")
                      ? "text-gray-800 dark:text-white/90"
                      : "text-gray-400 dark:text-gray-400"
                  } dark:bg-dark-900`}
                >
                  {/* Placeholder option */}
                  <option
                    value=""
                    disabled
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Select an option
                  </option>
                  {/* Map over options */}
                  {roles &&
                    roles.roles.map((role) => (
                      <option
                        key={role.id}
                        value={role.id}
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        {role.name}
                      </option>
                    ))}
                </select>
                {errors.RoleId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.RoleId.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Enabled</Label>
                <Switch
                  label=""
                  onChange={(checked) => {
                    setValue("isEnabled", checked);
                  }}
                  defaultChecked={getValues("isEnabled")}
                />
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
