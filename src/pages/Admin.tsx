/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { firebaseService } from '../lib/firebaseService';
import { CourseApplication, AttendanceRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  Check, 
  X, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Loader2,
  Filter,
  UserPlus,
  RefreshCcw
} from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'applications' | 'attendance' | 'students'>('applications');
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const apps = await firebaseService.getAllApplications();
    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    const unsub = firebaseService.subscribeToDailyAttendance(setAttendance);
    return () => unsub();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await firebaseService.updateApplicationStatus(id, status);
      fetchApplications();
    } catch (e) {
      console.error(e);
      alert("Failed to update application.");
    }
  };

  const tabs = [
    { id: 'applications', label: 'Applications', icon: FileText, count: applications.filter(a => a.status === 'pending').length },
    { id: 'attendance', label: 'Attendance', icon: Calendar, count: attendance.length },
    { id: 'students', label: 'Student List', icon: Users, count: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">
             System Administration Phase
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Admin <span className="text-indigo-600">Console</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Network Node Halani-01 Management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchApplications}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <RefreshCcw size={18} />
          </button>
          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && activeTab === 'applications' ? (
          <div key="loader" className="flex h-[50vh] items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'applications' && (
              <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Null Application Queue</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <motion.div
                      layout
                      key={app.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex gap-5">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shrink-0 uppercase font-black text-xl border border-slate-100">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{app.name}</h3>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase font-bold">APP_{app.id.substring(0,6)}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Father Name</span>
                                <span className="text-xs font-bold text-slate-700">{app.fatherName}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trade Path</span>
                                <span className="text-xs font-bold text-indigo-600 uppercase">{app.course}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relay Terminal</span>
                                <span className="text-xs font-bold text-slate-700">{app.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                          {app.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAction(app.id, 'approved')}
                                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleAction(app.id, 'rejected')}
                                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                              >
                                <X size={16} /> Dismiss
                              </button>
                            </>
                          ) : (
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                              app.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Operational Logs</h3>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HALANI_COORD_{format(new Date(), 'dd-MM-yy')}</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Index</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Vector</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">View Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-mono">
                      {attendance.map((log) => (
                        <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">STUDENT_{log.studentId.substring(0,8)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                              log.status === 'present' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              [{log.status}]
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                             {log.timestamp?.seconds ? format(new Date(log.timestamp.seconds * 1000), 'HH:mm:ss') : 'SYSTEM'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {attendance.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">No Logged Transmissions</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-full bg-white p-20 rounded-xl border border-dashed border-slate-200 text-center">
                  <Users size={64} className="mx-auto text-slate-100 mb-6" />
                  <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tighter shadow-sm inline-block px-4 py-1">Registry Protocol</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Management of Enrolled Human Resources</p>
                  <button className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 shadow-2xl transition-all">
                    <UserPlus size={16} /> Enroll Individual
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
