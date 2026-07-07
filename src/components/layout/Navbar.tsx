import { useAppSelector } from "@/redux/hooks";
import { User, Menu } from "lucide-react";

interface NavbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export function Navbar({ isCollapsed, toggleSidebar, toggleMobileSidebar }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Desktop collapse button */}
        <button 
          onClick={toggleSidebar}
          className="hidden md:block p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-2">
          
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Welcome to Mini ERP
            </h2>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900 leading-none">
              {user?.name || "Loading..."}
            </span>
            <span className="text-xs text-gray-500 capitalize mt-1 leading-none">
              {user?.role || "User"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
