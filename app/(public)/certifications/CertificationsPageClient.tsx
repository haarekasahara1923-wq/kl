'use client';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import Mascot from '@/components/public/Mascot';
import { formatDate } from '@/lib/utils';

export default function CertificationsPageClient({ certifications }: { certifications: any[] }) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">Recognition</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Certifications & Awards</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Our accreditations and recognitions that affirm our commitment to educational excellence.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {certifications.length === 0 ? (
            <div className="text-center py-20">
              <Mascot size="md" />
              <p className="text-gray-400 mt-4">Certifications will appear here soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, i) => (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#0A1F44] text-lg mb-2">{cert.title}</h3>
                  {cert.issuedBy && <p className="text-[#FF7A00] text-sm font-medium mb-1">{cert.issuedBy}</p>}
                  {cert.issuedDate && <p className="text-gray-400 text-xs mb-3">{formatDate(cert.issuedDate)}</p>}
                  {cert.description && <p className="text-gray-500 text-sm mb-4">{cert.description}</p>}
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#FF7A00] hover:text-[#E06500] text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" /> View Certificate
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
