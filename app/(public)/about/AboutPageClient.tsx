'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Mascot from '@/components/public/Mascot';
import { Quote, Target, Eye, Heart, Star } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To provide quality education that empowers students to become responsible, creative and confident global citizens.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be the leading institution in central India that nurtures academic excellence and character building.' },
  { icon: Heart, title: 'Our Values', desc: 'Integrity, Discipline, Innovation, Inclusivity, and Respect for all — the pillars of our school culture.' },
  { icon: Star, title: 'Our Promise', desc: 'We promise every student a safe, stimulating environment where they can grow intellectually and emotionally.' },
];

export default function AboutPageClient({ director, principal }: { director: any; principal: any }) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">About Us</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Our Story & Legacy</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Building generations of leaders through education rooted in values, knowledge, and excellence.</p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-subtitle">Our Heritage</span>
              <h2 className="section-title mt-2 mb-6">A Legacy of Excellence</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>K.L. International School was founded with a singular vision: to create an educational institution that combines the best of traditional values with modern academic excellence in Gwalior, Madhya Pradesh.</p>
                <p>Located on Hastinapur Road, our school has grown from humble beginnings to become one of the most respected educational institutions in the region, serving over 1200 students across Nursery to Class XII.</p>
                <p>Our CBSE-affiliated curriculum is delivered by a team of 85+ dedicated faculty members who are passionate about shaping young minds and futures.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
              <Mascot size="lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="py-20 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-subtitle">What Drives Us</span>
            <h2 className="section-title mt-2">Our Foundation</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Director Message */}
      {director && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
                <div className="relative">
                  {director.photoUrl ? (
                    <Image src={director.photoUrl} alt={director.name} width={280} height={320} className="rounded-3xl object-cover shadow-2xl" />
                  ) : (
                    <div className="w-64 h-72 rounded-3xl bg-gradient-to-br from-[#FF7A00]/20 to-[#0A1F44]/20 flex items-center justify-center">
                      <span className="text-6xl">👨‍💼</span>
                    </div>
                  )}
                  <div className="absolute -bottom-4 -right-4 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    {director.designation}
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="section-subtitle">From the Director</span>
                <h2 className="section-title mt-2 mb-4">{director.name}</h2>
                {director.qualifications && <p className="text-gray-400 text-sm mb-4">{director.qualifications}</p>}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#FF7A00]/30" />
                  <p className="text-gray-600 leading-relaxed pl-6 italic">{director.message}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Principal Message */}
      {principal && (
        <section className="py-20 bg-gradient-to-b from-orange-50/20 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="section-subtitle">From the Principal</span>
                <h2 className="section-title mt-2 mb-4">{principal.name}</h2>
                {principal.qualifications && <p className="text-gray-400 text-sm mb-4">{principal.qualifications}</p>}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#FF7A00]/30" />
                  <p className="text-gray-600 leading-relaxed pl-6 italic">{principal.message}</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
                <div className="relative">
                  {principal.photoUrl ? (
                    <Image src={principal.photoUrl} alt={principal.name} width={280} height={320} className="rounded-3xl object-cover shadow-2xl" />
                  ) : (
                    <div className="w-64 h-72 rounded-3xl bg-gradient-to-br from-[#0A1F44]/20 to-[#FF7A00]/20 flex items-center justify-center">
                      <span className="text-6xl">👩‍💼</span>
                    </div>
                  )}
                  <div className="absolute -bottom-4 -left-4 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    {principal.designation}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
