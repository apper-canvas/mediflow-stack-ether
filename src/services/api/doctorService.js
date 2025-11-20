import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const doctorService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('doctors_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "available_days_c"}},
          {"field": {"Name": "available_hours_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Failed to fetch doctors:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching doctors:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('doctors_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "contact_number_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "available_days_c"}},
          {"field": {"Name": "available_hours_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "department_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch doctor:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(doctorData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const createData = {
        Name: `${doctorData.first_name_c} ${doctorData.last_name_c}`,
        first_name_c: doctorData.first_name_c,
        last_name_c: doctorData.last_name_c,
        specialization_c: doctorData.specialization_c,
        contact_number_c: doctorData.contact_number_c,
        email_c: doctorData.email_c,
        available_days_c: doctorData.available_days_c,
        available_hours_c: doctorData.available_hours_c,
        status_c: doctorData.status_c || "active",
        department_id_c: parseInt(doctorData.department_id_c)
      };

      const response = await apperClient.createRecord('doctors_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error("Failed to create doctor:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating doctor:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, doctorData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields and ensure lookup fields are integers
      const updateData = {
        Id: parseInt(id),
        Name: `${doctorData.first_name_c} ${doctorData.last_name_c}`,
        first_name_c: doctorData.first_name_c,
        last_name_c: doctorData.last_name_c,
        specialization_c: doctorData.specialization_c,
        contact_number_c: doctorData.contact_number_c,
        email_c: doctorData.email_c,
        available_days_c: doctorData.available_days_c,
        available_hours_c: doctorData.available_hours_c,
        status_c: doctorData.status_c,
        department_id_c: parseInt(doctorData.department_id_c)
      };

      const response = await apperClient.updateRecord('doctors_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error("Failed to update doctor:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating doctor:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('doctors_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete doctor:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} doctors:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting doctor:", error?.response?.data?.message || error.message);
      return false;
    }
  },

  async getByDepartment(departmentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('doctors_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "department_id_c"}}
        ],
        where: [{"FieldName": "department_id_c", "Operator": "EqualTo", "Values": [parseInt(departmentId)]}]
      });

      if (!response.success) {
        console.error("Failed to fetch doctors by department:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching doctors by department:", error?.response?.data?.message || error.message);
      return [];
    }
}
};