'use client';
import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Loader2, Upload, Trash2, Images, Video, Eye, EyeOff, X, Save, Edit, Globe } from 'lucide-react';
import { format } from 'date-fns';

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  type: 'image' | 'video';
  publicId: string;
};

type Album = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  items: GalleryItem[];
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '' });
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editAlbumData, setEditAlbumData] = useState({ title: '', description: '' });

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery/albums');
      if (res.ok) setAlbums(await res.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.title) return;
    try {
      const res = await fetch('/api/gallery/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAlbum, isPublished: true }), // default published
      });
      if (res.ok) {
        setNewAlbum({ title: '', description: '' });
        setIsCreating(false);
        fetchAlbums();
      }
    } catch (error) { console.error(error); }
  };

  const handleTogglePublish = async (album: Album) => {
    try {
      const res = await fetch(`/api/gallery/albums/${album.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !album.isPublished }),
      });
      if (res.ok) {
        setAlbums(prev => prev.map(a => a.id === album.id ? { ...a, isPublished: !a.isPublished } : a));
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteAlbum = async (id: string, title: string) => {
    if (!confirm(`Delete album "${title}" and all its media? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/gallery/albums/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlbums(prev => prev.filter(a => a.id !== id));
      } else {
        alert('Failed to delete album');
      }
    } catch { alert('Network error'); }
  };

  const openEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setEditAlbumData({ title: album.title, description: album.description || '' });
  };

  const handleSaveEditAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;
    try {
      const res = await fetch(`/api/gallery/albums/${editingAlbum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAlbumData),
      });
      if (res.ok) {
        setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? { ...a, ...editAlbumData } : a));
        setEditingAlbum(null);
      }
    } catch { alert('Failed to save album'); }
  };

  const handleUploadMedia = async (albumId: string, e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTo(albumId + '_' + type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'kl-school/gallery');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Failed to upload');
      const uploadData = await uploadRes.json();

      const dbRes = await fetch('/api/gallery/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumId,
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
          type,
        }),
      });

      if (dbRes.ok) fetchAlbums();
      else alert('Failed to save media to database');
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingTo(null);
      e.target.value = ''; // Reset input
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Remove this media item?')) return;
    setDeletingItem(itemId);
    try {
      const res = await fetch(`/api/gallery/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setAlbums(prev => prev.map(a => ({
          ...a,
          items: a.items.filter(i => i.id !== itemId)
        })));
      } else {
        alert('Failed to delete item');
      }
    } catch { alert('Network error'); }
    finally { setDeletingItem(null); }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Gallery Management</h1>
          <p className="text-gray-500 mt-1">Manage school event albums, photos, and videos.</p>
        </div>
        <button onClick={() => setIsCreating(!isCreating)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> {isCreating ? 'Cancel' : 'New Album'}
        </button>
      </div>

      {/* Create Album Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Create New Album</h2>
          <form onSubmit={handleCreateAlbum} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Album Title *</label>
              <input
                type="text" required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={newAlbum.title}
                onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={newAlbum.description}
                onChange={e => setNewAlbum({ ...newAlbum, description: e.target.value })}
              />
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Globe className="w-3 h-3" /> New albums are automatically published to the website.</p>
            <button type="submit" className="btn-primary">Create Album</button>
          </form>
        </div>
      )}

      {/* Albums List */}
      <div className="space-y-8">
        {albums.map((album) => (
          <div key={album.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Album Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-[#0A1F44]">{album.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${album.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {album.isPublished ? '● Live' : '○ Hidden'}
                    </span>
                  </div>
                  {album.description && <p className="text-gray-500 text-sm">{album.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{album.items.length} item{album.items.length !== 1 ? 's' : ''} · Created {format(new Date(album.createdAt), 'MMM dd, yyyy')}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Upload Image */}
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                    {uploadingTo === album.id + '_image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    Photo
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadMedia(album.id, e, 'image')} disabled={uploadingTo !== null} />
                  </label>

                  {/* Upload Video */}
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors">
                    {uploadingTo === album.id + '_video' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    Video
                    <input type="file" accept="video/*" className="hidden" onChange={e => handleUploadMedia(album.id, e, 'video')} disabled={uploadingTo !== null} />
                  </label>

                  {/* Publish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(album)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      album.isPublished ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100' : 'text-green-700 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {album.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {album.isPublished ? 'Hide' : 'Publish'}
                  </button>

                  {/* Edit Album */}
                  <button
                    onClick={() => openEditAlbum(album)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>

                  {/* Delete Album */}
                  <button
                    onClick={() => handleDeleteAlbum(album.id, album.title)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Album
                  </button>
                </div>
              </div>
            </div>

            {/* Album Items Grid */}
            <div className="p-6">
              {album.items.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No media in this album yet. Upload photos or videos above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {album.items.map((item) => (
                    <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={item.url} alt={item.caption || 'Gallery item'} className="w-full h-full object-cover" />
                      )}
                      {item.type === 'video' && (
                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Video className="w-2.5 h-2.5" /> Video
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItem === item.id}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deletingItem === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

      {/* Edit Album Modal */}
      {editingAlbum && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">Edit Album</h3>
              <button onClick={() => setEditingAlbum(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSaveEditAlbum} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Album Title *</label>
                <input type="text" required value={editAlbumData.title} onChange={e => setEditAlbumData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editAlbumData.description} onChange={e => setEditAlbumData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingAlbum(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="btn-primary text-sm px-5 py-2 flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
