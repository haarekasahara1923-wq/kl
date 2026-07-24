'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Images } from 'lucide-react';
import Mascot from '@/components/public/Mascot';

export default function GalleryPageClient({ albums }: { albums: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);
  const [albumItems, setAlbumItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const openAlbum = async (album: any) => {
    setSelected(album);
    setAlbumItems([]);
    setLoadingItems(true);
    try {
      const res = await fetch(`/api/gallery/albums/${album.id}/items`);
      if (!res.ok) {
        console.error('[Gallery] Failed to fetch items, status:', res.status);
        setAlbumItems([]);
        return;
      }
      const data = await res.json();
      setAlbumItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error('[Gallery] Error loading album items:', err);
      setAlbumItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">Our Moments</span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Photo Gallery</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">Capturing memories, milestones, and the spirit of K.L. International School.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {albums.length === 0 ? (
            <div className="text-center py-20">
              <Mascot size="md" />
              <p className="text-gray-400 mt-4">Gallery albums coming soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, i) => (
                <motion.div key={album.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  onClick={() => openAlbum(album)}
                  className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="h-48 bg-gradient-to-br from-[#FF7A00]/10 to-[#0A1F44]/10 relative overflow-hidden">
                    {album.coverUrl ? (
                      <Image src={album.coverUrl} alt={album.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#0A1F44] group-hover:text-[#FF7A00] transition-colors">{album.title}</h3>
                    {album.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{album.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 overflow-auto p-4 sm:p-8"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="font-semibold text-[#0A1F44] text-xl">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {loadingItems ? (
                  <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : albumItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">No items in this album yet.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {albumItems.map(item => (
                      <div key={item.id} className="aspect-square relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        {item.type === 'video' || item.url.match(/\.(mp4|webm)$/i) ? (
                          <video src={item.url} controls className="w-full h-full object-cover" />
                        ) : (
                          <Image src={item.url} alt={item.caption || ''} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
