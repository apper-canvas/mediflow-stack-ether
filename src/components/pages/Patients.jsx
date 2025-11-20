import { useState } from "react";
import Button from "@/components/atoms/Button";
import PatientTable from "@/components/organisms/PatientTable";
import PatientForm from "@/components/organisms/PatientForm";

const Patients = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPatient(null);
  };

  const handlePatientSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 gradient-text">Patient Management</h1>
          <p className="text-gray-600 mt-2">Register and manage patient information</p>
        </div>
        <Button
          onClick={handleAddPatient}
          icon="UserPlus"
          className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
        >
          Add New Patient
        </Button>
      </div>

      <PatientTable
        key={refreshTrigger}
        onEditPatient={handleEditPatient}
        onViewPatient={handleViewPatient}
      />

      <PatientForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        patient={selectedPatient}
        onPatientSaved={handlePatientSaved}
      />
    </div>
  );
};

export default Patients;