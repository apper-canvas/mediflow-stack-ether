import departmentsData from "@/services/mockData/departments.json";

let departments = [...departmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departments];
  },

  async getById(id) {
    await delay(200);
    const department = departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departments.map(d => d.Id), 0);
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1
    };
    departments.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(350);
    const index = departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    departments[index] = { ...departments[index], ...departmentData };
    return { ...departments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    const deletedDepartment = departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
};