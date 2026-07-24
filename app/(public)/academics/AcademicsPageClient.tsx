'use client';
import { motion } from 'framer-motion';
import Mascot from '@/components/public/Mascot';
import { BookOpen, Monitor, Music, Trophy, FlaskConical, Globe } from 'lucide-react';

const programs = [
  { level: 'Pre-Primary', classes: 'Nursery, LKG, UKG', age: '3-6 years', color: 'from-pink-400 to-pink-600', desc: 'Play-based learning to build foundations in literacy, numeracy, and social skills.' },
  { level: 'Primary', classes: 'Class 1 – Class 5', age: '6-11 years', color: 'from-[#FF7A00] to-[#E06500]', desc: 'Core subjects with activity-based methods, value education, and creative arts.' },
  { level: 'Middle School', classes: 'Class 6 – Class 8', age: '11-14 years', color: 'from-blue-500 to-blue-700', desc: 'Conceptual learning with labs, projects, and introduction to competitive academics.' },
  { level: 'Secondary', classes: 'Class 9 – Class 10', age: '14-16 years', color: 'from-[#0A1F44] to-navy', desc: 'CBSE board preparation, career counseling, and intensive exam coaching.' },
  { level: 'Senior Secondary', classes: 'Class 11 – Class 12', age: '16-18 years', color: 'from-purple-500 to-purple-700', desc: 'Science, Commerce, and Arts streams with college entrance preparation.' },
];

const facilities = [
  { icon: Monitor, title: 'Smart Classrooms', desc: '60+ interactive digital boards with e-learning integration.' },
  { icon: FlaskConical, title: 'Science Labs', desc: 'Fully equipped Physics, Chemistry and Biology labs.' },
  { icon: Globe, title: 'Computer Labs', desc: '150+ computers with high-speed internet connectivity.' },
  { icon: BookOpen, title: 'Library', desc: '10,000+ books, journals, and digital resources.' },
  { icon: Music, title: 'Arts & Music', desc: 'Dedicated rooms for fine arts, music and drama.' },
  { icon: Trophy, title: 'Sports Complex', desc: 'Multi-sport facilities including cricket, football, and indoor games.' },
];

export default function AcademicsPageClient() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">Academics</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">World-Class CBSE Education</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Comprehensive programs designed to challenge, inspire, and prepare students for a rapidly evolving world.</p>
          </motion.div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-subtitle">Programs</span>
            <h2 className="section-title mt-2">Academic Programs</h2>
          </div>
          <div className="space-y-4">
            {programs.map((p, i) => (
              <motion.div key={p.level} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0 shadow-md`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-bold text-[#0A1F44] text-lg">{p.level}</h3>
                    <span className="text-xs bg-orange-100 text-[#FF7A00] px-2 py-0.5 rounded-full">{p.classes}</span>
                    <span className="text-xs bg-[#0A1F44]/10 text-[#0A1F44] px-2 py-0.5 rounded-full">{p.age}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-subtitle">Infrastructure</span>
            <h2 className="section-title mt-2">World-Class Facilities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Mascot size="sm" />
          </div>
        </div>
      </section>
    </div>
  );
}
