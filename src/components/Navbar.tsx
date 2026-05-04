/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  ClipboardCheck, 
  GraduationCap, 
  Home, 
  UserPlus
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion } from 'motion/react';

interface NavbarProps {
  user: any;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const location = useLocation();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Apply Now', path: '/apply', icon: UserPlus },
  ];

  if (user) {
    navItems.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  if (isAdmin) {
    navItems.push({ name: 'Admin Portal', path: '/admin', icon: ClipboardCheck });
  }

  return (
    <nav className="w-64 bg-indigo-950 text-slate-300 flex flex-col border-r border-indigo-900/50 h-full fixed left-0 top-0 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-white font-black text-xl tracking-tighter leading-tight">
            MK VOCATIONAL
          </h1>
        </div>
        <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest pl-1">
          Training Center • Halani
        </p>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-indigo-800 text-white shadow-lg shadow-indigo-900/20'
                : 'hover:bg-indigo-900/50 hover:text-white text-slate-400'
            }`}
          >
            <item.icon 
              size={18} 
              className={`mr-3 transition-opacity ${location.pathname === item.path ? 'opacity-100' : 'opacity-40'}`} 
            />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-indigo-900/50">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-indigo-900/40 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-inner">
                {user.displayName?.charAt(0) || 'U'}
              </div>
              <div className="text-xs overflow-hidden">
                <p className="text-white font-bold truncate">{user.displayName}</p>
                <p className="text-indigo-400 font-medium truncate italic">{isAdmin ? 'Administrator' : 'Student'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-indigo-800 text-[11px] font-black uppercase tracking-wider rounded-lg text-indigo-300 bg-indigo-900/20 hover:bg-red-900/40 hover:text-red-300 hover:border-red-900/40 transition-all"
            >
              <LogOut size={14} />
              Logout Session
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-xs font-black uppercase tracking-widest rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-900/30 transition-all"
          >
            Secure Login
          </motion.button>
        )}
      </div>
    </nav>
  );
}
