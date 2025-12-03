
import React, { useState, useRef, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser, getAuditLogs, getCompanyLogo, setCompanyLogo, getCompanyProfile, updateCompanyProfile, RELEASE_NOTES, resetSystemData, createSystemBackup, restoreSystemBackup, getLastManualBackupDate, getAutoBackupStatus, getStorageUsage, restoreDefaultBillboards } from '../services/mockData';
import { User, Shield, Building, ScrollText, Download, Plus, X, Save, Phone, MapPin, Edit2, Trash2, AlertTriangle, Cloud, Upload, History, RefreshCw, Database, FileUp, FileDown, Clock, Archive, HardDrive, Map } from 'lucide-react';
import { User as UserType, CompanyProfile } from '../types';

const MinimalInput = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div className="group relative">
    <input type={type} required={required} value={value} onChange={onChange} placeholder=" " className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium placeholder-transparent" />
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-slate-800 uppercase tracking-wide">{label}</label>
  </div>
);
const MinimalSelect = ({ label, value, onChange, options }: any) => (
  <div className="group relative">
    <select value={value} onChange={onChange} className="peer w-full px-0 py-2.5 border-b border-slate-200 bg-transparent text-slate-800 focus:border-slate-800 focus:ring-0 outline-none transition-all font-medium appearance-none cursor-pointer">
      {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
    <label className="absolute left-0 -top-2.5 text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</label>
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
      // Refresh backup status when entering Data tab
      if (activeTab === 'Data') {
          setBackupStatus({ manual: getLastManualBackupDate(), auto: getAutoBackupStatus(), storage: getStorageUsage() });
      }
  }, [activeTab]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const file = e.target.files?.[0]; 
      if (file) { 
          if (file.size > 1024 * 1024) { // 1MB limit
              alert("Image size is too large (Max 1MB). Please compress the image.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64 = reader.result as string;
              setLogoPreview(base64);
              setCompanyLogo(base64);
              alert("Logo updated and saved successfully.");
          };
          reader.readAsDataURL(file);
      } 
  };

  const handleSaveCompanyDetails = () => {
      updateCompanyProfile(profile);
      alert("Company details updated successfully.");
  };

  const handleAddUser = (e: React.FormEvent) => { e.preventDefault(); const user: UserType = { id: (users.length + 1).toString(), firstName: newUser.firstName!, lastName: newUser.lastName!, email: newUser.email!, role: newUser.role as 'Admin' | 'Manager' | 'Staff', password: 'password123' }; addUser(user); setUsers(getUsers()); setIsAddUserModalOpen(false); setNewUser({ firstName: '', lastName: '', email: '', role: 'Staff' }); };
  const handleEditUser = (e: React.FormEvent) => { e.preventDefault(); if (editingUser) { updateUser(editingUser); setUsers(getUsers()); setEditingUser(null); } };
  const handleConfirmDelete = () => { if (userToDelete) { deleteUser(userToDelete.id); setUsers(getUsers()); setUserToDelete(null); } };
  
  const handleExportAuditLogs = () => { if (auditLogs.length === 0) { alert("No logs to export."); return; } const csvRows = auditLogs.map(log => `${log.id},"${log.timestamp}","${log.user}","${log.action}","${log.details.replace(/"/g, '""')}"`).join("\n"); const blob = new Blob(["ID,Timestamp,User,Action,Details\n" + csvRows], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0,10)}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  const handleDownloadBackup = () => {
    const json = createSystemBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `billboard_suite_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setBackupStatus(prev => ({ ...prev, manual: getLastManualBackupDate() }));
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const success = restoreSystemBackup(event.target.result as string);
                if (success) {
                    alert("System restored successfully! The page will now reload.");
                    window.location.reload();
                } else {
                    alert("Failed to restore backup. Invalid file format.");
                }
            }
        };
        reader.readAsText(file);
    }
  };

  const handleRestoreBillboards = () => {
      const added = restoreDefaultBillboards();
      if (added > 0) {
          alert(`Successfully restored ${added} missing billboards to your inventory.`);
          // Optionally reload to reflect changes immediately across all components if not reactive
          // window.location.reload(); 
      } else {
          alert("Your inventory already contains all default billboards. No missing items found.");
      }
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-2">System Settings</h2><p className="text-slate-500 font-medium">Manage organization profile, users, and data</p></div><div className="flex bg-white rounded-full border border-slate-200 p-1 shadow-sm overflow-x-auto max-w-full"><button onClick={() => setActiveTab('General')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'General' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>General</button><button onClick={() => setActiveTab('Data')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'Data' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Data Management</button><button onClick={() => setActiveTab('Audit')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'Audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Audit Logs</button><button onClick={() => setActiveTab('ReleaseNotes')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'ReleaseNotes' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Release Notes</button></div></div>
        {activeTab === 'General' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in"><div className="lg:col-span-2 space-y-8"><div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"><div className="flex items-center gap-3 mb-8"><div className="p-3 bg-blue-50 rounded-xl"><Building className="w-6 h-6 text-blue-600" /></div><h3 className="text-xl font-bold text-slate-800">Company Profile</h3></div><div className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="md:col-span-2"><MinimalInput label="Company Registered Name" value={profile.name} onChange={(e: any) => setProfile({...profile, name: e.target.value})} /></div><MinimalInput label="Tax ID / VAT Number" value={profile.vatNumber} onChange={(e: any) => setProfile({...profile, vatNumber: e.target.value})} /><MinimalInput label="Registration Number" value={profile.regNumber} onChange={(e: any) => setProfile({...profile, regNumber: e.target.value})} /></div><div className="border-t border-slate-50 pt-6"><h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-6"><Phone size={14} /> Contact Information</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><MinimalInput label="General Email" value={profile.email} onChange={(e: any) => setProfile({...profile, email: e.target.value})} type="email" /><MinimalInput label="Support Email" value={profile.supportEmail} onChange={(e: any) => setProfile({...profile, supportEmail: e.target.value})} type="email" /><MinimalInput label="Phone Number" value={profile.phone} onChange={(e: any) => setProfile({...profile, phone: e.target.value})} type="tel" /><MinimalInput label="Website" value={profile.website} onChange={(e: any) => setProfile({...profile, website: e.target.value})} /></div></div><div className="border-t border-slate-50 pt-6"><h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider mb-6"><MapPin size={14} /> Location Details</h4><div className="space-y-6"><MinimalInput label="Street Address" value={profile.address} onChange={(e: any) => setProfile({...profile, address: e.target.value})} /><div className="grid grid-cols-2 gap-8"><MinimalInput label="City" value={profile.city} onChange={(e: any) => setProfile({...profile, city: e.target.value})} /><MinimalInput label="Country" value={profile.country} onChange={(e: any) => setProfile({...profile, country: e.target.value})} /></div></div></div></div><div className="mt-8 flex justify-end pt-4 border-t border-slate-50"><button onClick={handleSaveCompanyDetails} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all hover:scale-105">Save Changes</button></div></div><div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-green-50 rounded-xl"><Shield className="w-6 h-6 text-green-600" /></div><h3 className="text-lg font-bold text-slate-800">User Access Control</h3></div><button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-1 text-sm text-blue-600 font-bold uppercase tracking-wider hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"><Plus size={16} /> Add User</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 min-w-[500px]"><thead className="bg-slate-50/50 border-b border-slate-100"><tr><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">User</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Email</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Role</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map(user => (<tr key={user.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-300">{user.firstName.charAt(0)}</div>{user.firstName} {user.lastName}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>{user.role}</span></td><td className="px-6 py-4 flex justify-end gap-2"><button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-100"><Edit2 size={16} /></button><button onClick={() => setUserToDelete(user)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button></td></tr>))}</tbody></table></div></div></div><div className="space-y-6"><div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="text-lg font-bold text-slate-800 mb-6">Branding & Identity</h3><div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl mb-6 bg-slate-50/50 hover:bg-slate-50 transition-colors"><div className="text-center relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}><div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-md border-4 border-white group-hover:scale-105 transition-transform"><img src={logoPreview} alt="Logo" className="w-full h-full object-cover"/></div><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">Change</div></div><p className="text-sm font-medium text-slate-600">Company Logo</p><p className="text-xs text-slate-400 mt-1">Click to Upload (Max 1MB)</p><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload}/></div></div><button onClick={() => fileInputRef.current?.click()} className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"><Upload size={14}/> Upload New Logo</button></div><div className="bg-gradient-to-br from-blue-900 to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group"><div className="relative z-10"><h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Cloud size={18}/> System Status</h3><div className="flex items-center gap-2 mb-6"><div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div><span className="text-blue-100 text-sm font-medium">Systems Operational</span></div><div className="space-y-2 text-xs text-blue-200/80 border-t border-white/10 pt-4 font-mono"><p>Version: <span className="text-white">1.5.1</span></p><p>Build: <span className="text-white">Production-Stable</span></p><p>Last Update: {new Date().toLocaleDateString()}</p></div></div><div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div><div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-10"></div></div></div></div>
        )}
        {activeTab === 'Data' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
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
                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <HardDrive size={16} className="text-slate-400"/>
                                <span className="text-xs font-bold uppercase text-slate-500">Local Storage</span>
                             </div>
                             <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{backupStatus.storage} KB Used</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><FileDown size={16}/> Manual Backup</h4>
                             <p className="text-xs text-slate-500 mb-4">Download a complete JSON snapshot. Recommended weekly.</p>
                             <button onClick={handleDownloadBackup} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/30">Download Backup File</button>
                        </div>
                        
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2"><FileUp size={16}/> Restore Data</h4>
                             <p className="text-xs text-slate-500 mb-4">Upload a JSON backup file to overwrite current data.</p>
                             <label className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex justify-center">
                                 Upload & Restore
                                 <input type="file" className="hidden" accept=".json" onChange={handleRestoreBackup} />
                             </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600"><AlertTriangle size={24} /></div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Danger Zone</h3>
                            <p className="text-xs text-slate-500">Irreversible system actions</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Missing Default Billboards?</h4>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">If your initial inventory (21 Billboards) disappeared due to a glitch, click here to re-add them without losing your client data.</p>
                            <button onClick={handleRestoreBillboards} className="w-full py-3 bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"><Map size={16}/> Restore Default Inventory</button>
                        </div>

                        <div className="p-6 bg-red-50/50 rounded-2xl border border-red-50">
                            <h4 className="text-sm font-bold text-red-900 mb-2">Reset Application Data</h4>
                            <p className="text-xs text-red-700/80 mb-6 leading-relaxed">This action will wipe all local data including clients, contracts, and financial records, resetting the system to its initial "factory" state with default billboards.</p>
                            <button onClick={() => setIsResetConfirmOpen(true)} className="w-full py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors">Reset System</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'Audit' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in"><div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-xl text-slate-600"><ScrollText size={20}/></div><div><h3 className="text-lg font-bold text-slate-800">Admin Audit Logs</h3><p className="text-xs text-slate-500 font-medium">Track system-wide events and security actions</p></div></div><button onClick={handleExportAuditLogs} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all shadow-sm"><Download size={14}/> Export CSV</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm text-slate-600 min-w-[600px]"><thead className="bg-slate-50/50 border-b border-slate-100"><tr><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Timestamp</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">User</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Action</th><th className="px-6 py-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Details</th></tr></thead><tbody className="divide-y divide-slate-100">{auditLogs.map(log => (<tr key={log.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td><td className="px-6 py-4 font-bold text-slate-800">{log.user}</td><td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200">{log.action}</span></td><td className="px-6 py-4 text-slate-600">{log.details}</td></tr>))}</tbody></table></div></div>
        )}
        {activeTab === 'ReleaseNotes' && (
            <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><History size={24} /></div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Release Notes</h3>
                        <p className="text-slate-500">System updates and changelog history</p>
                    </div>
                </div>
                
                {/* Scrollable Container Added Here */}
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-12 pb-12 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                    {RELEASE_NOTES.map((release, idx) => (
                        <div key={idx} className="relative pl-8">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-bold text-slate-900">v{release.version}</span>
                                            {idx === 0 && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full tracking-wider">Latest</span>}
                                        </div>
                                        <h4 className="text-slate-700 font-medium">{release.title}</h4>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                        <Clock size={12}/> {release.date}
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {release.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
      {isAddUserModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/20 transform scale-100 animate-fade-in"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">Add New User</h3><button onClick={() => setIsAddUserModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button></div><form onSubmit={handleAddUser} className="p-8 space-y-6"><div className="grid grid-cols-2 gap-6"><MinimalInput label="First Name" value={newUser.firstName} onChange={(e: any) => setNewUser({...newUser, firstName: e.target.value})} required /><MinimalInput label="Last Name" value={newUser.lastName} onChange={(e: any) => setNewUser({...newUser, lastName: e.target.value})} required /></div><MinimalInput label="Email Address" type="email" value={newUser.email} onChange={(e: any) => setNewUser({...newUser, email: e.target.value})} required /><MinimalSelect label="Role" value={newUser.role} onChange={(e: any) => setNewUser({...newUser, role: e.target.value})} options={[{value: 'Admin', label: 'Admin (Full Access)'},{value: 'Manager', label: 'Manager (No Settings)'},{value: 'Staff', label: 'Staff (Read Only)'}]} /><button type="submit" className="w-full py-4 text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl font-bold uppercase tracking-wider transition-all"><Save size={18} /> Create User Account</button></form></div></div>)}
      {editingUser && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/20"><div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">Edit User Role</h3><button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button></div><form onSubmit={handleEditUser} className="p-8 space-y-6"><div className="grid grid-cols-2 gap-6"><MinimalInput label="First Name" value={editingUser.firstName} onChange={(e: any) => setEditingUser({...editingUser, firstName: e.target.value})} required /><MinimalInput label="Last Name" value={editingUser.lastName} onChange={(e: any) => setEditingUser({...editingUser, lastName: e.target.value})} required /></div><MinimalInput label="Email Address" type="email" value={editingUser.email} onChange={(e: any) => setEditingUser({...editingUser, email: e.target.value})} required /><MinimalSelect label="Role" value={editingUser.role} onChange={(e: any) => setEditingUser({...editingUser, role: e.target.value as any})} options={[{value: 'Admin', label: 'Admin (Full Access)'},{value: 'Manager', label: 'Manager (No Settings)'},{value: 'Staff', label: 'Staff (Read Only)'}]} /><button type="submit" className="w-full py-4 text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl font-bold uppercase tracking-wider transition-all"><Save size={18} /> Update User</button></form></div></div>)}
      {userToDelete && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50"><AlertTriangle className="text-red-500" size={32} /></div><h3 className="text-xl font-bold text-slate-900 mb-2">Delete User?</h3><p className="text-slate-500 mb-6 text-sm">Are you sure you want to delete <span className="font-bold text-slate-700">{userToDelete.firstName} {userToDelete.lastName}</span>? This action cannot be undone.</p><div className="flex gap-3"><button onClick={() => setUserToDelete(null)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors">Cancel</button><button onClick={handleConfirmDelete} className="flex-1 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-red-500/30">Delete</button></div></div></div>)}
      {isResetConfirmOpen && (<div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all"><div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20 p-8 text-center animate-fade-in"><div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-50 animate-pulse"><RefreshCw className="text-red-500" size={40} /></div><h3 className="text-2xl font-bold text-slate-900 mb-2">Reset All Data?</h3><p className="text-slate-600 mb-8 leading-relaxed">This will <span className="font-bold text-red-600">permanently delete</span> all current rentals, clients, and financial records, and restore the default billboard inventory.<br/><br/>You will be logged out immediately.</p><div className="flex flex-col gap-3"><button onClick={resetSystemData} className="w-full py-4 text-white bg-red-600 hover:bg-red-700 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/30">Yes, Reset Everything</button><button onClick={() => setIsResetConfirmOpen(false)} className="w-full py-4 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold uppercase tracking-wider transition-colors">Cancel</button></div></div></div>)}
    </>
  );
};
