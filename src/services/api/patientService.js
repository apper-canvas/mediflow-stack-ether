import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const patientService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('patients_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registration_date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Failed to fetch patients:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('patients_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "medical_history_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registration_date_c"}}
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch patient:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(patientData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields
      const createData = {
        Name: `${patientData.first_name_c} ${patientData.last_name_c}`,
        first_name_c: patientData.first_name_c,
        last_name_c: patientData.last_name_c,
        date_of_birth_c: patientData.date_of_birth_c,
        contact_number_c: patientData.contact_number_c,
        email_c: patientData.email_c,
        address_c: patientData.address_c,
        blood_group_c: patientData.blood_group_c,
        allergies_c: patientData.allergies_c,
        medical_history_c: patientData.medical_history_c,
        emergency_contact_c: patientData.emergency_contact_c,
        status_c: patientData.status_c || "active",
        registration_date_c: new Date().toISOString().split("T")[0]
      };

      const response = await apperClient.createRecord('patients_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error("Failed to create patient:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, patientData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: `${patientData.first_name_c} ${patientData.last_name_c}`,
        first_name_c: patientData.first_name_c,
        last_name_c: patientData.last_name_c,
        date_of_birth_c: patientData.date_of_birth_c,
        contact_number_c: patientData.contact_number_c,
        email_c: patientData.email_c,
        address_c: patientData.address_c,
        blood_group_c: patientData.blood_group_c,
        allergies_c: patientData.allergies_c,
        medical_history_c: patientData.medical_history_c,
        emergency_contact_c: patientData.emergency_contact_c,
        status_c: patientData.status_c
      };

      const response = await apperClient.updateRecord('patients_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error("Failed to update patient:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('patients_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete patient:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('patients_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "email_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "first_name_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
            {"conditions": [{"fieldName": "last_name_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
            {"conditions": [{"fieldName": "contact_number_c", "operator": "Contains", "values": [query]}], "operator": "OR"},
            {"conditions": [{"fieldName": "email_c", "operator": "Contains", "values": [query]}], "operator": "OR"}
          ]
        }]
      });

      if (!response.success) {
        console.error("Failed to search patients:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};