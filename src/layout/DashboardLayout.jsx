import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../components/dashboard.css";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { usuario } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <p className="animate-pulse">Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="main-wrapper flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
