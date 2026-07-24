'use client';
import { useState, useEffect } from 'react';
import { Loader2, Settings as SettingsIcon, Save } from 'lucide-react';

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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.keys(settings).map(key => ({
        key,
        value: settings[key],
      }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">System Settings</h1>
          <p className="text-gray-500 mt-1">Manage global configuration for the school portal.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid gap-6">
          {defaultSettings.map((ds) => (
            <div key={ds.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{ds.label}</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={settings[ds.key] || ''}
                onChange={(e) => setSettings({ ...settings, [ds.key]: e.target.value })}
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
