/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { firebaseService } from '../lib/firebaseService';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  fatherName: z.string().min(2, "Father's name is too short"),
  course: z.string().min(1, "Select a course"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address is too short"),
});

type FormData = z.infer<typeof schema>;

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await firebaseService.submitApplication(data);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    "Computer Information Technology",
    "Tailoring & Dress Making",
    "Electrician",
    "Mobile Repairing",
    "AutoCAD & Drafting",
    "Refrigeration & AC",
  ];

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full text-green-600">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for applying to MK Vocational Center. Our team will review your application and contact you via email or phone soon.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 font-medium hover:underline"
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">
          Admission Module V2
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">
          Quick Enrollment <span className="text-indigo-600">Portal</span>
        </h1>
        <p className="text-slate-500 text-xs mt-2 uppercase font-bold">Please facilitate precision in data entry</p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Student Identity</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Ex: Ali Ahmed"
              />
              {errors.name && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Father/Guardian</label>
              <input
                {...register('fatherName')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Guardian Name"
              />
              {errors.fatherName && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.fatherName.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Trade/Vocational Course</label>
            <select
              {...register('course')}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Target Course</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.course && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.course.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Contact Number</label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                placeholder="03xx xxxxxxx"
              />
              {errors.phone && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Email (Optional)</label>
              <input
                {...register('email')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-widest uppercase">Residence</label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-300"
              placeholder="Complete Halani/Local Address"
            />
            {errors.address && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.address.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-indigo-600 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={16} />
            ) : (
              'Submit Formal Application'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
