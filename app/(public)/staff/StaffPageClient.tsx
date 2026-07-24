'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Mascot from '@/components/public/Mascot';
import { getInitials } from '@/lib/utils';

export default function StaffPageClient({ staffList }: { staffList: any[] }) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">Our Team</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Meet Our Faculty</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">85+ passionate educators dedicated to shaping your child's future with expertise and care.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {staffList.length === 0 ? (
            <div className="text-center py-20">
              <Mascot size="md" />
              <p className="text-gray-400 mt-4">Staff profiles coming soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staffList.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-[#FF7A00]/10 to-[#0A1F44]/10 flex items-center justify-center">
                    {member.photoUrl ? (
                      <Image src={member.photoUrl} alt={member.name} width={120} height={120} className="rounded-full object-cover w-28 h-28 border-4 border-white shadow-md" />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#E06500] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-[#0A1F44]">{member.name}</h3>
                    <p className="text-[#FF7A00] text-sm font-medium mt-1">{member.designation}</p>
                    {member.department && <p className="text-gray-400 text-xs mt-1">{member.department}</p>}
                    {member.qualification && <p className="text-gray-400 text-xs mt-1">{member.qualification}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
