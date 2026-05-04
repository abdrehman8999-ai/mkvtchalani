/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'student';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
}

export interface StudentRecord {
  id: string;
  userId: string;
  name: string;
  fatherName: string;
  course: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: any;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
  markedBy: string;
  timestamp: any;
}

export interface CourseApplication {
  id: string;
  name: string;
  fatherName: string;
  course: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}
