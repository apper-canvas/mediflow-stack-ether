import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor = "text-primary-600",
  trend,
  trendValue,
  className 
}) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 gradient-text">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={trend === "up" ? "text-green-500" : "text-red-500"} 
              />
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg`}>
          <ApperIcon name={icon} size={24} className={iconColor} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;