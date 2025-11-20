import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const PatientTable = ({ onEditPatient, onViewPatient }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient => 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactNumber.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      await patientService.delete(patientId);
      setPatients(prev => prev.filter(p => p.Id !== patientId));
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Patient Registry</h2>
            <p className="text-sm text-gray-600 mt-1">Manage patient information and records</p>
          </div>
          <SearchBar
            placeholder="Search patients..."
            onSearch={setSearchTerm}
            className="w-full sm:w-80"
          />
        </div>
      </Card.Header>

      <Card.Content>
        {filteredPatients.length === 0 ? (
          <Empty
            icon="Users"
            title="No Patients Found"
            description={searchTerm ? "No patients match your search criteria." : "No patients registered yet."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Blood Group</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Registered</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.Id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-25 hover:to-secondary-25 transition-all duration-200">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.gender} • {format(new Date(patient.dateOfBirth), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{patient.contactNumber}</div>
                        <div className="text-gray-500">{patient.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="primary">{patient.bloodGroup}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={patient.status}>{patient.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {format(new Date(patient.registrationDate), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewPatient && onViewPatient(patient)}
                          title="View Details"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPatient && onEditPatient(patient)}
                          title="Edit Patient"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.Id)}
                          title="Delete Patient"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default PatientTable;