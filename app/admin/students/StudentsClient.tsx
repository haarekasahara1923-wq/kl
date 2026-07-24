'use client';
import { useState } from 'react';
import { Plus, Search, Trash2, Edit, UserPlus, Phone, Mail } from 'lucide-react';
import { CLASS_OPTIONS, formatDate } from '@/lib/utils';

export default function StudentsClient({ students: initialStudents }: { students: any[] }) {
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    class: 'Class 1',
    section: 'A',
    rollNo: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
  });

  const filtered = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass ? s.class === selectedClass : true;
    return matchesSearch && matchesClass;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newStudent = await res.json();
        setStudentsList([newStudent, ...studentsList]);
        setIsModalOpen(false);
        setFormData({ admissionNo: '', name: '', class: 'Class 1', section: 'A', rollNo: '', parentName: '', parentPhone: '', parentEmail: '', address: '' });
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudentsList(studentsList.filter(s => s.id !== id));
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-[#0A1F44]">Student Management</h1>
          <p className="text-gray-500 text-sm">Manage student records, admissions, and details.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or admission no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none"
          />
        </div>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none bg-white"
        >
          <option value="">All Classes</option>
          {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class & Section</th>
                <th className="px-6 py-4">Parent Details</th>
                <th className="px-6 py-4">Admission Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No student records found.</td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0A1F44]">{s.admissionNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-[#FF7A00] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {s.class} {s.section ? `- ${s.section}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{s.parentName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {s.parentPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(s.admissionDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">Add New Student</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Admission No *" value={formData.admissionNo} onChange={e => setFormData({ ...formData, admissionNo: e.target.value })} className="input-field text-sm" />
                <input required placeholder="Student Full Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })} className="input-field text-sm">
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Section" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} className="input-field text-sm" />
                <input placeholder="Roll No" value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} className="input-field text-sm" />
              </div>
              <input required placeholder="Parent Name *" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} className="input-field text-sm" />
              <input required placeholder="Parent Phone *" value={formData.parentPhone} onChange={e => setFormData({ ...formData, parentPhone: e.target.value })} className="input-field text-sm" />
              <input placeholder="Parent Email" value={formData.parentEmail} onChange={e => setFormData({ ...formData, parentEmail: e.target.value })} className="input-field text-sm" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border rounded-xl">Cancel</button>
                <button type="submit" className="btn-primary text-sm px-5 py-2">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
