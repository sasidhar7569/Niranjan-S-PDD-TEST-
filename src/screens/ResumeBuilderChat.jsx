import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ArrowLeft, FileText, CheckCircle2, RefreshCw, Copy, Check, Briefcase, GraduationCap, Code, Award, Target, Star, Loader2, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoleData } from '../data/resumeData';

const ResumeBuilderChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // State Machine for the guided workflow
  const [stage, setStage] = useState('initial');
  
  // Stored Data
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [roleData, setRoleData] = useState(null);
  
  // Current active data for cards
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Progress tracking
  const [progress, setProgress] = useState({
    role: false,
    summary: false,
    skills: false,
    education: false,
    projects: false,
    certifications: false,
    experience: false
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, stage]);

  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';

    const initialMsg = {
      id: Date.now(),
      sender: 'bot',
      type: 'text',
      text: `${greeting}! I'm your ATS Resume Assistant. I'll guide you step-by-step to build a highly optimized resume.\n\nTo get started, please tell me your **Target Job Role** and **Target Company** (e.g., "Java Developer at TCS").`,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([initialMsg]);
  }, []);

  const addBotMessage = (messageObj, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        ...messageObj
      }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!inputValue.trim() || stage !== 'initial') return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: userText,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);
    
    setInputValue('');
    
    if (stage === 'initial') {
      // Very basic parsing
      let role = userText;
      let company = '';
      if (userText.toLowerCase().includes(' at ')) {
        [role, company] = userText.split(/ at /i);
      }
      
      setTargetRole(role.trim());
      setTargetCompany(company.trim());
      const data = getRoleData(role.trim());
      setRoleData(data);
      setProgress(p => ({ ...p, role: true }));
      setStage('summary');

      addBotMessage({
        type: 'text',
        text: `Great! I will now help you build an ATS-friendly resume optimized for a **${role.trim()}** role${company ? ` targeting companies like **${company.trim()}**` : ''}.`
      }, 800);

      addBotMessage({
        type: 'summary_card',
        summaryIndex: 0
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- Handlers for Interactive Cards ---

  const handleRephraseSummary = () => {
    if (!roleData) return;
    const nextIndex = (currentSummaryIndex + 1) % roleData.summaries.length;
    setCurrentSummaryIndex(nextIndex);
    
    addBotMessage({
      type: 'summary_card',
      summaryIndex: nextIndex
    }, 600);
  };

  const handleAcceptSummary = () => {
    setProgress(p => ({ ...p, summary: true }));
    setStage('tools');
    
    addBotMessage({
      type: 'text',
      text: "Perfect! I've locked in your professional summary.\n\nNow, let's add the right Tools & Technologies to bypass ATS filters."
    }, 500);
    
    addBotMessage({
      type: 'tools_card'
    }, 1500);
  };

  const handleContinueToSkills = () => {
    setStage('skills');
    // Pre-select all skills initially
    if (roleData) {
      setSelectedSkills([...roleData.programmingLanguages, ...roleData.technicalSkills]);
    }
    
    addBotMessage({
      type: 'text',
      text: "Got it. Let's refine your Technical Skills and Programming Languages. I've pre-selected the most important ones for your role. Uncheck any you aren't comfortable with."
    }, 500);

    addBotMessage({
      type: 'skills_card'
    }, 1500);
  };

  const handleAcceptSkills = () => {
    setProgress(p => ({ ...p, skills: true }));
    setStage('education');
    
    addBotMessage({
      type: 'text',
      text: "Skills saved! Let's move on to your Education."
    }, 500);
    
    addBotMessage({
      type: 'education_form'
    }, 1200);
  };

  const handleAcceptEducation = (eduData) => {
    setProgress(p => ({ ...p, education: true }));
    setStage('experience_check');
    
    addBotMessage({
      type: 'text',
      text: `Education recorded: ${eduData.degree} from ${eduData.college}.\n\nNext up: Experience. Are you a Fresher or Experienced?`
    }, 500);
    
    addBotMessage({
      type: 'experience_check_card'
    }, 1200);
  };

  const handleExperienceType = (type) => {
    if (type === 'fresher') {
      setProgress(p => ({ ...p, experience: true }));
      setStage('projects');
      addBotMessage({
        type: 'text',
        text: "As a Fresher, we'll skip the work experience section and focus heavily on your Academic Projects and Internships instead!"
      }, 500);
      addBotMessage({
        type: 'projects_form'
      }, 1500);
    } else {
      setStage('experience_form');
      addBotMessage({
        type: 'text',
        text: "Please provide your most recent work experience details."
      }, 500);
      addBotMessage({
        type: 'experience_form'
      }, 1200);
    }
  };

  const handleAcceptExperience = (expData) => {
    setProgress(p => ({ ...p, experience: true }));
    setStage('projects');
    
    addBotMessage({
      type: 'text',
      text: `Got it! Generating ATS-friendly bullet points for your role as ${expData.title} at ${expData.company}...`
    }, 500);
    
    addBotMessage({
      type: 'experience_result',
      data: expData
    }, 2000);
    
    addBotMessage({
      type: 'text',
      text: "Now, let's add a key Project to highlight your practical skills."
    }, 3500);
    
    addBotMessage({
      type: 'projects_form'
    }, 4500);
  };

  const handleAcceptProject = (projData) => {
    setProgress(p => ({ ...p, projects: true }));
    setStage('certifications');
    
    addBotMessage({
      type: 'text',
      text: `Expanding your project "${projData.title}" into ATS-optimized bullet points...`
    }, 500);
    
    addBotMessage({
      type: 'project_result',
      data: projData
    }, 2000);
    
    addBotMessage({
      type: 'text',
      text: "Almost done! Let's select some Certifications that match your profile."
    }, 3500);
    
    addBotMessage({
      type: 'certifications_card'
    }, 4500);
  };

  const handleAcceptCertifications = () => {
    setProgress(p => ({ ...p, certifications: true }));
    setStage('keywords');
    
    addBotMessage({
      type: 'text',
      text: "Excellent! Finally, based on your target role and company, I highly recommend embedding these specific ATS Keywords throughout your resume to maximize your matching score."
    }, 500);
    
    addBotMessage({
      type: 'keywords_card'
    }, 1500);
  };

  const handleFinish = () => {
    setStage('done');
    addBotMessage({
      type: 'text',
      text: "🎉 Congratulations! We have successfully gathered and optimized all sections of your resume. You can now preview and download your complete ATS-friendly resume."
    }, 500);
  };

  // --- Renderers for Rich Messages ---

  const renderSummaryCard = (msg) => {
    if (!roleData) return null;
    const summaryText = roleData.summaries[msg.summaryIndex];
    const isLocked = stage !== 'summary' && messages.indexOf(msg) !== messages.length - 1;

    return (
      <div className="bg-slate-800 border border-primary/30 rounded-2xl p-5 shadow-lg w-full max-w-xl">
        <h3 className="text-primary font-bold mb-3 flex items-center gap-2">
          <FileText size={18} /> Professional Summary
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">
          "{summaryText}"
        </p>
        <div className="flex gap-3">
          <button 
            onClick={handleAcceptSummary}
            disabled={isLocked}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition disabled:opacity-50"
          >
            <CheckCircle2 size={16} /> I Like It
          </button>
          <button 
            onClick={handleRephraseSummary}
            disabled={isLocked}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw size={16} /> Rephrase
          </button>
        </div>
      </div>
    );
  };

  const renderToolsCard = (msg) => {
    if (!roleData) return null;
    const isLocked = stage !== 'tools';

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Code size={18} className="text-blue-400" /> Recommended Tools
        </h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {roleData.tools.map(tool => (
            <div key={tool} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
              {tool}
            </div>
          ))}
        </div>
        {!isLocked && (
          <button 
            onClick={handleContinueToSkills}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-bold transition"
          >
            Continue to Skills
          </button>
        )}
      </div>
    );
  };

  const renderSkillsCard = (msg) => {
    if (!roleData) return null;
    const isLocked = stage !== 'skills';

    const toggleSkill = (skill) => {
      if (isLocked) return;
      setSelectedSkills(prev => 
        prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
      );
    };

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Terminal size={18} className="text-emerald-400" /> Technical Skills
        </h3>
        
        <div className="mb-4">
          <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Programming Languages</h4>
          <div className="flex flex-wrap gap-2">
            {roleData.programmingLanguages.map(skill => (
              <button 
                key={skill}
                onClick={() => toggleSkill(skill)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                  selectedSkills.includes(skill) 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-slate-700 text-slate-400 border-transparent hover:bg-slate-600'
                }`}
              >
                {selectedSkills.includes(skill) && <Check size={14} />}
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Frameworks & Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {roleData.technicalSkills.map(skill => (
              <button 
                key={skill}
                onClick={() => toggleSkill(skill)}
                disabled={isLocked}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                  selectedSkills.includes(skill) 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                    : 'bg-slate-700 text-slate-400 border-transparent hover:bg-slate-600'
                }`}
              >
                {selectedSkills.includes(skill) && <Check size={14} />}
                {skill}
              </button>
            ))}
          </div>
        </div>

        {!isLocked && (
          <button 
            onClick={handleAcceptSkills}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-bold transition"
          >
            Save & Continue to Education
          </button>
        )}
      </div>
    );
  };

  const renderEducationForm = (msg) => {
    const isLocked = stage !== 'education';
    return <EducationForm isLocked={isLocked} onSubmit={handleAcceptEducation} />;
  };

  const renderExperienceCheckCard = (msg) => {
    const isLocked = stage !== 'experience_check';
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-sm flex gap-3">
        <button 
          onClick={() => handleExperienceType('fresher')}
          disabled={isLocked}
          className="flex-1 flex flex-col items-center gap-2 bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition disabled:opacity-50"
        >
          <GraduationCap size={24} className="text-blue-400" />
          <span className="font-bold text-white text-sm">Fresher</span>
        </button>
        <button 
          onClick={() => handleExperienceType('experienced')}
          disabled={isLocked}
          className="flex-1 flex flex-col items-center gap-2 bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition disabled:opacity-50"
        >
          <Briefcase size={24} className="text-amber-400" />
          <span className="font-bold text-white text-sm">Experienced</span>
        </button>
      </div>
    );
  };

  const renderExperienceForm = (msg) => {
    const isLocked = stage !== 'experience_form';
    return <ExperienceForm isLocked={isLocked} onSubmit={handleAcceptExperience} />;
  };

  const renderExperienceResult = (msg) => {
    const { data } = msg;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-xl group relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100">
          <Copy size={16} />
        </button>
        <h3 className="text-white font-bold text-lg">{data.title}</h3>
        <p className="text-primary text-sm font-medium mb-3">{data.company} • {data.duration}</p>
        <ul className="list-disc list-outside ml-4 text-slate-300 text-sm space-y-2">
          <li>Engineered scalable solutions and optimized system performance, directly contributing to core business objectives.</li>
          <li>Collaborated with cross-functional teams to integrate modern architectures and deliver high-quality features ahead of schedule.</li>
          <li>Streamlined operational workflows by implementing best practices in {targetRole} methodologies.</li>
        </ul>
      </div>
    );
  };

  const renderProjectsForm = (msg) => {
    const isLocked = stage !== 'projects';
    return <ProjectsForm isLocked={isLocked} onSubmit={handleAcceptProject} />;
  };

  const renderProjectResult = (msg) => {
    const { data } = msg;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-xl group relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100">
          <Copy size={16} />
        </button>
        <h3 className="text-white font-bold text-lg">{data.title}</h3>
        <p className="text-primary text-sm font-medium mb-3">Technologies: {data.tech}</p>
        <ul className="list-disc list-outside ml-4 text-slate-300 text-sm space-y-2">
          <li>Architected and developed a robust application using {data.tech}, improving overall system efficiency.</li>
          <li>{data.desc}</li>
          <li>Implemented secure data handling and responsive design principles, ensuring a seamless user experience.</li>
        </ul>
      </div>
    );
  };

  const renderCertificationsCard = (msg) => {
    if (!roleData) return null;
    const isLocked = stage !== 'certifications';

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Award size={18} className="text-yellow-400" /> Recommended Certifications
        </h3>
        <div className="flex flex-col gap-2 mb-5">
          {roleData.certifications.map((cert, i) => (
            <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${isLocked ? 'opacity-70 pointer-events-none border-slate-700' : 'hover:bg-slate-700 border-slate-700 bg-slate-800/50'}`}>
              <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary bg-slate-900 border-slate-600" defaultChecked={i < 2} disabled={isLocked} />
              <span className="text-sm text-slate-300">{cert}</span>
            </label>
          ))}
        </div>
        {!isLocked && (
          <button 
            onClick={handleAcceptCertifications}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-bold transition"
          >
            Save Certifications
          </button>
        )}
      </div>
    );
  };

  const renderKeywordsCard = (msg) => {
    if (!roleData) return null;
    const isLocked = stage !== 'keywords';

    return (
      <div className="bg-slate-800 border border-primary/30 rounded-2xl p-5 shadow-lg w-full max-w-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={100} />
        </div>
        <h3 className="text-primary font-bold mb-4 flex items-center gap-2 relative z-10">
          <Star size={18} /> ATS Keyword Optimization
        </h3>
        <p className="text-slate-300 text-sm mb-4 relative z-10">
          I will automatically embed these high-value keywords into your final resume PDF to ensure you pass {targetCompany || 'company'} ATS filters.
        </p>
        <div className="flex flex-wrap gap-2 mb-5 relative z-10">
          {roleData.keywords.map(kw => (
            <div key={kw} className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {kw}
            </div>
          ))}
        </div>
        {!isLocked && (
          <button 
            onClick={handleFinish}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-green-500/20 relative z-10"
          >
            Finalize Resume
          </button>
        )}
      </div>
    );
  };

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'text':
        return (
          <div className={`px-5 py-3 rounded-2xl whitespace-pre-wrap ${
            msg.sender === 'user' 
              ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
          }`}>
            {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part)}
          </div>
        );
      case 'summary_card': return renderSummaryCard(msg);
      case 'tools_card': return renderToolsCard(msg);
      case 'skills_card': return renderSkillsCard(msg);
      case 'education_form': return renderEducationForm(msg);
      case 'experience_check_card': return renderExperienceCheckCard(msg);
      case 'experience_form': return renderExperienceForm(msg);
      case 'experience_result': return renderExperienceResult(msg);
      case 'projects_form': return renderProjectsForm(msg);
      case 'project_result': return renderProjectResult(msg);
      case 'certifications_card': return renderCertificationsCard(msg);
      case 'keywords_card': return renderKeywordsCard(msg);
      default: return null;
    }
  };

  const calculateProgress = () => {
    const values = Object.values(progress);
    const completed = values.filter(Boolean).length;
    return Math.round((completed / values.length) * 100);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 absolute inset-0 z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Guided ATS Resume Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                <span className="text-xs text-slate-400 font-medium">Co-pilot Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition flex items-center gap-2">
            <FileText size={16} />
            View Resume
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth hide-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.type === 'text' && (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      msg.sender === 'bot' ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} ${msg.type !== 'text' ? (msg.sender === 'bot' ? 'ml-11' : 'mr-11') : ''}`}>
                    {renderMessageContent(msg)}
                    {msg.type === 'text' && (
                      <span className="text-xs text-slate-500 mt-1 px-1">
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%] flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot size={18} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-slate-800 rounded-tl-none border border-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Progress Tracker Sidebar */}
        <aside className="hidden lg:block w-72 border-l border-white/10 bg-slate-900/50 p-6 overflow-y-auto">
          <div className="sticky top-0">
            <h3 className="font-bold text-white mb-6">AI Resume Completion</h3>
            
            <div className="space-y-3 mb-8">
              <ProgressItem label="Target Role" done={progress.role} />
              <ProgressItem label="Professional Summary" done={progress.summary} />
              <ProgressItem label="Skills & Tools" done={progress.skills} />
              <ProgressItem label="Education" done={progress.education} />
              <ProgressItem label="Experience" done={progress.experience} />
              <ProgressItem label="Projects" done={progress.projects} />
              <ProgressItem label="Certifications" done={progress.certifications} />
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-400">Progress</span>
                <span className="text-xl font-bold text-primary">{calculateProgress()}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-slate-800/80 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto relative lg:mr-[20rem]">
          {stage === 'initial' ? (
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., Java Developer at TCS"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-5 pr-14 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-slate-500 text-center flex items-center justify-center gap-2 italic">
              <Bot size={16} /> Please interact with the cards above to continue.
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

// --- Subcomponents ---

const ProgressItem = ({ label, done }) => (
  <div className={`flex items-center gap-3 transition-colors duration-500 ${done ? 'text-white' : 'text-slate-500'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-500 ${done ? 'bg-primary border-primary' : 'border-slate-600 bg-slate-800'}`}>
      {done && <Check size={12} className="text-white" />}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// Form Component for Education
const EducationForm = ({ isLocked, onSubmit }) => {
  const [data, setData] = useState({ degree: '', college: '', year: '', cgpa: '' });
  
  if (isLocked) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-sm opacity-70">
        <h4 className="font-bold text-white mb-2">{data.degree || 'B.Tech Computer Science'}</h4>
        <p className="text-sm text-slate-300">{data.college || 'Engineering College'} • {data.year || '2024'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-sm">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <GraduationCap size={18} className="text-blue-400" /> Education Details
      </h3>
      <div className="space-y-3 mb-5">
        <input type="text" placeholder="Degree (e.g., B.Tech CSE)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.degree} onChange={e=>setData({...data, degree: e.target.value})} />
        <input type="text" placeholder="College Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.college} onChange={e=>setData({...data, college: e.target.value})} />
        <div className="flex gap-3">
          <input type="text" placeholder="Grad Year" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.year} onChange={e=>setData({...data, year: e.target.value})} />
          <input type="text" placeholder="CGPA (Opt)" className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.cgpa} onChange={e=>setData({...data, cgpa: e.target.value})} />
        </div>
      </div>
      <button onClick={() => onSubmit(data)} disabled={!data.degree || !data.college} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold transition">
        Save Education
      </button>
    </div>
  );
};

// Form Component for Experience
const ExperienceForm = ({ isLocked, onSubmit }) => {
  const [data, setData] = useState({ company: '', title: '', duration: '', desc: '' });
  
  if (isLocked) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-sm opacity-70">
        <h4 className="font-bold text-white mb-1">{data.title}</h4>
        <p className="text-sm text-slate-300">{data.company} • {data.duration}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-sm">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Briefcase size={18} className="text-amber-400" /> Work Experience
      </h3>
      <div className="space-y-3 mb-5">
        <input type="text" placeholder="Company Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.company} onChange={e=>setData({...data, company: e.target.value})} />
        <input type="text" placeholder="Job Title" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.title} onChange={e=>setData({...data, title: e.target.value})} />
        <input type="text" placeholder="Duration (e.g., Jan 2022 - Present)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.duration} onChange={e=>setData({...data, duration: e.target.value})} />
        <textarea placeholder="Briefly describe your responsibilities..." rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" value={data.desc} onChange={e=>setData({...data, desc: e.target.value})}></textarea>
      </div>
      <button onClick={() => onSubmit(data)} disabled={!data.company || !data.title} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold transition">
        Generate AI Bullet Points
      </button>
    </div>
  );
};

// Form Component for Projects
const ProjectsForm = ({ isLocked, onSubmit }) => {
  const [data, setData] = useState({ title: '', tech: '', desc: '' });
  
  if (isLocked) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 w-full max-w-sm opacity-70">
        <h4 className="font-bold text-white mb-1">{data.title}</h4>
        <p className="text-sm text-slate-300">Tech: {data.tech}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg w-full max-w-sm">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Code size={18} className="text-primary" /> Add Project
      </h3>
      <div className="space-y-3 mb-5">
        <input type="text" placeholder="Project Title" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.title} onChange={e=>setData({...data, title: e.target.value})} />
        <input type="text" placeholder="Technologies Used" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" value={data.tech} onChange={e=>setData({...data, tech: e.target.value})} />
        <textarea placeholder="One-line description..." rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" value={data.desc} onChange={e=>setData({...data, desc: e.target.value})}></textarea>
      </div>
      <button onClick={() => onSubmit(data)} disabled={!data.title || !data.tech} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold transition">
        Expand into Bullet Points
      </button>
    </div>
  );
};

export default ResumeBuilderChat;
