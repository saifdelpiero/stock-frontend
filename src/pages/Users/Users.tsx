import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
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

type Status = "idle" | "loading" | "success" | "error";

export default function Users() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UserData>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const button = <Button size="sm"> Add User </Button>;

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
  };

  const handleDeletePopup = (user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  // const handleEdit = async (id: number, data: Partial<User>) => {
  //   const updated = await userService.update(id, data);
  //   setUsers((prev) =>
  //     prev?.users.data.map((u) => (u.id === id ? updated : u)),
  //   );
  // };

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
                  <i className="bi bi-person-plus"></i> Add User{" "}
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
                        <button
                          style={{ fontSize: "20px", color: "green" }}
                          className="mx-1"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          style={{ fontSize: "20px", color: "red" }}
                          className="mx-1"
                          onClick={() => handleDeletePopup(user)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          style={{ fontSize: "20px", color: "blue" }}
                          className="mx-1"
                        >
                          <i className="bi bi-eye"></i>
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
