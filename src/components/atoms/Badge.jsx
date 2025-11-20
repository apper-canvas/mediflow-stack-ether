import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    active: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    scheduled: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    completed: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    cancelled: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    "in-progress": "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    discharged: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600",
    admitted: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;