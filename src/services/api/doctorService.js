import doctorsData from "@/services/mockData/doctors.json";

let doctors = [...doctorsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const doctorService = {
  async getAll() {
    await delay(300);
    return [...doctors];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error(`Doctor with ID ${id} not found`);
    }
    return { ...doctor };
  },

  async create(doctorData) {
    await delay(400);
    const maxId = Math.max(...doctors.map(d => d.Id), 0);
    const newDoctor = {
      ...doctorData,
      Id: maxId + 1
    };
    doctors.push(newDoctor);
    return { ...newDoctor };
  },

  async update(id, doctorData) {
    await delay(350);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Doctor with ID ${id} not found`);
    }
    doctors[index] = { ...doctors[index], ...doctorData };
    return { ...doctors[index] };
  },

  async delete(id) {
    await delay(250);
    const index = doctors.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Doctor with ID ${id} not found`);
    }
    const deletedDoctor = doctors.splice(index, 1)[0];
    return { ...deletedDoctor };
  },

  async getByDepartment(departmentId) {
    await delay(200);
    return doctors.filter(doctor => 
      doctor.departmentId === departmentId.toString()
    );
  }
};