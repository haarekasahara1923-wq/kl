'use client';
import { useState, useEffect } from 'react';
import { Loader2, Plus, UserCheck, Mail, Phone, Building, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

type Staff = {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string | null;
  email: string | null;
  phone: string;
  basicSalary: string | null;
  joiningDate: string;
  isActive: boolean;
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newStaff, setNewStaff] = useState({
    employeeId: '', name: '', designation: '', department: '', email: '', phone: '', basicSalary: '', joiningDate: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.employeeId || !newStaff.name || !newStaff.designation || !newStaff.phone) return;

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      if (res.ok) {
        setNewStaff({ employeeId: '', name: '', designation: '', department: '', email: '', phone: '', basicSalary: '', joiningDate: '' });
        setIsCreating(false);
        fetchStaff();
      } else {
        alert('Failed to save staff');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save staff');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Staff & Payroll</h1>
          <p className="text-gray-500 mt-1">Manage staff details, departments, and records.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> {isCreating ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Staff Member</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.employeeId} onChange={(e) => setNewStaff({...newStaff, employeeId: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.designation} onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.department} onChange={(e) => setNewStaff({...newStaff, department: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (₹)</label>
              <input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.basicSalary} onChange={(e) => setNewStaff({...newStaff, basicSalary: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={newStaff.joiningDate} onChange={(e) => setNewStaff({...newStaff, joiningDate: e.target.value})} />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="btn-primary">Save Staff Member</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#0A1F44] text-lg">{member.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-[#FF7A00] font-medium mb-4">{member.designation}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-gray-400" /> ID: {member.employeeId}</div>
                {member.department && <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /> Dept: {member.department}</div>}
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {member.phone}</div>
                {member.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {member.email}</div>}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined:</span>
                <span className="font-medium text-gray-700">{format(new Date(member.joiningDate), 'MMM dd, yyyy')}</span>
              </div>
              {member.basicSalary && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Base Pay:</span>
                  <span className="font-medium text-gray-700">₹{member.basicSalary}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {staff.length === 0 && !loading && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No staff members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
