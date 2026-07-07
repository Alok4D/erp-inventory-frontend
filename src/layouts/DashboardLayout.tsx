import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import { io } from "socket.io-client";
import { useAppDispatch } from "../redux/hooks";
import { baseApi } from "../redux/api/baseApi";

export default function DashboardLayout() {
 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1280;
    }
    return false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, message: string, time: string, read: boolean}[]>([]);
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Socket.io integration for real-time sale notifications
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"); // Ensure this matches your backend URL

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("new_sale", (data) => {
      const msg = data.message || "New sale created!";
      
      // Add to notifications dropdown
      setNotifications(prev => [
        { id: Date.now(), message: msg, time: new Date().toISOString(), read: false },
        ...prev
      ]);
      
      // Automatically refresh Dashboard, Sales, and Products by invalidating RTK Query tags
      dispatch(baseApi.util.invalidateTags(["Sales", "Dashboard", "Products"]));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Handle window resize for auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          toggleMobileSidebar={() => setIsMobileOpen(true)}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
