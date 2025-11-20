import { useState, useEffect } from "react";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const DoctorGrid = ({ onEditDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [doctorsData, departmentsData] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.Id === parseInt(departmentId));
    return department ? department.Name : "Unknown Department";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "success";
      case "busy": return "warning";
      case "off-duty": return "danger";
      default: return "default";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (doctors.length === 0) {
    return (
      <Empty
        icon="UserCheck"
        title="No Doctors Found"
        description="No doctors are currently registered in the system."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.Id} className="hover:card-shadow-hover transition-all duration-300">
          <Card.Content className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-primary-600" />
                </div>
<div>
                  <h3 className="font-semibold text-gray-900">
                    {doctor.first_name_c} {doctor.last_name_c}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor.specialization_c}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(doctor.status_c)}>
                {doctor.status_c}
              </Badge>
            </div>

            <div className="space-y-3">
<div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Building" size={16} />
                <span>{doctor.department_id_c?.Name || "Unknown Department"}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Phone" size={16} />
                <span>{doctor.contact_number_c}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Mail" size={16} />
                <span className="truncate">{doctor.email_c}</span>
              </div>
              
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <ApperIcon name="Calendar" size={16} className="mt-0.5" />
                <div>
                  <div>{doctor.available_days_c ? doctor.available_days_c.split(',').join(', ') : 'N/A'}</div>
                  <div className="text-xs text-gray-500">{doctor.available_hours_c}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditDoctor && onEditDoctor(doctor)}
                className="w-full"
                icon="Edit"
              >
                Edit Doctor
              </Button>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};

export default DoctorGrid;