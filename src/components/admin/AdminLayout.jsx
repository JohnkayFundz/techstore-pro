import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

import "./AdminLayout.css";


function AdminLayout() {

  return (

    <div className="admin-layout">


      {/* Admin Sidebar */}
      <aside
        className="admin-sidebar"
        aria-label="Admin navigation"
      >

        <Sidebar />

      </aside>



      {/* Admin Main Area */}
      <div className="admin-main">


        {/* Top Header */}
        <AdminHeader />



        {/* Dashboard Pages */}
        <main className="admin-content">

          <Outlet />

        </main>


      </div>


    </div>

  );
}


export default AdminLayout;