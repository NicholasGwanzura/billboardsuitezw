
import React, { useState, useRef, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser, getAuditLogs, getCompanyLogo, setCompanyLogo, getCompanyProfile, updateCompanyProfile, RELEASE_NOTES, resetSystemData, createSystemBackup, restoreSystemBackup, getLastManualBackupDate, getAutoBackupStatus, getStorageUsage, restoreDefaultBillboards } from '../services/mockData';
import { 
  User, Shield, Building, ScrollText, Download, Plus, X, Save, Phone, MapPin, 
  Edit2, Trash2, AlertTriangle, Cloud, Upload, Database, 
  FileUp, FileDown, HardDrive, Map as MapIcon, CheckCircle
} from 'lucide-react';
import { User as UserType, CompanyProfile } from '../types';

const MinimalInput = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div className="group relative">
    <input type={type} required={required} value={value} onChange={onChange} placeholder=" " className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent" />
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-800 uppercase tracking-wide">{label}</label>
  </div>
);

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Audit' | 'Data' | 'ReleaseNotes'>('General');
  const [users, setUsers] = useState<UserType[]>(getUsers());
  const auditLogs = getAuditLogs();
  const [logoPreview, setLogoPreview] = useState(getCompanyLogo());
  const [profile, setProfile] = useState<CompanyProfile>(getCompanyProfile());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserType>>({ firstName: '', lastName: '', email: '', role: 'Staff' });
  const [backupStatus, setBackupStatus] = useState({ manual: getLastManualBackupDate(), auto: getAutoBackupStatus(), storage: getStorageUsage() });

  useEffect(() => {
      if (activeTab === 'Data') {
          setBackupStatus({ manual: getLastManualBackupDate(), auto: getAutoBackupStatus(), storage: getStorageUsage() });
      }
  }, [activeTab]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const file = e.target.files?.[0]; 
      if (file) { 
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64 = reader.result as string;
              setLogoPreview(base64);
              setCompanyLogo(base64);
              alert("Logo updated.");
          };
          reader.readAsDataURL(file);
      } 
  };

  const handleSaveCompanyDetails = () => {
      updateCompanyProfile(profile);
      alert("Company details updated successfully.");
  };

  const handleAddUser = (e: React.FormEvent) => { 
      e.preventDefault(); 
      const user: UserType = { 
          id: (users.length + 1).toString(), 
          firstName: newUser.firstName!, 
          lastName: newUser.lastName!, 
          email: newUser.email!, 
          role: newUser.role as 'Admin' | 'Manager' | 'Staff', 
          password: 'password123' 
      }; 
      addUser(user); 
      setUsers(getUsers()); 
      setIsAddUserModalOpen(false); 
      setNewUser({ firstName: '', lastName: '', email: '', role: 'Staff' }); 
  };

  const handleExportAuditLogs = () => { 
      if (auditLogs.length === 0) { alert("No logs to export."); return; } 
      const csvRows = auditLogs.map(log => `${log.id},"${log.timestamp}","${log.user}","${log.action}","${log.details.replace(/"/g, '""')}"`).join("\n"); 
      const blob = new Blob(["ID,Timestamp,User,Action,Details\n" + csvRows], { type: 'text/csv;charset=utf-8;' }); 
      const url = URL.createObjectURL(blob); 
      const link = document.createElement('a'); 
      link.href = url; 
      link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0,10)}.csv`); 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
  };

  const handleDownloadBackup = () => {
    const json = createSystemBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `billboard_suite_backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const success = restoreSystemBackup(event.target.result as string);
                if (success) {
                    alert("System restored successfully! Reloading.");
                    window.location.reload();
                } else {
                    alert("Failed to restore backup.");
                }
            }
        };
        reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">System Settings</h2>
                <p className="text-slate-500 font-medium">Manage organization profile, users, and data</p>
            </div>
            <div className="flex bg-white rounded-full border border-slate-200 p-1 shadow-sm overflow-x-auto max-w-full">
                {(['General', 'Data', 'Audit', 'ReleaseNotes'] as const).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        {tab === 'ReleaseNotes' ? 'Release Notes' : tab}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'General' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-50 rounded-xl"><Building className="w-6 h-6 text-blue-600" /></div>
                            <h3 className="text-xl font-bold text-slate-800">Company Profile</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2"><MinimalInput label="Company Registered Name" value={profile.name} onChange={(e: any) => setProfile({...profile, name: e.target.value})} /></div>
                                <MinimalInput label="Tax ID / VAT Number" value={profile.vatNumber} onChange={(e: any) => setProfile({...profile, vatNumber: e.target.value})} />
                                <MinimalInput label="Registration Number" value={profile.regNumber} onChange={(e: any) => setProfile({...profile, regNumber: e.target.value})} />
                            </div>
                            <div className="border-t border-slate-50 pt-6">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-6"><Phone size={14} /> Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <MinimalInput label="General Email" value={profile.email} onChange={(e: any) => setProfile({...profile, email: e.target.value})} type="email" />
                                    <MinimalInput label="Support Email" value={profile.supportEmail} onChange={(e: any) => setProfile({...profile, supportEmail: e.target.value})} type="email" />
                                    <MinimalInput label="Phone Number" value={profile.phone} onChange={(e: any) => setProfile({...profile, phone: e.target.value})} type="tel" />
                                    <MinimalInput label="Website" value={profile.website} onChange={(e: any) => setProfile({...profile, website: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end pt-4 border-t border-slate-50">
                            <button onClick={handleSaveCompanyDetails} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:scale-105">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Data Tab */}
        {activeTab === 'Data' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Database size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Data Integrity</h3>
                            <p className="text-xs text-slate-500">Backup and restore your system data</p>
                        </div>
                    </div>
                    
                    <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Last Auto-Backup</p>
                                <p className="text-sm font-medium text-slate-700">{backupStatus.auto}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200"></div>
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Last Manual Export</p>
                                <p className="text-sm font-medium text-slate-700">{backupStatus.manual}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><FileDown size={16}/> Manual Backup</h4>
                             <button onClick={handleDownloadBackup} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/30">Download Backup File</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
