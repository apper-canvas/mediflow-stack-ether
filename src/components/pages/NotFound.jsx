import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-4">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="FileQuestion" size={64} className="text-primary-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-bold gradient-text">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
            icon="Home"
          >
            Back to Dashboard
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;