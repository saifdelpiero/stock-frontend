import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  userService,
  type UserData,
  type User,
} from "../../services/userService";
import { Modal } from "../../components/ui/modal";
import { Link } from "react-router";
import "./users.css";

type Status = "idle" | "loading" | "success" | "error";

export default function Users() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UserData>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    userService
      .getAll()
      .then((data: any) => {
        setUsersData(data);
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

  const handleDelete = async (id: number) => {
    try {
      setStatus("loading");
      await userService.remove(id);

      const data = usersData?.users.data.filter((u) => u.id !== id);
      const newUsersData = {
        success: usersData!.success,
        users: {
          ...usersData!.users,
          data: data!,
        },
      };
      setUsersData(newUsersData);
      setIsOpen(false);
      setStatus("success");
    } catch (error) {
      setError("Failed to delete user.");
      setStatus("error");
    }
  };

  const handleDeletePopup = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  if (isOpen) {
    return (
      <Modal
        isOpen={isOpen}
        isFullscreen={false}
        onClose={() => setIsOpen(false)}
      >
        <p>
          Do want to delete {selectedUser?.firstName} {selectedUser?.lastName} ?
        </p>
        <div style={{ marginTop: "30px" }}>
          <button
            style={{
              width: "120px",
              height: "45px",
              border: "1px solid gray",
              marginRight: "10px",
              borderRadius: "10px",
            }}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{
              width: "120px",
              height: "45px",
              border: "none",
              backgroundColor: "#e73215",
              borderRadius: "10px",
              color: "white",
            }}
            onClick={() => handleDelete(selectedUser!.id)}
          >
            Delete
          </button>
        </div>
      </Modal>
    );
  }

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
        title="Stock Management System | Users Page"
        description="Stock Management System Users Page"
      />
      <PageBreadcrumb pageTitle="Users List" />
      <div className="space-y-6">
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
          {/* Card Header */}
          <div className="px-6 py-5">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Users
              </h3>
              <Link to="/create-user">
                <Button>
                  <i className="bi bi-person-plus"></i> Add User
                </Button>
              </Link>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">
              <table className="min-w-full">
                <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      id
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      First Name
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Last Name
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Role
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Enabled
                    </th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {usersData?.users.data.map((user, index) => (
                    <tr key={user["id"]}>
                      <td className="px-5 py-4 text-gray-500 sm:px-6 text-start dark:text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user["firstName"]}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user["lastName"]}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user["email"]}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user["Role"]?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            user["isEnabled"] === true ? "success" : "error"
                          }
                        >
                          {user["isEnabled"] == true ? "True" : "False"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Link to={`/update-user/${user.id}`}>
                          <button
                            style={{ fontSize: "20px", color: "green" }}
                            className="mx-1"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Link>

                        <button
                          style={{ fontSize: "20px", color: "red" }}
                          className="mx-1"
                          onClick={() => handleDeletePopup(user)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
