'use client';
import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Loader2, Upload, Trash2, Images } from 'lucide-react';
import { format } from 'date-fns';

type Album = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  items: GalleryItem[];
};

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery/albums');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.title) return;
    
    try {
      const res = await fetch('/api/gallery/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum),
      });
      if (res.ok) {
        setNewAlbum({ title: '', description: '' });
        setIsCreating(false);
        fetchAlbums();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadImage = async (albumId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTo(albumId);
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'kl-school/gallery');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload image');
      const uploadData = await uploadRes.json();

      // 2. Save to database
      const dbRes = await fetch('/api/gallery/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumId,
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
        }),
      });

      if (dbRes.ok) {
        fetchAlbums();
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploadingTo(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Manage school event albums and photos.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> {isCreating ? 'Cancel' : 'New Album'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Album</h2>
          <form onSubmit={handleCreateAlbum} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Album Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={newAlbum.title}
                onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={newAlbum.description}
                onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">Create Album</button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {albums.map((album) => (
          <div key={album.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-[#0A1F44]">{album.title}</h3>
                {album.description && <p className="text-gray-500 text-sm mt-1">{album.description}</p>}
                <p className="text-xs text-gray-400 mt-2">Created {format(new Date(album.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <label className="cursor-pointer btn-primary bg-white text-[#0A1F44] border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  {uploadingTo === album.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadImage(album.id, e)}
                    disabled={uploadingTo === album.id}
                  />
                </label>
              </div>
            </div>
            
            <div className="p-6">
              {album.items.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No images in this album yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {album.items.map((item) => (
                    <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {albums.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Images className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No albums created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
