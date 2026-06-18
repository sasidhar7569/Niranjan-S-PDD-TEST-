import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Target, Code, Brain, LineChart, Briefcase, Building } from 'lucide-react';

const SetupWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const roles = [
    { id: 'sde', name: 'Software Engineer', icon: Code, color: '#3b82f6' },
    { id: 'data', name: 'Data Analyst', icon: LineChart, color: '#10b981' },
    { id: 'core', name: 'Core Engineering', icon: Briefcase, color: '#f59e0b' },
    { id: 'consulting', name: 'Consultant', icon: Brain, color: '#8b5cf6' }
  ];

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture',
    'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Bloomberg'
  ];

  const toggleCompany = (comp) => {
    if (selectedCompanies.includes(comp)) {
      setSelectedCompanies(selectedCompanies.filter(c => c !== comp));
    } else {
      if (selectedCompanies.length < 5) {
        setSelectedCompanies([...selectedCompanies, comp]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800/80 p-4" style={{ background: 'var(--background-color)' }}>
      <div className="card w-full max-w-2xl bg-slate-800/50 shadow-lg p-8">
        
        {step === 1 && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary" style={{ background: 'var(--primary-light)' }}>
              <Target size={48} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">What is your Dream Role?</h1>
            <p className="text-secondary text-center mb-8">We will tailor your preparation dashboard based on this goal.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
              {roles.map(r => {
                const Icon = r.icon;
                return (
                  <div 
                    key={r.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${role === r.id ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-blue-300'}`}
                    style={{ 
                      borderColor: role === r.id ? 'var(--primary-color)' : '',
                      background: role === r.id ? 'var(--primary-light)' : ''
                    }}
                    onClick={() => setRole(r.id)}
                  >
                    <div className="p-3 rounded-lg" style={{ background: `${r.color}15`, color: r.color }}>
                      <Icon size={24} />
                    </div>
                    <span className="font-semibold text-lg">{r.name}</span>
                  </div>
                );
              })}
            </div>

            <button 
              className="btn-primary w-full md:w-auto md:px-12 py-3 text-lg"
              disabled={!role}
              onClick={() => setStep(2)}
              style={{ opacity: !role ? 0.5 : 1 }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-2 text-center">Academic Details</h1>
            <p className="text-secondary text-center mb-8">Just a few more details to set up your profile.</p>

            <div className="w-full max-w-md flex flex-col gap-5 mb-8">
              <div className="form-group mb-0">
                <label className="form-label">Graduation Year</label>
                <select className="form-input bg-slate-800/50 appearance-auto">
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Current CGPA</label>
                <input type="number" className="form-input" placeholder="e.g. 8.5" />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Primary Programming Language</label>
                <select className="form-input bg-slate-800/50 appearance-auto">
                  <option>Java</option>
                  <option>Python</option>
                  <option>C++</option>
                  <option>JavaScript</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-md">
              <button className="btn-outline flex-1 py-3" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary flex-1 py-3" onClick={() => setStep(3)}>Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary" style={{ background: 'var(--primary-light)' }}>
              <Building size={48} />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center">Target Companies</h1>
            <p className="text-secondary text-center mb-6">Select up to 5 companies you are aiming for.</p>

            <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-xl">
              {companies.map(comp => (
                <button
                  key={comp}
                  onClick={() => toggleCompany(comp)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedCompanies.includes(comp) 
                    ? 'bg-primary text-white border-primary shadow-md' 
                    : 'bg-slate-800/50 border-slate-600 text-textMuted hover:border-slate-400'
                  }`}
                  style={{ background: selectedCompanies.includes(comp) ? 'var(--primary-color)' : '' }}
                >
                  {comp}
                </button>
              ))}
            </div>

            <p className="text-sm text-secondary mb-8">{selectedCompanies.length}/5 Selected</p>

            <div className="flex gap-4 w-full max-w-md">
              <button className="btn-outline flex-1 py-3" onClick={() => setStep(2)}>Back</button>
              <button 
                className="btn-primary flex-1 py-3" 
                onClick={() => {
                  localStorage.setItem('targetCompanies', JSON.stringify(selectedCompanies));
                  setStep(4);
                }}
                disabled={selectedCompanies.length === 0}
                style={{ opacity: selectedCompanies.length === 0 ? 0.5 : 1 }}
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
            <CheckCircle size={80} color="var(--success-color)" className="mb-6" />
            <h1 className="text-3xl font-bold mb-4">You're All Set!</h1>
            <p className="text-secondary mb-8 text-lg max-w-md">Your personalized dashboard for the {roles.find(r => r.id === role)?.name} role has been created.</p>
            <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/home')}>
              Go to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SetupWizard;
