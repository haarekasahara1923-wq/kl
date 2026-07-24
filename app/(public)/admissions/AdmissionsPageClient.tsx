'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { admissionEnquirySchema, type AdmissionEnquiryInput } from '@/lib/validations';
import { ClipboardList, UserPlus, FileText, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Mascot from '@/components/public/Mascot';
import { CLASS_OPTIONS } from '@/lib/utils';

const steps = [
  { icon: FileText, title: 'Fill Enquiry', desc: 'Complete the online enquiry form with student and parent details.' },
  { icon: ClipboardList, title: 'Document Submission', desc: 'Submit required documents: birth certificate, previous class marksheet, photos.' },
  { icon: UserPlus, title: 'Interaction', desc: 'Attend a brief interaction session at the school campus.' },
  { icon: CheckCircle, title: 'Confirmation', desc: 'Receive admission confirmation and complete the fee payment.' },
];

export default function AdmissionsPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdmissionEnquiryInput>({
    resolver: zodResolver(admissionEnquirySchema),
  });

  const onSubmit = async (data: AdmissionEnquiryInput) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setSubmitted(true); reset(); }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">✨ Admissions Open 2026-27</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Join the KL Family</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Begin your child's journey toward excellence. Seats are limited — apply today.</p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-subtitle">How to Apply</span>
            <h2 className="section-title mt-2">Admission Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="text-center p-6">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#0A1F44] text-white text-xs rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
                {i < steps.length - 1 && <ArrowRight className="w-5 h-5 text-[#FF7A00] mx-auto mt-4 hidden lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-orange-50/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <Mascot size="sm" />
              <h2 className="font-playfair text-3xl font-bold text-[#0A1F44] mt-4">Enquiry Form</h2>
              <p className="text-gray-500 mt-2">Fill in the details and we'll contact you within 24 hours.</p>
            </div>

            {submitted ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="font-semibold text-[#0A1F44] text-xl mb-2">Enquiry Submitted!</h3>
                <p className="text-gray-500">Our admissions team will contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-[#FF7A00] text-sm hover:underline">Submit another enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-student">Student Name *</label>
                    <input id="adm-student" {...register('studentName')} className="input-field" placeholder="Student's full name" />
                    {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-class">Class Applying For *</label>
                    <select id="adm-class" {...register('classApplying')} className="input-field">
                      <option value="">Select class</option>
                      {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.classApplying && <p className="text-red-500 text-xs mt-1">{errors.classApplying.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-parent">Parent/Guardian Name *</label>
                    <input id="adm-parent" {...register('parentName')} className="input-field" placeholder="Parent's name" />
                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-phone">Phone Number *</label>
                    <input id="adm-phone" {...register('phone')} className="input-field" placeholder="Contact number" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-email">Email Address</label>
                  <input id="adm-email" {...register('email')} type="email" className="input-field" placeholder="Email (optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adm-message">Additional Message</label>
                  <textarea id="adm-message" {...register('message')} rows={3} className="input-field resize-none" placeholder="Any specific questions or requirements..." />
                </div>
                <button type="submit" disabled={loading} id="admissions-submit"
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-base py-4">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
