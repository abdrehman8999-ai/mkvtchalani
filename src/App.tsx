/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { firebaseService } from './lib/firebaseService';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, user, isAdminRequired, isAdmin }: { children: ReactNode, user: any, isAdminRequired?: boolean, isAdmin?: boolean }) {
  const location = useLocation();

  if (user === undefined) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isAdminRequired && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await firebaseService.isUserAdmin(currentUser.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
        <Navbar user={user} isAdmin={isAdmin} />
        
        <main className="flex-1 flex flex-col ml-64 overflow-y-auto">
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center shrink-0">
            <div>
              <h2 className="text-slate-800 font-black text-sm uppercase tracking-widest">
                MK Management System V2.0
              </h2>
              <p className="text-slate-500 text-[10px] font-bold">Halani Center • Live Connectivity Connected</p>
            </div>
          </header>

          <div className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/apply" element={<Apply />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute user={user}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute user={user} isAdminRequired isAdmin={isAdmin}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <footer className="bg-white border-t border-slate-200 p-4 px-8 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
            <div className="flex space-x-6">
              <span>System Status: <span className="text-green-500">Operational</span></span>
              <span>Node: Halani-01</span>
            </div>
            <div>&copy; MK Vocational Center - {new Date().getFullYear()}</div>
          </footer>
        </main>
      </div>
    </Router>
  );
}
