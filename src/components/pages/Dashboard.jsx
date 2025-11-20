import { useState, useEffect } from "react";
import { patientService } from "@/services/api/patientService";
import { appointmentService } from "@/services/api/appointmentService";
import { departmentService } from "@/services/api/departmentService";
import { doctorService } from "@/services/api/doctorService";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday } from "date-fns";

const Dashboard = () => {
const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    totalDoctors: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientsData, appointmentsData, doctorsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        doctorService.getAll(),
        departmentService.getAll()
      ]);

      // Calculate stats with database field names
      const activePatients = patientsData.filter(p => p.status_c === "active").length;
      const todayAppointmentsCount = appointmentsData.filter(apt => 
        isToday(new Date(apt.appointment_date_c))
      ).length;

      setStats({
        totalPatients: patientsData.length,
        activePatients,
        todayAppointments: todayAppointmentsCount,
        totalDoctors: doctorsData.length
      });

      // Get today's appointments with database field names
      const todayApts = appointmentsData.filter(apt => 
        isToday(new Date(apt.appointment_date_c))
      );
      setTodayAppointments(todayApts);

      // Get recent patients (last 5 registered) with database field names
      const recent = patientsData
        .filter(p => p.registration_date_c)
        .sort((a, b) => new Date(b.registration_date_c) - new Date(a.registration_date_c))
        .slice(0, 5);
      setRecentPatients(recent);

      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 gradient-text">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to MediFlow Hospital Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Active Patients"
          value={stats.activePatients}
          icon="UserCheck"
          iconColor="text-accent-600"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          iconColor="text-secondary-600"
        />
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon="Stethoscope"
          iconColor="text-primary-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" className="mr-2 text-primary-600" size={24} />
              Today's Appointments
            </h2>
          </Card.Header>
          <Card.Content>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
{todayAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-25 to-secondary-25 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        Patient: {appointment.patient_id_c?.Name || 'Unknown Patient'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.appointment_time_c} - {appointment.reason_for_visit_c}
                      </div>
                    </div>
                    <Badge variant={appointment.status_c}>{appointment.status_c}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Recent Patients */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="UserPlus" className="mr-2 text-accent-600" size={24} />
              Recent Registrations
            </h2>
          </Card.Header>
          <Card.Content>
            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Users" className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No recent patient registrations</p>
              </div>
            ) : (
              <div className="space-y-4">
{recentPatients.map((patient) => (
                  <div key={patient.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-25 to-primary-25 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {patient.first_name_c} {patient.last_name_c}
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.blood_group_c} • {format(new Date(patient.registration_date_c), "MMM dd, yyyy")}
                      </div>
                    </div>
                    <Badge variant={patient.status_c}>{patient.status_c}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Departments Overview */}
      <div className="mt-8">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Building" className="mr-2 text-secondary-600" size={24} />
              Department Overview
            </h2>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{departments.slice(0, 4).map((department) => (
                <div key={department.Id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">{department.Name}</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Active Patients: <span className="font-semibold text-primary-600">{department.active_patients_c || 0}</span></div>
                    <div>Total Staff: <span className="font-medium">{department.total_staff_c || 0}</span></div>
                    <div className="text-xs text-gray-500">{department.location_c}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;