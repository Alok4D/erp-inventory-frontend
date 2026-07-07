import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Hexagon, X } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const user = useAppSelector((state) => state.auth.user);
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ['admin', 'manager'] },
    { name: "Products", href: "/products", icon: Package, roles: ['admin', 'manager', 'employee'] },
    { name: "Sales", href: "/sales", icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
  ].filter(item => item.roles.includes(user?.role || ''));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out",
        "md:relative md:translate-x-0 shrink-0",
        isMobileOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full",
        !isMobileOpen && isCollapsed ? "md:w-20" : "md:w-64"
      )}>
        <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4 overflow-hidden shrink-0">
          <div className="flex items-center justify-center gap-2 mx-auto md:mx-0">
            <Hexagon className="w-8 h-8 text-indigo-500 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <h1 className="text-xl font-bold tracking-wider whitespace-nowrap">Mini ERP</h1>}
          </div>
          
          {/* Mobile close button */}
          <button 
            className="md:hidden p-1 rounded-md text-gray-400 hover:bg-gray-800"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={(!isMobileOpen && isCollapsed) ? item.name : undefined}
                className={clsx(
                  "flex items-center rounded-lg transition-colors",
                  (!isMobileOpen && isCollapsed) ? "justify-center p-3" : "px-4 py-3",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="ml-3 truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
        
        <div className="p-3 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            title={(!isMobileOpen && isCollapsed) ? "Logout" : undefined}
            className={clsx(
              "flex items-center text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors w-full",
              (!isMobileOpen && isCollapsed) ? "justify-center p-3" : "px-4 py-3"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3 truncate">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
