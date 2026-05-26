import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Switch from "../../components/form/switch/Switch";
import { userService, CreateUserDto } from "../../services/user.service";
import { RoleData, roleService } from "../../services/role.service";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const createUserSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
  RoleId: z.number().int(),
  isEnabled: z.boolean(),
});

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<RoleData | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      RoleId: 0,
      isEnabled: false,
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    roleService
      .getAll()
      .then((data: RoleData) => {
        setRoles(data);
        setStatus("success");
      })
      .catch((err: any) => {
        console.log("Error fetching users:", err);
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, []);

  const handleCreateUser = async (formFata: CreateUserDto) => {
    setStatus("loading");
    try {
      await userService.create(formFata);
      setStatus("success");
      navigate("/users");
    } catch (error) {
      console.error("Error creating user:", error);
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
      <PageBreadcrumb pageTitle="Create User" />
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-6">
          <ComponentCard title="Create User">
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleCreateUser)}
            >
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
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    className={inputClasses}
                    {...register("lastName")}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={inputClasses}
                    {...register("email")}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={inputClasses}
                    {...register("password")}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
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
              </div>

              <div>
                <Label>Enabled</Label>
                <Switch
                  label="Default"
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
                  Create User
                </button>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
