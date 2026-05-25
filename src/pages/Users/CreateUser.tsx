import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Switch from "../../components/form/switch/Switch";
import { User, userService } from "../../services/userService";
import { RoleData, roleService } from "../../services/role.service";
import { useNavigate } from "react-router";

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [roles, setRoles] = useState<RoleData | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Simulate a validation check
  const validateEmail = (value: string) => {
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    setError(!isValidEmail);
    return isValidEmail;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSelectChange = (value: string) => {
    setRole(value);
  };

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

  const handleCreateUser = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setStatus("loading");
    try {
      await userService.create({
        firstName,
        lastName,
        email,
        password,
        RoleId: parseInt(role),
        isEnabled: enabled,
      });
      setStatus("success");
      navigate("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      setStatus("error");
    }
  };

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
            <div className="space-y-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  placeholder="Enter your first name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  placeholder="Enter your last name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  error={error}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  hint={error ? "This is an invalid email address." : ""}
                />
              </div>

              <div>
                <Label>Password Input</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
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
                <Select
                  options={
                    roles?.roles.map((r) => ({
                      value: r.id.toString(),
                      label: r.name,
                    })) || []
                  }
                  defaultValue={role}
                  placeholder="Select role"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
              </div>

              <div>
                <Label>Enabled</Label>
                <Switch
                  label="Default"
                  onChange={(checked) => {
                    setEnabled(checked);
                  }}
                  defaultChecked={enabled}
                />
              </div>

              <div>
                <button
                  onClick={() => handleCreateUser()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
