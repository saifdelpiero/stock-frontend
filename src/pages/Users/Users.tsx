import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  userService,
  type UserData,
  type User,
} from "../../services/user.service";
import { Modal } from "../../components/ui/modal";
import { Link } from "react-router";
import ReactPaginate from "react-paginate";
import "./users.css";

type Status = "idle" | "loading" | "success" | "error";

export default function Users() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UserData>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const getUsers = () => {
    const controller = new AbortController();
    setStatus("loading");

    userService
      .getAll(page, search)
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
  };

  useEffect(() => {
    getUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    getUsers();
  };

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
              <h3 className="text-base pt-2 font-medium text-gray-800 dark:text-white/90">
                Users
              </h3>
              <div className="hidden lg:block">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                          fill=""
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        e.preventDefault();
                        setSearch(e.target.value);
                      }}
                      placeholder="Search..."
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                    />

                    <button
                      type="submit"
                      className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                    >
                      <span> ⌘ </span>
                      <span> K </span>
                    </button>
                  </div>
                </form>
              </div>
              <Link to="/create-user">
                <Button>
                  <i className="bi bi-person-plus"></i> Add User
                </Button>
              </Link>
            </div>
          </div>

          {/* Card Body */}
          {usersData?.users.data.length !== 0 ? (
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
                              style={{ fontSize: "20px" }}
                              className="mx-1"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </Link>

                          <button
                            style={{ fontSize: "20px" }}
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

              <div className="">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={usersData?.users.totalPages || 0}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={({ selected }) => {
                    setPage(selected + 1);
                    getUsers();
                  }}
                  forcePage={(usersData?.users.page || 0) - 1}
                  containerClassName={"pagination"}
                  renderOnZeroPageCount={null}
                  activeClassName={"active"}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 p-4">
              No users found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
