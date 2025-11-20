import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";

const AppointmentForm = ({ isOpen, onClose, appointment, onAppointmentSaved }) => {
const [formData, setFormData] = useState({
    patient_id_c: appointment?.patient_id_c?.Id || appointment?.patient_id_c || "",
    doctor_id_c: appointment?.doctor_id_c?.Id || appointment?.doctor_id_c || "",
    department_id_c: appointment?.department_id_c?.Id || appointment?.department_id_c || "",
    appointment_date_c: appointment?.appointment_date_c || "",
    appointment_time_c: appointment?.appointment_time_c || "",
    reason_for_visit_c: appointment?.reason_for_visit_c || "",
    notes_c: appointment?.notes_c || "",
    status_c: appointment?.status_c || "scheduled"
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const [patientsData, doctorsData, departmentsData] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll(),
          departmentService.getAll()
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setDepartments(departmentsData);
      } catch (err) {
        toast.error("Failed to load form data");
      } finally {
        setDataLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    if (!formData.appointmentDate) newErrors.appointmentDate = "Date is required";
    if (!formData.appointmentTime) newErrors.appointmentTime = "Time is required";
    if (!formData.reasonForVisit.trim()) newErrors.reasonForVisit = "Reason for visit is required";

    // Validate future date
    const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      newErrors.appointmentDate = "Appointment must be scheduled for a future date/time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-select department when doctor is selected
    if (field === "doctorId" && value) {
const selectedDoctor = doctors.find(d => d.Id === parseInt(value));
      if (selectedDoctor) {
        setFormData(prev => ({ ...prev, department_id_c: selectedDoctor.department_id_c?.Id || selectedDoctor.department_id_c }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setLoading(true);

      if (appointment) {
        await appointmentService.update(appointment.Id, formData);
        toast.success("Appointment updated successfully");
      } else {
        await appointmentService.create(formData);
        toast.success("Appointment scheduled successfully");
      }

      if (onAppointmentSaved) {
        onAppointmentSaved();
      }
      onClose();
    } catch (err) {
      toast.error(appointment ? "Failed to update appointment" : "Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? "Edit Appointment" : "Schedule New Appointment"}
      size="lg"
    >
      {dataLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Patient"
              type="select"
              value={formData.patientId}
              onChange={(e) => handleInputChange("patientId", e.target.value)}
              error={errors.patientId}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
<option key={patient.Id} value={patient.Id}>
                  {patient.first_name_c} {patient.last_name_c}
                </option>
              ))}
            </FormField>

            <FormField
              label="Doctor"
              type="select"
              value={formData.doctorId}
              onChange={(e) => handleInputChange("doctorId", e.target.value)}
              error={errors.doctorId}
              required
            >
              <option value="">Select Doctor</option>
{doctors.map(doctor => (
                <option key={doctor.Id} value={doctor.Id}>
                  {doctor.first_name_c} {doctor.last_name_c} - {doctor.specialization_c}
                </option>
              ))}
            </FormField>

            <FormField
              label="Department"
              type="select"
              value={formData.departmentId}
              onChange={(e) => handleInputChange("departmentId", e.target.value)}
              error={errors.departmentId}
              required
            >
              <option value="">Select Department</option>
{departments.map(department => (
                <option key={department.Id} value={department.Id}>
                  {department.Name}
                </option>
              ))}
            </FormField>

            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="in-progress">In Progress</option>
            </FormField>

            <FormField
              label="Date"
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
              error={errors.appointmentDate}
              required
            />

            <FormField
              label="Time"
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
              error={errors.appointmentTime}
              required
            />
          </div>

          <FormField
            label="Reason for Visit"
            type="text"
            value={formData.reasonForVisit}
            onChange={(e) => handleInputChange("reasonForVisit", e.target.value)}
            error={errors.reasonForVisit}
            placeholder="e.g., Routine check-up, Follow-up consultation"
            required
          />

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Additional notes or special instructions"
          />

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={appointment ? "Save" : "Calendar"}
            >
              {appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AppointmentForm;