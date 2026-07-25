'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, CheckCircle, XCircle } from 'lucide-react';

type AppSetting = {
  id: string;
  key: string;
  value: string;
  description: string | null;
};

const defaultSettings = [
  { key: 'academic_year', label: 'Current Academic Year', defaultValue: '2023-2024' },
  { key: 'contact_email', label: 'Primary Contact Email', defaultValue: 'info@klis.space' },
  { key: 'contact_phone', label: 'Primary Contact Phone', defaultValue: '+91 8962678915' },
  { key: 'school_address', label: 'School Address', defaultValue: 'KL International School' },
  { key: 'admission_open', label: 'Admissions Open (true/false)', defaultValue: 'true' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data: AppSetting[] = await res.json();
        const settingsMap: Record<string, string> = {};

        // Initialize with fetched data
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });

        // Fill in missing default keys
        defaultSettings.forEach(ds => {
          if (!settingsMap[ds.key]) {
            settingsMap[ds.key] = ds.defaultValue;
          }
        });

        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setToast(null);

    try {
      const payload = defaultSettings.map(ds => ({
        key: ds.key,
        value: settings[ds.key] ?? ds.defaultValue,
      }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
        cache: 'no-store',
      });

      // Safely read the response body
      let responseData: any = null;
      try {
        const text = await res.text();
        if (text) responseData = JSON.parse(text);
      } catch (_e) {
        // ignore parse failure
      }

      if (res.ok) {
        // Re-fetch from DB to confirm data was actually saved
        await fetchSettings();
        showToast('success', 'Settings saved successfully!');
      } else {
        const errorMessage =
          responseData?.error || `Server error (${res.status})`;
        showToast('error', errorMessage);
      }
    } catch (error: any) {
      console.error('[Settings Save]', error);
      showToast('error', error?.message || 'Something went wrong. Please try again.');
    } finally {
      // Always stop the spinner regardless of success/failure
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">System Settings</h1>
          <p className="text-gray-500 mt-1">Manage global configuration for the school portal.</p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm font-medium shadow-sm transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid gap-6">
          {defaultSettings.map((ds) => (
            <div key={ds.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {ds.label}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={settings[ds.key] || ''}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, [ds.key]: e.target.value }))
                }
                disabled={saving}
              />
              <p className="text-xs text-gray-400 mt-1 font-mono">Key: {ds.key}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
