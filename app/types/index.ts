export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'doctor';
}

export interface Pet {
  id: string;
  pid: string;
  name: string;
  species: string;
  breed: string;
  gender: 'Male' | 'Female';
  age: {
    years: number;
    months: number;
    days: number;
    weeks: number;
  };
  dob?: string;
  attitude?: string;
  ownerId: string;
}

export interface Client {
  id: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  nic?: string;
  preferredLanguage: string;
  smsNotifications: boolean;
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