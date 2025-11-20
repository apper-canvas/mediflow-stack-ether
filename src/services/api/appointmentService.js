import appointmentsData from "@/services/mockData/appointments.json";

let appointments = [...appointmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return { ...appointment };
  },

  async create(appointmentData) {
    await delay(400);
    const maxId = Math.max(...appointments.map(a => a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString().split("T")[0]
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, appointmentData) {
    await delay(350);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    appointments[index] = { ...appointments[index], ...appointmentData };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    const deletedAppointment = appointments.splice(index, 1)[0];
    return { ...deletedAppointment };
  },

  async getByPatient(patientId) {
    await delay(200);
    return appointments.filter(appointment => 
      appointment.patientId === patientId.toString()
    );
  },

  async getByDoctor(doctorId) {
    await delay(200);
    return appointments.filter(appointment => 
      appointment.doctorId === doctorId.toString()
    );
  },

  async getByDate(date) {
    await delay(200);
    return appointments.filter(appointment => 
      appointment.appointmentDate === date
    );
  }
};