'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import {
  GraduationCap, Users, Award, BookOpen, Star, ArrowRight,
  Phone, MessageCircle, ChevronDown, Sparkles, Trophy, Heart
} from 'lucide-react';
import Mascot from '@/components/public/Mascot';

const stats = [
  { icon: Users, value: '1200+', label: 'Students Enrolled' },
  { icon: GraduationCap, value: '85+', label: 'Expert Faculty' },
  { icon: Award, value: '20+', label: 'Years of Excellence' },
  { icon: Trophy, value: '50+', label: 'Awards Won' },
];

const highlights = [
  { icon: BookOpen, title: 'CBSE Curriculum', desc: 'Comprehensive CBSE-aligned academics from Nursery to Class XII with modern pedagogy.' },
  { icon: Sparkles, title: 'Smart Classrooms', desc: 'Interactive digital boards, e-learning tools and state-of-the-art technology in every class.' },
  { icon: Heart, title: 'Holistic Development', desc: 'Sports, arts, music, drama and value education woven into our daily academic fabric.' },
  { icon: Star, title: 'Excellent Results', desc: 'Consistent 100% board pass rate with students securing top ranks across Gwalior.' },
];

const newsItems = [
  '🎓 Annual Day Celebrations 2025 — A Grand Success!',
  '📚 Admissions Open for 2026-27 Academic Session',
  '🏆 Students won Gold at State Science Olympiad',
  '⚽ Sports Week Begins — All Classes Participate',
  '🌟 CBSE Results: 100% Pass Rate for Class X & XII',
];

function NewsTicker() {
  return (
    <div className="bg-[#FF7A00] text-white py-2 overflow-hidden">
      <div className="flex items-center gap-4 px-4">
        <span className="shrink-0 font-semibold text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
          Latest
        </span>
        <div className="overflow-hidden flex-1">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap text-sm"
          >
            {[...newsItems, ...newsItems].map((item, i) => (
              <span key={i} className="shrink-0">{item}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '918962678915';

  return (
    <>
      <div className="mt-16 lg:mt-20">
        <NewsTicker />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0A1F44] via-[#1a3a6b] to-[#0A1F44]">
        {/* Animated background orbs */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7A00]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6"
            >
              ✨ Admissions Open 2026-27
            </motion.span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Shaping{' '}
              <span className="text-[#FF7A00]">Tomorrow's</span>
              <br />Leaders Today
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              K.L. International School — where academic excellence meets holistic development. 
              Providing world-class CBSE education in the heart of Gwalior since our establishment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admissions" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Apply for Admission <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <a href="tel:8962678915" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 text-[#FF7A00]" />
                8962678915
              </a>
            </div>
          </motion.div>

          {/* Mascot + floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              <Mascot size="lg" className="drop-shadow-2xl" />

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-8 bg-white rounded-2xl shadow-2xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-[#FF7A00]/10 rounded-xl flex items-center justify-center">
                  <Star className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div>
                  <p className="text-navy font-bold text-sm">100%</p>
                  <p className="text-gray-500 text-xs">Pass Rate</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-2xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-navy/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <p className="text-navy font-bold text-sm">50+ Awards</p>
                  <p className="text-gray-500 text-xs">Won this year</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF7A00]/10 rounded-2xl mb-4">
                  <stat.icon className="w-7 h-7 text-[#FF7A00]" />
                </div>
                <p className="font-playfair text-3xl font-bold text-[#0A1F44]">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-subtitle">Why Choose Us</span>
            <h2 className="section-title mt-2">Excellence in Every Dimension</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              We combine rigorous academics with creative, physical and moral development to craft well-rounded individuals.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-orange-100 border border-gray-100 hover:border-[#FF7A00]/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-orange-500/20">
                  <h.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{h.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#0A1F44] to-[#1a3a6b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF7A00] to-[#E06500] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
            </div>

            <div className="relative z-10">
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-3">
                Begin Your Journey Here
              </h2>
              <p className="text-white/80 text-lg">
                Seats filling fast for 2026-27. Apply today and give your child the best start.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/admissions"
                className="bg-white text-[#FF7A00] font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot wave section */}
      <section className="py-16 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex flex-col items-center gap-4"
        >
          <Mascot size="md" />
          <p className="text-[#0A1F44] font-semibold text-lg">
            Ready to join the KL Family?{' '}
            <Link href="/admissions" className="text-[#FF7A00] hover:underline">
              Apply today!
            </Link>
          </p>
        </motion.div>
      </section>
    </>
  );
}
