import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Database", 
  title = "No Data Found", 
  description = "There's nothing here yet.", 
  actionText = "Get Started",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={48} className="text-primary-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 gradient-text">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ApperIcon name="Plus" size={18} className="inline mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;