import React, { useState } from "react";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";
import Select from "@/components/atoms/Select";
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
    description_c: patient?.description_c || "",
    status_c: patient?.status_c || "active"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

const validate = () => {
    const newErrors = {};

    if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
    if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
    if (!formData.date_of_birth_c) newErrors.date_of_birth_c = "Date of birth is required";
    if (!formData.contact_number_c.trim()) newErrors.contact_number_c = "Contact number is required";
    if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
    if (!formData.address_c.trim()) newErrors.address_c = "Address is required";
    if (!formData.blood_group_c) newErrors.blood_group_c = "Blood group is required";
    if (!formData.emergency_contact_c.trim()) newErrors.emergency_contact_c = "Emergency contact is required";

    // Email validation
    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
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
            value={formData.first_name_c}
            onChange={(e) => handleInputChange("first_name_c", e.target.value)}
            error={errors.first_name_c}
            required
          />

          <FormField
            label="Last Name"
            type="text"
            value={formData.last_name_c}
            onChange={(e) => handleInputChange("last_name_c", e.target.value)}
            error={errors.last_name_c}
            required
          />

          <FormField
            label="Date of Birth"
            type="date"
            value={formData.date_of_birth_c}
            onChange={(e) => handleInputChange("date_of_birth_c", e.target.value)}
            error={errors.date_of_birth_c}
            required
          />

          <FormField
            label="Contact Number"
            type="tel"
            value={formData.contact_number_c}
            onChange={(e) => handleInputChange("contact_number_c", e.target.value)}
            error={errors.contact_number_c}
            required
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email_c}
            onChange={(e) => handleInputChange("email_c", e.target.value)}
            error={errors.email_c}
            required
          />

          <FormField
            label="Blood Group"
            type="select"
            value={formData.blood_group_c}
            onChange={(e) => handleInputChange("blood_group_c", e.target.value)}
            error={errors.blood_group_c}
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
            value={formData.status_c}
            onChange={(e) => handleInputChange("status_c", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="discharged">Discharged</option>
            <option value="admitted">Admitted</option>
          </FormField>
        </div>

        <FormField
          label="Address"
          type="textarea"
          value={formData.address_c}
          onChange={(e) => handleInputChange("address_c", e.target.value)}
          error={errors.address_c}
          required
        />

        <FormField
          label="Allergies (comma-separated)"
          type="text"
          value={formData.allergies_c}
          onChange={(e) => handleInputChange("allergies_c", e.target.value)}
          placeholder="e.g., Penicillin, Shellfish, Latex"
        />

        <FormField
          label="Medical History"
          type="textarea"
          value={formData.medical_history_c}
          onChange={(e) => handleInputChange("medical_history_c", e.target.value)}
        />
        
        <FormField
          label="Description"
          type="textarea"
          value={formData.description_c}
          onChange={(e) => handleInputChange("description_c", e.target.value)}
          error={errors.description_c}
          placeholder="Additional patient information or notes..."
          rows={4}
        />

        <FormField
          label="Emergency Contact"
          type="text"
          value={formData.emergency_contact_c}
          onChange={(e) => handleInputChange("emergency_contact_c", e.target.value)}
          error={errors.emergency_contact_c}
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