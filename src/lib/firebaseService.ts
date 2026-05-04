/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './errorHandler';
import { UserProfile, StudentRecord, AttendanceRecord, CourseApplication } from '../types';

export const firebaseService = {
  // Profiles
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!auth.currentUser) return null;
    const path = `users/${auth.currentUser.uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
      return snap.exists() ? { id: snap.id, ...snap.data() } as UserProfile : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(name: string, email: string): Promise<void> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const path = `users/${auth.currentUser.uid}`;
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        email,
        name,
        role: 'student', // Default
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  // Admins
  async isUserAdmin(uid: string): Promise<boolean> {
    const path = `admins/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'admins', uid));
      return snap.exists();
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return false;
    }
  },

  // Applications
  async submitApplication(data: Omit<CourseApplication, 'id' | 'status' | 'createdAt'>): Promise<void> {
    const appId = Math.random().toString(36).substr(2, 9);
    const path = `applications/${appId}`;
    try {
      await setDoc(doc(db, 'applications', appId), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async getAllApplications(): Promise<CourseApplication[]> {
    const path = 'applications';
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseApplication));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const path = `applications/${id}`;
    try {
      await setDoc(doc(db, 'applications', id), { status }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  },

  // Students
  async enrollStudent(application: CourseApplication, userId: string): Promise<void> {
    const studentId = userId; // Use same ID or auto-gen
    const path = `students/${studentId}`;
    try {
      await setDoc(doc(db, 'students', studentId), {
        userId,
        name: application.name,
        fatherName: application.fatherName,
        course: application.course,
        phone: application.phone,
        address: application.address,
        isActive: true,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async getStudentByUserId(uid: string): Promise<StudentRecord | null> {
    const path = 'students';
    try {
      const q = query(collection(db, 'students'), where('userId', '==', uid));
      const snap = await getDocs(q);
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as StudentRecord;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  // Attendance
  async markAttendance(studentId: string, status: 'present' | 'absent'): Promise<void> {
    if (!auth.currentUser) return;
    const date = new Date().toISOString().split('T')[0];
    const attendanceId = `${studentId}_${date}`;
    const path = `attendance/${attendanceId}`;
    try {
      await setDoc(doc(db, 'attendance', attendanceId), {
        studentId,
        date,
        status,
        markedBy: auth.currentUser.uid,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async getTodaysAttendanceForStudent(studentId: string): Promise<AttendanceRecord | null> {
    const date = new Date().toISOString().split('T')[0];
    const attendanceId = `${studentId}_${date}`;
    const path = `attendance/${attendanceId}`;
    try {
      const snap = await getDoc(doc(db, 'attendance', attendanceId));
      return snap.exists() ? { id: snap.id, ...snap.data() } as AttendanceRecord : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  subscribeToDailyAttendance(callback: (records: AttendanceRecord[]) => void) {
    const date = new Date().toISOString().split('T')[0];
    const q = query(collection(db, 'attendance'), where('date', '==', date), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord)));
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, 'attendance');
    });
  }
};
