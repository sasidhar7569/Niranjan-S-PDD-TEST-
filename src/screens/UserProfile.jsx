import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Shield, Building, LogOut, Edit3, Bell, X } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profilePic, setProfilePic] = useState('');
  const fileInputRef = useRef(null);

  // Helper to load initial name from local storage
  const getInitialName = () => {
    const f = localStorage.getItem('firstName');
    const l = localStorage.getItem('lastName');
    const u = localStorage.getItem('userName');
    
    if (f || l) return { first: f || '', last: l || '' };
    if (u) {
      const parts = u.trim().split(' ');
      return { 
        first: parts[0] || 'User', 
        last: parts.length > 1 ? parts.slice(1).join(' ') : '' 
      };
    }
    return { first: 'User', last: '' };
  };

  const initialName = getInitialName();

  // Form State
  const [firstName, setFirstName] = useState(initialName.first);
  const [lastName, setLastName] = useState(initialName.last);
  const [email, setEmail] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      if (u && u.email) return u.email;
    } catch(e) {}
    return localStorage.getItem('email') || 'example@gmail.com';
  });
  const [phone, setPhone] = useState(() => localStorage.getItem('phone') || '+91 0000000000');

  const [tempFirstName, setTempFirstName] = useState(initialName.first);
  const [tempLastName, setTempLastName] = useState(initialName.last);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  
  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  const availableCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture',
    'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Bloomberg'
  ];

  useEffect(() => {
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) setProfilePic(savedPic);


    
    setIsLightMode(localStorage.getItem('theme') === 'light');

    const savedCompanies = localStorage.getItem('targetCompanies');
    if (savedCompanies) {
      try {
        setSelectedCompanies(JSON.parse(savedCompanies));
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        localStorage.setItem('profilePic', base64String);
        window.dispatchEvent(new Event('profilePicUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalSave = () => {
    if (tempEmail !== email || tempPhone !== phone) {
      setShowOtpModal(true);
    } else {
      // Just save other details like Name
      setFirstName(tempFirstName);
      setLastName(tempLastName);
      localStorage.setItem('firstName', tempFirstName);
      localStorage.setItem('lastName', tempLastName);
      window.dispatchEvent(new Event('profilePicUpdated'));
      alert('Profile updated successfully!');
    }
  };

  const handleOtpVerify = () => {
    // Mock OTP verification - any 4 digit code works
    if (otp.join('').length === 4) {
      setFirstName(tempFirstName);
      setLastName(tempLastName);
      setEmail(tempEmail);
      setPhone(tempPhone);
      
      localStorage.setItem('firstName', tempFirstName);
      localStorage.setItem('lastName', tempLastName);
      localStorage.setItem('email', tempEmail);
      localStorage.setItem('phone', tempPhone);
      window.dispatchEvent(new Event('profilePicUpdated'));

      setShowOtpModal(false);
      setOtp(['', '', '', '']);
      alert('Profile details updated successfully!');
    } else {
      alert('Please enter a 4-digit OTP.');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="page-container relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Profile & Settings</h1>
        <p className="text-secondary text-lg">Manage your account and update preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar for Profile Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-6 flex flex-col items-center text-center mb-6">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                  {(`${firstName?.charAt(0) || ''}`.toUpperCase()) || 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="text-white" size={24} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </div>
            <h2 className="text-xl font-bold mb-1">{firstName} {lastName}</h2>
            <p className="text-sm text-secondary mb-3">{email}</p>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
              B.Tech CS • 2025
            </span>
          </div>

          <div className="card p-2 flex flex-col gap-1">
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'personal' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={18} /> Personal Details
            </button>
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'academic' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('academic')}
            >
              <Shield size={18} /> Academic Info
            </button>
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'companies' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('companies')}
            >
              <Building size={18} /> Target Companies
            </button>
            <hr className="my-2 border-slate-700" />
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> App Settings
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <div className="card h-full">
            
            {activeTab === 'personal' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempFirstName} 
                      onChange={(e) => setTempFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempLastName} 
                      onChange={(e) => setTempLastName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (OTP Required for change)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={tempEmail} 
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number (OTP Required for change)</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={tempPhone} 
                      onChange={(e) => setTempPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea className="form-input h-24 resize-none" defaultValue="Passionate software engineering student looking for exciting opportunities." />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary" onClick={handlePersonalSave}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group md:col-span-2">
                    <label className="form-label">University / College</label>
                    <input type="text" className="form-input" defaultValue="National Institute of Technology" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <select className="form-input bg-slate-800/50 appearance-auto">
                      <option>B.Tech</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input type="text" className="form-input" defaultValue="Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Graduation Year</label>
                    <input type="number" className="form-input" defaultValue="2025" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current CGPA</label>
                    <input type="number" step="0.01" className="form-input" defaultValue="8.75" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Target Companies</h3>
                <p className="text-secondary mb-6">Manage the list of companies you are focusing on for placements. This will tailor your mock tests and study materials (Max 5).</p>
                
                {/* Selected Companies Display */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedCompanies.map(comp => (
                    <div key={comp} className="px-4 py-2 rounded-full bg-primary text-white border border-primary shadow-md flex items-center gap-2">
                      <Building size={16} /> {comp}
                      <button 
                        onClick={() => {
                          const newSelected = selectedCompanies.filter(c => c !== comp);
                          setSelectedCompanies(newSelected);
                          localStorage.setItem('targetCompanies', JSON.stringify(newSelected));
                          window.dispatchEvent(new Event('targetCompaniesUpdated'));
                        }}
                        className="ml-2 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {selectedCompanies.length < 5 && !showCompanyPicker && (
                    <button 
                      className="px-4 py-2 rounded-full border border-dashed border-slate-600 text-secondary hover:text-textMain hover:border-slate-400 transition-colors flex items-center gap-2"
                      onClick={() => setShowCompanyPicker(true)}
                    >
                      + Add Company
                    </button>
                  )}
                </div>
                <p className="text-sm text-secondary mb-8">{selectedCompanies.length}/5 Selected</p>

                {/* Company Picker */}
                {showCompanyPicker && (
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-lg">Select Dream Companies</h4>
                      <button className="text-secondary hover:text-white" onClick={() => setShowCompanyPicker(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {availableCompanies.map(comp => {
                        const isSelected = selectedCompanies.includes(comp);
                        return (
                          <button
                            key={comp}
                            onClick={() => {
                              let newSelected = [...selectedCompanies];
                              if (isSelected) {
                                newSelected = newSelected.filter(c => c !== comp);
                              } else if (newSelected.length < 5) {
                                newSelected.push(comp);
                              }
                              setSelectedCompanies(newSelected);
                              localStorage.setItem('targetCompanies', JSON.stringify(newSelected));
                              // Dispatch event so other components can react if needed
                              window.dispatchEvent(new Event('targetCompaniesUpdated'));
                            }}
                            className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${
                              isSelected 
                              ? 'bg-primary text-white border-primary shadow-md' 
                              : 'bg-slate-800 text-textMuted border-slate-600 hover:border-slate-400'
                            }`}
                            style={{ background: isSelected ? 'var(--primary-color)' : '' }}
                          >
                            <Building size={16} /> {comp}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">App Settings</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-4 border border-slate-700 rounded-xl">
                    <div>
                      <h4 className="font-bold mb-1 flex items-center gap-2"><Bell size={18} /> Email Notifications</h4>
                      <p className="text-sm text-secondary">Receive daily task reminders and test alerts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border border-slate-700 rounded-xl">
                    <div>
                      <h4 className="font-bold mb-1">Light Mode</h4>
                      <p className="text-sm text-secondary">Switch between light and dark themes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isLightMode}
                        onChange={toggleTheme}
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full animate-fade-in relative">
            <button 
              className="absolute top-4 right-4 text-secondary hover:text-textMain"
              onClick={() => setShowOtpModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">Verify Changes</h3>
            <p className="text-secondary text-sm mb-6">Enter the 4-digit OTP sent to your new email/phone number to confirm these changes.</p>
            
            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold bg-slate-800/80 border border-slate-600 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-textMain"
                  value={otp[index]}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[0-9]/.test(val) || val === '') {
                      const newOtp = [...otp];
                      newOtp[index] = val;
                      setOtp(newOtp);
                      // Auto-focus next input (basic implementation)
                      if (val !== '' && e.target.nextSibling) {
                        e.target.nextSibling.focus();
                      }
                    }
                  }}
                />
              ))}
            </div>
            
            <button className="btn-primary w-full" onClick={handleOtpVerify}>
              Verify & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
