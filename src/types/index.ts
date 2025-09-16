export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  date: string;
  mangalaAarti: boolean;
  japaRounds: number;
  lectureDuration: number; // in minutes
  wakeUpTime: string;
  sleepTime: string;
  bhogaOffering: boolean;
  preachingContacts: PreachingContact[];
  createdAt: string;
  updatedAt: string;
}

export interface PreachingContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  addedDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}