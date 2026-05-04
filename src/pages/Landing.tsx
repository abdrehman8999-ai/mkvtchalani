/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, BookOpen, Clock, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const stats = [
    { label: 'Total Students', value: '500+', icon: Users },
    { label: 'Active Courses', value: '12+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: Award },
    { label: 'Sessions Logged', value: '1,200', icon: Clock },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <section className="bg-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 bg-white/10 px-3 py-1 rounded mb-4 inline-block">
            Est. 2012 • Government Registered
          </span>
          <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight uppercase">
            Technical Excellence Center <span className="text-indigo-200">Halani</span>
          </h1>
          <p className="text-indigo-100 text-lg font-medium opacity-90 mb-8 max-w-md">
            Providing high-density vocational training in IT, Electrical, and Crafting sectors.
          </p>
          <div className="flex gap-4">
            <Link
              to="/apply"
              className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              Enroll Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        
        {/* Abstract pattern bg */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
      </section>

      <div className="grid grid-cols-4 gap-6 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8 bg-white p-8 rounded-xl border border-slate-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 font-mono">
            // Mission Statement
          </h3>
          <p className="text-2xl font-bold text-slate-800 leading-snug">
            We bridge the gap between traditional education and industrial demand by delivering precise, hands-on technical skills to the youth of Pakistan.
          </p>
        </div>
        
        <div className="col-span-4 bg-slate-800 text-slate-100 p-8 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 font-mono">
              // Training Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase">Web Development</span>
                <span className="text-[10px] font-mono opacity-60">BATCH-01</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full">
                <div className="h-full w-4/5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
