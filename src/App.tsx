import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Users from "./pages/Users/Users";
import CreateUser from "./pages/Users/CreateUser";
import Roles from "./pages/Roles/Roles";
// @ts-ignore
import { AuthProvider } from "./context/AuthContext";
// @ts-ignore
import PrivateRoute from "./components/PrivateRoute";
import EditUser from "./pages/Users/EditUser";
import CreateRole from "./pages/Roles/CreateRole";
import EditRole from "./pages/Roles/EditRole";
import Suppliers from "./pages/Suppliers/Suppliers";
import CreateSupplier from "./pages/Suppliers/CreateSupplier";
import EditSupplier from "./pages/Suppliers/EditSupplier";
import Warehouses from "./pages/Warehouses/Warehouses";
import CreateWarehouse from "./pages/Warehouses/CreateWarehouse";
import EditWarehouse from "./pages/Warehouses/EditWarehouse";
import PurchaseOrders from "./pages/PurchaseOrder/PurchaseOrders";
import CreatePurchaseOrder from "./pages/PurchaseOrder/CreatePurchaseOrder";
import EditPurchaseOrder from "./pages/PurchaseOrder/EditPurchaseOrder";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Default: go to sign in */}
            <Route index path="/" element={<SignIn />} />

            {/* Auth pages — public */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Dashboard Layout — all protected, login required */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/update-user/:id" element={<EditUser />} />
              <Route path="/create-role" element={<CreateRole />} />
              <Route path="/update-role/:id" element={<EditRole />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/create-supplier" element={<CreateSupplier />} />
              <Route path="/update-supplier/:id" element={<EditSupplier />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/create-warehouse" element={<CreateWarehouse />} />
              <Route path="/update-warehouse/:id" element={<EditWarehouse />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route
                path="/create-purchase-order"
                element={<CreatePurchaseOrder />}
              />
              <Route
                path="/update-purchase-order/:id"
                element={<EditPurchaseOrder />}
              />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
