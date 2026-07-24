'use client';
import { useState } from 'react';
import { Plus, CreditCard, Download, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function FeesClient({ payments: initialPayments, structures }: { payments: any[]; structures: any[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p => p.student?.name?.toLowerCase().includes(search.toLowerCase()) || p.receiptNo?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-[#0A1F44]">Fee Management & Receipts</h1>
          <p className="text-gray-500 text-sm">Track fee collections, payment receipts, and fee structures.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments by student name or receipt number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Receipt No</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No payment records found.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0A1F44]">{p.receiptNo || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{p.student?.name || 'Unknown Student'}</td>
                    <td className="px-6 py-4 font-bold text-[#FF7A00]">{formatCurrency(p.amountPaid)}</td>
                    <td className="px-6 py-4 uppercase text-xs font-semibold">{p.paymentMode}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(p.paymentDate)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
