import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const appointmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('appointments_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "appointment_date_c"}},
          {"field": {"Name": "appointment_time_c"}},
          {"field": {"Name": "reason_for_visit_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Failed to fetch appointments:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('appointments_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "appointment_date_c"}},
          {"field": {"Name": "appointment_time_c"}},
          {"field": {"Name": "reason_for_visit_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch appointment:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(appointmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const createData = {
        Name: `Appointment - ${appointmentData.appointment_date_c}`,
        appointment_date_c: appointmentData.appointment_date_c,
        appointment_time_c: appointmentData.appointment_time_c,
        reason_for_visit_c: appointmentData.reason_for_visit_c,
        notes_c: appointmentData.notes_c,
        status_c: appointmentData.status_c || "scheduled",
        created_at_c: new Date().toISOString(),
        patient_id_c: parseInt(appointmentData.patient_id_c),
        doctor_id_c: parseInt(appointmentData.doctor_id_c),
        department_id_c: parseInt(appointmentData.department_id_c)
      };

      const response = await apperClient.createRecord('appointments_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error("Failed to create appointment:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, appointmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const updateData = {
        Id: parseInt(id),
        appointment_date_c: appointmentData.appointment_date_c,
        appointment_time_c: appointmentData.appointment_time_c,
        reason_for_visit_c: appointmentData.reason_for_visit_c,
        notes_c: appointmentData.notes_c,
        status_c: appointmentData.status_c
      };

      // Only include lookup fields if they're being updated
      if (appointmentData.patient_id_c) {
        updateData.patient_id_c = parseInt(appointmentData.patient_id_c);
      }
      if (appointmentData.doctor_id_c) {
        updateData.doctor_id_c = parseInt(appointmentData.doctor_id_c);
      }
      if (appointmentData.department_id_c) {
        updateData.department_id_c = parseInt(appointmentData.department_id_c);
      }

      const response = await apperClient.updateRecord('appointments_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error("Failed to update appointment:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('appointments_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete appointment:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  async getByPatient(patientId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('appointments_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "appointment_date_c"}},
          {"field": {"Name": "appointment_time_c"}},
          {"field": {"Name": "reason_for_visit_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}]
      });

      if (!response.success) {
        console.error("Failed to fetch patient appointments:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patient appointments:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByDoctor(doctorId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('appointments_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "appointment_date_c"}},
          {"field": {"Name": "appointment_time_c"}},
          {"field": {"Name": "reason_for_visit_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [{"FieldName": "doctor_id_c", "Operator": "EqualTo", "Values": [parseInt(doctorId)]}]
      });

      if (!response.success) {
        console.error("Failed to fetch doctor appointments:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching doctor appointments:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('appointments_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "appointment_date_c"}},
          {"field": {"Name": "appointment_time_c"}},
          {"field": {"Name": "reason_for_visit_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [{"FieldName": "appointment_date_c", "Operator": "EqualTo", "Values": [date]}]
      });

      if (!response.success) {
        console.error("Failed to fetch appointments by date:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by date:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};