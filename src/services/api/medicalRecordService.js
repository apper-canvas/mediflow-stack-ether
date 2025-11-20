import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const medicalRecordService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('medical_records_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "follow_up_date_c"}},
          {"field": {"Name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "appointment_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Failed to fetch medical records:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching medical records:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('medical_records_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "follow_up_date_c"}},
          {"field": {"Name": "patient_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "doctor_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "appointment_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch medical record:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching medical record ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(recordData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const createData = {
        Name: `Medical Record - ${recordData.visit_date_c}`,
        visit_date_c: recordData.visit_date_c || new Date().toISOString().split("T")[0],
        diagnosis_c: recordData.diagnosis_c,
        follow_up_date_c: recordData.follow_up_date_c,
        patient_id_c: parseInt(recordData.patient_id_c),
        doctor_id_c: parseInt(recordData.doctor_id_c),
        appointment_id_c: recordData.appointment_id_c ? parseInt(recordData.appointment_id_c) : undefined
      };

      // Remove undefined values
      Object.keys(createData).forEach(key => {
        if (createData[key] === undefined) {
          delete createData[key];
        }
      });

      const response = await apperClient.createRecord('medical_records_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error("Failed to create medical record:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating medical record:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, recordData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const updateData = {
        Id: parseInt(id),
        visit_date_c: recordData.visit_date_c,
        diagnosis_c: recordData.diagnosis_c,
        follow_up_date_c: recordData.follow_up_date_c
      };

      // Only include lookup fields if they're being updated
      if (recordData.patient_id_c) {
        updateData.patient_id_c = parseInt(recordData.patient_id_c);
      }
      if (recordData.doctor_id_c) {
        updateData.doctor_id_c = parseInt(recordData.doctor_id_c);
      }
      if (recordData.appointment_id_c) {
        updateData.appointment_id_c = parseInt(recordData.appointment_id_c);
      }

      const response = await apperClient.updateRecord('medical_records_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error("Failed to update medical record:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating medical record:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('medical_records_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete medical record:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} medical records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting medical record:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  async getByPatient(patientId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('medical_records_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "visit_date_c"}},
          {"field": {"Name": "diagnosis_c"}},
          {"field": {"Name": "follow_up_date_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}}
        ],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}]
      });

      if (!response.success) {
        console.error("Failed to fetch patient medical records:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patient medical records:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};