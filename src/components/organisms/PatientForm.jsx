import { useState } from "react";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";

const PatientForm = ({ isOpen, onClose, patient, onPatientSaved }) => {
const [formData, setFormData] = useState({
    first_name_c: patient?.first_name_c || "",
    last_name_c: patient?.last_name_c || "",
    date_of_birth_c: patient?.date_of_birth_c || "",
    contact_number_c: patient?.contact_number_c || "",
    email_c: patient?.email_c || "",
    address_c: patient?.address_c || "",
    blood_group_c: patient?.blood_group_c || "",
    allergies_c: patient?.allergies_c || "",
    medical_history_c: patient?.medical_history_c || "",
    emergency_contact_c: patient?.emergency_contact_c || "",
    status_c: patient?.status_c || "active"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      
const patientData = {
        ...formData
      };

      if (patient) {
        await patientService.update(patient.Id, patientData);
        toast.success("Patient updated successfully");
      } else {
        await patientService.create(patientData);
        toast.success("Patient registered successfully");
      }

      if (onPatientSaved) {
        onPatientSaved();
      }
      onClose();
    } catch (err) {
      toast.error(patient ? "Failed to update patient" : "Failed to register patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? "Edit Patient" : "Register New Patient"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={errors.firstName}
            required
          />

          <FormField
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={errors.lastName}
            required
          />

          <FormField
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            error={errors.dateOfBirth}
            required
          />


          <FormField
            label="Contact Number"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            error={errors.contactNumber}
            required
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            required
          />

          <FormField
            label="Blood Group"
            type="select"
            value={formData.bloodGroup}
            onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
            error={errors.bloodGroup}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </FormField>

          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="discharged">Discharged</option>
            <option value="admitted">Admitted</option>
          </FormField>
        </div>

        <FormField
          label="Address"
          type="textarea"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={errors.address}
          required
        />

        <FormField
          label="Allergies (comma-separated)"
          type="text"
          value={formData.allergies}
          onChange={(e) => handleInputChange("allergies", e.target.value)}
          placeholder="e.g., Penicillin, Shellfish, Latex"
        />

        <FormField
          label="Medical History"
          type="textarea"
          value={formData.medicalHistory}
          onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
        />

        <FormField
          label="Emergency Contact"
          type="text"
          value={formData.emergencyContact}
          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
          error={errors.emergencyContact}
          placeholder="e.g., +1-555-0124 (John Doe - Relation)"
          required
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
            icon={patient ? "Save" : "UserPlus"}
          >
            {patient ? "Update Patient" : "Register Patient"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientForm;