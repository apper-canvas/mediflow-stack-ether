import { useState, useEffect } from "react";
import { departmentService } from "@/services/api/departmentService";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const DepartmentGrid = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

const getDepartmentIcon = (name) => {
    const iconMap = {
      "Internal Medicine": "Stethoscope",
      "Family Medicine": "Users",
      "Endocrinology": "Activity",
      "Cardiology": "Heart",
      "Pulmonology": "Wind",
      "General Surgery": "Zap",
      "Dentistry": "Smile",
      "Ophthalmology": "Eye"
    };
    return iconMap[name] || "Building";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  if (departments.length === 0) {
    return (
      <Empty
        icon="Building"
        title="No Departments Found"
        description="No departments are currently set up in the system."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {departments.map((department) => (
        <Card key={department.Id} className="hover:card-shadow-hover transition-all duration-300">
          <Card.Content className="p-6">
            <div className="flex items-center space-x-4 mb-4">
<div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                <ApperIcon 
                  name={getDepartmentIcon(department.Name)} 
                  size={32} 
                  className="text-primary-600" 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {department.Name}
                </h3>
                <p className="text-sm text-gray-600">{department.location_c}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {department.description_c}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Head of Department:</span>
                <span className="font-medium text-gray-900">{department.head_of_department_c}</span>
              </div>
              
<div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Patients:</span>
                <span className="font-bold text-primary-600">{department.active_patients_c || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Staff:</span>
                <span className="font-medium text-gray-900">{department.total_staff_c || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Extension:</span>
                <span className="font-medium text-gray-900">{department.contact_extension_c}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
<div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((department.active_patients_c || 0) / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Patient Load: {department.active_patients_c || 0} patients
              </p>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export default DepartmentGrid;