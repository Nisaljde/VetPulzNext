export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'doctor';
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  ownerId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Appointment {
  id: string;
  petId: string;
  clientId: string;
  doctorId: string;
  date: Date;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface QueueItem {
  id: string;
  tokenNumber: number;
  appointmentId: string;
  startTime: Date;
  status: 'waiting' | 'in-progress' | 'completed';
}