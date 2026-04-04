import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import "./admin-dashboard.css";

const AdminLayout = () => {
  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <div className="admin-body-section">
        <div className="container">
          <Outlet />
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
