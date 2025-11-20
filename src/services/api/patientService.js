import patientsData from "@/services/mockData/patients.json";

let patients = [...patientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const maxId = Math.max(...patients.map(p => p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      registrationDate: new Date().toISOString().split("T")[0]
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(350);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    patients[index] = { ...patients[index], ...patientData };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(250);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    const deletedPatient = patients.splice(index, 1)[0];
    return { ...deletedPatient };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return patients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchTerm) ||
      patient.lastName.toLowerCase().includes(searchTerm) ||
      patient.contactNumber.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm)
    );
  }
};