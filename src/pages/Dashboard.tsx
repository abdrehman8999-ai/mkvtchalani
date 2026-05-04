/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { firebaseService } from '../lib/firebaseService';
import { StudentRecord, AttendanceRecord } from '../types';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Calendar, UserCircle, MapPin, Phone, GraduationCap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        const studentData = await firebaseService.getStudentByUserId(auth.currentUser.uid);
        if (studentData) {
          setStudent(studentData);
          const att = await firebaseService.getTodaysAttendanceForStudent(studentData.id);
          setTodayAttendance(att);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAttendance = async (status: 'present' | 'absent') => {
    if (!student) return;
    setMarking(true);
    try {
      await firebaseService.markAttendance(student.id, status);
      const att = await firebaseService.getTodaysAttendanceForStudent(student.id);
      setTodayAttendance(att);
    } catch (error) {
      console.error(error);
      alert("Failed to mark attendance.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Required</h2>
          <p className="text-gray-500 mb-6">
            You are logged in but not registered as a student. If you have already applied, please wait for admin approval.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.href = '/apply'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Apply as Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">
             User Session Active
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
            Student <span className="text-indigo-600">Dashboard</span>
          </h1>
        </div>
        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm font-mono text-[10px] font-bold text-slate-400">
           ID: {student.id.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl mb-4 group hover:scale-105 transition-transform cursor-pointer">
                {student.name.charAt(0)}
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{student.name}</h2>
              <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest mt-2">
                {student.course}
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Parentage</span>
                <span className="text-sm font-bold text-slate-700">S/O {student.fatherName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</span>
                <span className="text-sm font-bold text-slate-700">{student.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Enrolled Date</span>
                <span className="text-sm font-mono font-bold text-slate-500 italic">
                  {format(new Date(student.createdAt.seconds * 1000), 'yyyy/MM/dd')}
                </span>
              </div>
            </div>
          </motion.div>
          
          <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-4">Training Progress</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase">Basic Skills</span>
              <span className="text-[10px] font-mono opacity-80">85%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_10px_white]" />
            </div>
            <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-[10px] font-black uppercase tracking-widest transition-all">
              Request Certificate
            </button>
          </div>
        </div>

        {/* Attendance Marking */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden"
          >
             <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                  LOGS // SESSION_{format(new Date(), 'yyyyMMdd')}
                </span>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">
                    MKV-SECURE-ID
                  </span>
                </div>
              </div>

            <div className="flex-1 p-10 flex flex-col items-center justify-center">
              {todayAttendance ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                    todayAttendance.status === 'present' ? 'bg-green-100 text-green-600 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-red-100 text-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  }`}>
                    {todayAttendance.status === 'present' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
                  </div>
                  <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                    {todayAttendance.status}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Captured at: {todayAttendance.timestamp?.seconds ? format(new Date(todayAttendance.timestamp.seconds * 1000), 'HH:mm:ss') : 'LIVE'}
                  </p>
                  <p className="mt-8 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4 uppercase tracking-widest">
                    Your attendance is verified for today.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-lg">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Daily Verification</h3>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Secure session log required</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => handleMarkAttendance('present')}
                      disabled={marking}
                      className="group flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <span className="font-black text-slate-900 group-hover:text-indigo-600 text-xs uppercase tracking-widest">Mark Present</span>
                    </button>
                    <button
                      onClick={() => handleMarkAttendance('absent')}
                      disabled={marking}
                      className="group flex flex-col items-center justify-center p-10 bg-white border-2 border-slate-100 rounded-2xl hover:border-red-600 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all mb-4">
                        <AlertCircle size={32} />
                      </div>
                      <span className="font-black text-slate-900 group-hover:text-red-600 text-xs uppercase tracking-widest">Mark Absent</span>
                    </button>
                  </div>
                  
                  {marking && (
                    <div className="mt-8 flex justify-center">
                      <Loader2 className="animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Halani Central Node Connectivity: <span className="text-green-600">Stable</span></span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
