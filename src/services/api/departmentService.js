import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const departmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('departments_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "active_patients_c"}},
          {"field": {"Name": "total_staff_c"}},
          {"field": {"Name": "contact_extension_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Failed to fetch departments:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('departments_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "head_of_department_c"}},
          {"field": {"Name": "active_patients_c"}},
          {"field": {"Name": "total_staff_c"}},
          {"field": {"Name": "contact_extension_c"}}
        ]
      });

      if (!response.success) {
        console.error("Failed to fetch department:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields
      const createData = {
        Name: departmentData.Name,
        description_c: departmentData.description_c,
        location_c: departmentData.location_c,
        head_of_department_c: departmentData.head_of_department_c,
        active_patients_c: departmentData.active_patients_c || 0,
        total_staff_c: departmentData.total_staff_c || 0,
        contact_extension_c: departmentData.contact_extension_c
      };

      const response = await apperClient.createRecord('departments_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error("Failed to create department:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter only updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: departmentData.Name,
        description_c: departmentData.description_c,
        location_c: departmentData.location_c,
        head_of_department_c: departmentData.head_of_department_c,
        active_patients_c: departmentData.active_patients_c,
        total_staff_c: departmentData.total_staff_c,
        contact_extension_c: departmentData.contact_extension_c
      };

      const response = await apperClient.updateRecord('departments_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error("Failed to update department:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('departments_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete department:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error.message);
      return false;
    }
}
};