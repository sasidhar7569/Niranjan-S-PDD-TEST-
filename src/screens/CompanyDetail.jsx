import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, Map, ChevronRight, ArrowLeft, Brain, Code, Terminal, Server, Star, Users } from 'lucide-react';

const companiesData = {
  tcs: {
    name: 'Tata Consultancy Services',
    logo: 'T',
    color: '#3b82f6',
    industry: 'Service Based • MNC',
    description: 'A global leader in IT services, consulting & business solutions.',
    roles: {
      'Ninja': [
        { step: 1, title: 'Basic Aptitude & Logical Reasoning', desc: 'Focus heavily on quantitative aptitude, percentages, profit & loss, and basic logical deductions.', icon: Brain },
        { step: 2, title: 'Core Subjects (Fundamentals)', desc: 'Brush up on basic DBMS (SQL queries), Operating Systems, and Computer Networks.', icon: Server },
        { step: 3, title: 'Basic Programming', desc: 'Learn standard algorithms: arrays, strings, basic sorting. Languages: C, C++, or Java.', icon: Code },
        { step: 4, title: 'Verbal Ability', desc: 'Practice sentence correction, reading comprehension, and vocabulary.', icon: Users }
      ],
      'Digital': [
        { step: 1, title: 'Advanced Coding (DSA)', desc: 'Master dynamic programming, graphs, trees, and advanced data structures.', icon: Code },
        { step: 2, title: 'New Age Technologies', desc: 'Understanding of Cloud, IoT, AI/ML basics, or Data Analytics is highly preferred.', icon: Terminal },
        { step: 3, title: 'System Design Basics', desc: 'Understand scalability, microservices vs monolith, and basic architecture.', icon: Server },
        { step: 4, title: 'Complex Aptitude', desc: 'High-level puzzle solving and complex reasoning questions.', icon: Brain }
      ]
    }
  },
  infy: {
    name: 'Infosys',
    logo: 'I',
    color: '#10b981',
    industry: 'Service Based • MNC',
    description: 'A global leader in next-generation digital services and consulting.',
    roles: {
      'System Engineer': [
        { step: 1, title: 'Mathematical & Logical Reasoning', desc: 'Cryptarithmetic puzzles, syllogisms, and data sufficiency.', icon: Brain },
        { step: 2, title: 'Pseudocode & Basics', desc: 'Tracing loops, conditional statements, and bitwise operations.', icon: Terminal },
        { step: 3, title: 'Easy Level Coding', desc: 'String manipulation, array traversal, and basic pattern printing.', icon: Code }
      ],
      'Specialist Programmer': [
        { step: 1, title: 'Competitive Programming', desc: 'Focus on CodeChef/Codeforces medium level problems. Heavy emphasis on optimization.', icon: Code },
        { step: 2, title: 'Advanced DBMS', desc: 'Complex SQL queries, normalization, indexing, and transaction management.', icon: Server },
        { step: 3, title: 'Full Stack Knowledge', desc: 'Basic understanding of frontend and backend integration.', icon: Terminal }
      ]
    }
  },
  amazon: {
    name: 'Amazon',
    logo: 'A',
    color: '#f59e0b',
    industry: 'Product Based • FAANG',
    description: 'Multinational technology company focusing on e-commerce, cloud computing, and AI.',
    roles: {
      'SDE-1': [
        { step: 1, title: 'Data Structures & Algorithms', desc: 'LeetCode Medium/Hard. Focus on Trees, Graphs, DP, and Sliding Window.', icon: Code },
        { step: 2, title: 'CS Fundamentals', desc: 'In-depth OS (threads, locks, deadlocks) and Networking protocols.', icon: Server },
        { step: 3, title: 'Amazon Leadership Principles', desc: 'Prepare STAR method stories for all 16 leadership principles.', icon: Users }
      ],
      'SDE-2': [
        { step: 1, title: 'High-Level System Design (HLD)', desc: 'Design distributed systems, load balancing, caching, and database sharding.', icon: Map },
        { step: 2, title: 'Low-Level Design (LLD)', desc: 'Design patterns, SOLID principles, and object-oriented design.', icon: Terminal },
        { step: 3, title: 'Advanced DSA', desc: 'Complex algorithmic optimization and time-complexity limits.', icon: Code },
        { step: 4, title: 'Deep Dive Leadership', desc: 'Handling conflict, delivering results under pressure, and mentoring.', icon: Users }
      ]
    }
  },
  cogni: {
    name: 'Cognizant',
    logo: 'C',
    color: '#8b5cf6',
    industry: 'Service Based • MNC',
    description: 'Leading provider of IT services, digital transformation, and consulting.',
    roles: {
      'GenC': [
        { step: 1, title: 'Quantitative Aptitude', desc: 'Time & work, speed & distance, profit & loss.', icon: Brain },
        { step: 2, title: 'Automata Fix', desc: 'Debugging existing code, fixing syntax errors, and completing missing logic.', icon: Terminal },
        { step: 3, title: 'Basic SQL', desc: 'Joins, group by, and basic data retrieval.', icon: Server }
      ],
      'GenC Elevate': [
        { step: 1, title: 'Skill Based Coding', desc: 'Java/Python specific coding questions requiring language deep knowledge.', icon: Code },
        { step: 2, title: 'DBMS & Query Optimization', desc: 'Writing optimal queries and understanding database relationships.', icon: Server },
        { step: 3, title: 'Technical HR', desc: 'Project discussions, role-playing, and technical scenario questions.', icon: Users }
      ]
    }
  }
};

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const company = companiesData[id];
  const roleKeys = company ? Object.keys(company.roles) : [];
  
  const [activeRole, setActiveRole] = useState(roleKeys[0]);

  useEffect(() => {
    if (roleKeys.length > 0) {
      setActiveRole(roleKeys[0]);
    }
  }, [id]);

  if (!company) {
    return <div className="page-container text-white">Company not found.</div>;
  }

  const currentRoadmap = company.roles[activeRole] || [];

  return (
    <div className="page-container">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Companies
        </button>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg font-bold text-4xl" style={{ background: `${company.color}20`, color: company.color, border: `1px solid ${company.color}40` }}>
            {company.logo}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-textMain mb-2">{company.name}</h1>
            <p className="text-secondary mb-3 max-w-2xl">{company.description}</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-textMuted">
              <span className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full"><Building size={14} /> {company.industry}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-8">
        <h2 className="text-xl font-bold mb-4">Select Target Role</h2>
        <div className="flex flex-wrap gap-4 border-b border-slate-700 pb-2">
          {roleKeys.map(role => (
            <button 
              key={role}
              className={`pb-3 font-semibold text-lg px-4 border-b-2 transition-all ${activeRole === role ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-white'}`}
              onClick={() => setActiveRole(role)}
            >
              {role} Role
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in">
        <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-2">Learning Path for {activeRole}</h3>
          <p className="text-secondary text-sm">Follow this roadmap strictly to clear the {activeRole} profile assessment at {company.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-700/50 transform -translate-x-1/2 rounded-full"></div>
          
          {currentRoadmap.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className={`card border border-slate-700/50 hover:border-primary/50 transition-colors relative ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-4 border-primary items-center justify-center text-xs font-bold text-primary z-10 ${index % 2 === 0 ? '-right-4' : '-left-4'}`}>
                  {item.step}
                </div>
                
                <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-secondary">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CompanyDetail;
