import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button/Button";

export default function Users() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);
  let [headers, setHeaders] = useState<string[]>([]);

  const button = <Button size="sm"> Add User </Button>;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BASE_URL}/users`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        console.log(data.users.data);
        setData(data.users.data);
        setHeaders(Object.keys(data.users.data[0]).slice(0, 5));
        console.log(headers);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Users List" />
      <div className="space-y-6">
        <ComponentCard title="Users" button={button}>
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
