import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AppointmentTable = ({ onEditAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === parseInt(patientId));
    return patient ? `${patient.first_name_c} ${patient.last_name_c}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id === parseInt(doctorId));
    return doctor ? `${doctor.first_name_c} ${doctor.last_name_c}` : "Unknown Doctor";
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
await appointmentService.update(appointmentId, { status_c: "cancelled" });
      setAppointments(prev => 
        prev.map(apt => 
          apt.Id === appointmentId ? { ...apt, status_c: "cancelled" } : apt
        )
      );
      toast.success("Appointment cancelled successfully");
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
await appointmentService.update(appointmentId, { status_c: "completed" });
      setAppointments(prev => 
        prev.map(apt => 
          apt.Id === appointmentId ? { ...apt, status_c: "completed" } : apt
        )
      );
      toast.success("Appointment marked as completed");
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card>
      <Card.Header>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Appointment Schedule</h2>
          <p className="text-sm text-gray-600 mt-1">Manage patient appointments and consultations</p>
        </div>
      </Card.Header>

      <Card.Content>
        {appointments.length === 0 ? (
          <Empty
            icon="Calendar"
            title="No Appointments Found"
            description="No appointments scheduled yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.Id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-25 hover:to-secondary-25 transition-all duration-200">
<td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {appointment.patient_id_c?.Name || 'Unknown Patient'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {appointment.doctor_id_c?.Name || 'Unknown Doctor'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {appointment.appointment_date_c ? format(new Date(appointment.appointment_date_c), "MMM dd, yyyy") : 'N/A'}
                        </div>
                        <div className="text-gray-500">{appointment.appointment_time_c}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700 max-w-48 truncate">
                        {appointment.reason_for_visit_c}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={appointment.status_c}>{appointment.status_c}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
{appointment.status_c === "scheduled" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteAppointment(appointment.Id)}
                              title="Mark as Completed"
                              className="text-green-600 hover:bg-green-50"
                            >
                              <ApperIcon name="CheckCircle" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditAppointment && onEditAppointment(appointment)}
                              title="Edit Appointment"
                            >
                              <ApperIcon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.Id)}
                              title="Cancel Appointment"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <ApperIcon name="X" size={16} />
                            </Button>
                          </>
                        )}
{appointment.status_c !== "scheduled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditAppointment && onEditAppointment(appointment)}
                            title="View Details"
                          >
                            <ApperIcon name="Eye" size={16} />
                          </Button>
                        )}
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

export default AppointmentTable;