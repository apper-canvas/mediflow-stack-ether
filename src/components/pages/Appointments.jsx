import { useState } from "react";
import Button from "@/components/atoms/Button";
import AppointmentTable from "@/components/organisms/AppointmentTable";
import AppointmentForm from "@/components/organisms/AppointmentForm";

const Appointments = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleScheduleAppointment = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Appointment Management</h1>
          <p className="text-gray-600 mt-2">Schedule and manage patient appointments</p>
        </div>
        <Button
          onClick={handleScheduleAppointment}
          icon="Calendar"
          className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700"
        >
          Schedule Appointment
        </Button>
      </div>

      <AppointmentTable
        key={refreshTrigger}
        onEditAppointment={handleEditAppointment}
      />

      <AppointmentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        appointment={selectedAppointment}
        onAppointmentSaved={handleAppointmentSaved}
      />
    </div>
  );
};

export default Appointments;