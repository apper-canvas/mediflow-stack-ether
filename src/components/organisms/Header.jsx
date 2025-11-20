import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { logout } = useAuth();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Patients", path: "/patients", icon: "Users" },
    { name: "Appointments", path: "/appointments", icon: "Calendar" },
    { name: "Doctors", path: "/doctors", icon: "UserCheck" },
    { name: "Departments", path: "/departments", icon: "Building" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Activity" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">MediFlow</h1>
              <p className="text-xs text-gray-500">Hospital Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-b-2 border-primary-500"
                      : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            
            {/* User Info & Logout */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {user?.emailAddress}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  icon="LogOut"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
{isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700"
                      : "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            
            {/* Mobile User Info & Logout */}
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-sm">
                  <div className="text-gray-900 font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {user?.emailAddress}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  icon="LogOut"
                  className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;