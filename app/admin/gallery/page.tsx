'use client';
import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Loader2, Trash2, Video, Plus, X } from 'lucide-react';

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  type: 'image' | 'video';
  publicId: string;
  createdAt: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery/items');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Step 1: Upload to Cloudinary via /api/upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'kl-school/gallery');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        alert(`Upload failed: ${err.error || 'Unknown error'}`);
        return;
      }
      const uploadData = await uploadRes.json();

      // Step 2: Save to DB
      const dbRes = await fetch('/api/gallery/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
          type,
        }),
      });

      if (!dbRes.ok) {
        const err = await dbRes.json();
        alert(`Failed to save: ${err.error || 'Unknown error'}`);
        return;
      }

      await fetchItems();
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Remove this item from the gallery?')) return;
    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/gallery/items/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== item.id));
        if (lightbox?.id === item.id) setLightbox(null);
      } else {
        alert('Failed to delete. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Gallery</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload photos and videos — they appear on the website instantly.
            <span className="ml-2 text-[#FF7A00] font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add Photo */}
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            Add Photo
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={e => handleUpload(e, 'image')}
            />
          </label>

          {/* Add Video */}
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            Add Video
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploading}
              onChange={e => handleUpload(e, 'video')}
            />
          </label>
        </div>
      </div>

      {/* Upload in progress banner */}
      {uploading && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm font-medium">
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
          Uploading to Cloudinary and saving… Please wait.
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No media yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Photo" or "Add Video" above to upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setLightbox(item)}
            >
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={item.url} alt={item.caption || 'Gallery item'} className="w-full h-full object-cover" />
              )}

              {/* Video badge */}
              {item.type === 'video' && (
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Video className="w-2.5 h-2.5" /> Video
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(item); }}
                  disabled={deletingId === item.id}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[85vh] rounded-xl" />
            ) : (
              <img src={lightbox.url} alt={lightbox.caption || ''} className="w-full max-h-[85vh] object-contain rounded-xl" />
            )}
            <div className="flex justify-between items-center mt-3 px-1">
              {lightbox.caption && <p className="text-white/80 text-sm">{lightbox.caption}</p>}
              <button
                onClick={() => handleDelete(lightbox)}
                disabled={deletingId === lightbox.id}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === lightbox.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
