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
import PurchaseOrderHistory from "./pages/PurchaseOrderHistory/PurchaseOrderHistory";
import UploadModems from "./pages/Modems/UploadModems";

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
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    {" "}
                    <Home />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    {" "}
                    <Users />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <PrivateRoute>
                    {" "}
                    <Roles />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-user"
                element={
                  <PrivateRoute>
                    {" "}
                    <CreateUser />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-user/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditUser />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-role"
                element={
                  <PrivateRoute>
                    {" "}
                    <CreateRole />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-role/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditRole />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <PrivateRoute>
                    {" "}
                    <Suppliers />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-supplier"
                element={
                  <PrivateRoute>
                    {" "}
                    <CreateSupplier />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-supplier/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditSupplier />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/warehouses"
                element={
                  <PrivateRoute>
                    {" "}
                    <Warehouses />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-warehouse"
                element={
                  <PrivateRoute>
                    {" "}
                    <CreateWarehouse />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-warehouse/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditWarehouse />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-orders"
                element={
                  <PrivateRoute>
                    {" "}
                    <PurchaseOrders />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-purchase-order"
                element={
                  <PrivateRoute>
                    {" "}
                    <CreatePurchaseOrder />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-purchase-order/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditPurchaseOrder />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/purchase-order-history/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <PurchaseOrderHistory />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload-modems/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <UploadModems />{" "}
                  </PrivateRoute>
                }
              />
              {/* Others Page */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    {" "}
                    <UserProfiles />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    {" "}
                    <Calendar />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/blank"
                element={
                  <PrivateRoute>
                    {" "}
                    <Blank />{" "}
                  </PrivateRoute>
                }
              />

              {/* Forms */}
              <Route
                path="/form-elements"
                element={
                  <PrivateRoute>
                    {" "}
                    <FormElements />{" "}
                  </PrivateRoute>
                }
              />

              {/* Tables */}
              <Route
                path="/basic-tables"
                element={
                  <PrivateRoute>
                    {" "}
                    <BasicTables />{" "}
                  </PrivateRoute>
                }
              />

              {/* Ui Elements */}
              <Route
                path="/alerts"
                element={
                  <PrivateRoute>
                    {" "}
                    <Alerts />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/avatars"
                element={
                  <PrivateRoute>
                    {" "}
                    <Avatars />{" "}
                  </PrivateRoute>
                }
              />
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
