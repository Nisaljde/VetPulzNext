import { User } from '@/app/types';

// This is a mock authentication for testing purposes
// In a real application, this would be replaced with a proper auth system
export const testUsers: User[] = [
  {
    id: '1',
    email: 'admin@vetcare.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'doctor@vetcare.com',
    name: 'Doctor Smith',
    role: 'doctor'
  },
  {
    id: '3',
    email: 'staff@vetcare.com',
    name: 'Staff Member',
    role: 'staff'
  }
];

export const authenticateUser = (email: string, password: string): User | null => {
  // For testing purposes, accept any password with test emails
  const user = testUsers.find(u => u.email === email);
  return user || null;
};