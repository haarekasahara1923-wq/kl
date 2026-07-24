'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactEnquirySchema, type ContactEnquiryInput } from '@/lib/validations';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle, Loader2 } from 'lucide-react';
import Mascot from '@/components/public/Mascot';

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '918962678915';

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactEnquiryInput>({
    resolver: zodResolver(contactEnquirySchema),
  });

  const onSubmit = async (data: ContactEnquiryInput) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setSubmitted(true); reset(); }
    } catch {}
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">Get In Touch</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">We'd love to hear from you. Reach out and we'll respond promptly.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-playfair text-3xl font-bold text-[#0A1F44] mb-6">Get in Touch</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50">
                  <div className="w-10 h-10 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1F44]">Address</p>
                    <p className="text-gray-600 text-sm">Hastinapur Road, Gwalior (MP)</p>
                  </div>
                </div>
                <a href="tel:8962678915" className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors">
                  <div className="w-10 h-10 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1F44]">Phone</p>
                    <p className="text-gray-600 text-sm">8962678915</p>
                  </div>
                </a>
                <a href="mailto:support@klinternational.space" className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors">
                  <div className="w-10 h-10 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1F44]">Email</p>
                    <p className="text-gray-600 text-sm">support@klinternational.space</p>
                  </div>
                </a>
              </div>

              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-green-600/30">
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>

              <div className="mt-8">
                <Mascot size="sm" />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="font-semibold text-[#0A1F44] text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-[#FF7A00] text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-4">
                  <h3 className="font-playfair text-2xl font-bold text-[#0A1F44] mb-2">Send a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" {...register('name')} placeholder="Your name" className="input-field" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-phone">Phone *</label>
                      <input id="contact-phone" {...register('phone')} placeholder="Your phone" className="input-field" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-email">Email</label>
                    <input id="contact-email" {...register('email')} placeholder="your@email.com" className="input-field" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-subject">Subject</label>
                    <input id="contact-subject" {...register('subject')} placeholder="Subject" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" {...register('message')} placeholder="Your message..." rows={4} className="input-field resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} id="contact-submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> Send Message</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80">
        <iframe
          title="K.L. International School Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57648.27936!2d78.1!3d26.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5dde7!2sGwalior!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </section>
    </div>
  );
}
