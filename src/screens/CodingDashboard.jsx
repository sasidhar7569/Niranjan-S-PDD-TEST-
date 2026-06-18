import React, { useState, useEffect } from 'react';
import { CheckCircle, Code2, AlertCircle, Building2 } from 'lucide-react';

export const companiesData = [
  {
    name: 'Apple',
    domain: 'apple.com',
    topics: {
      Easy: [
        { id: 'app-e1', name: 'Arrays & Strings' },
        { id: 'app-e2', name: 'Two Pointers' },
        { id: 'app-e3', name: 'Linked Lists' },
        { id: 'app-e4', name: 'Math & Geometry' }
      ],
      Medium: [
        { id: 'app-m1', name: 'Trees & Graphs' },
        { id: 'app-m2', name: 'Sliding Window' },
        { id: 'app-m3', name: 'Intervals' },
        { id: 'app-m4', name: 'Matrix' }
      ],
      Hard: [
        { id: 'app-h1', name: 'Advanced DP' },
        { id: 'app-h2', name: 'Hard Graphs' },
        { id: 'app-h3', name: 'Tries' }
      ]
    }
  },
  {
    name: 'Google',
    domain: 'google.com',
    topics: {
      Easy: [
        { id: 'goo-e1', name: 'Hash Maps' },
        { id: 'goo-e2', name: 'Binary Search' },
        { id: 'goo-e3', name: 'Bit Manipulation' }
      ],
      Medium: [
        { id: 'goo-m1', name: 'Dynamic Programming' },
        { id: 'goo-m2', name: 'Graph Traversal (BFS/DFS)' },
        { id: 'goo-m3', name: 'Tries & Strings' },
        { id: 'goo-m4', name: 'Heaps & Priority Queues' }
      ],
      Hard: [
        { id: 'goo-h1', name: 'Segment Trees' },
        { id: 'goo-h2', name: 'Binary Lifting' },
        { id: 'goo-h3', name: 'Advanced Math' }
      ]
    }
  },
  {
    name: 'Microsoft',
    domain: 'microsoft.com',
    topics: {
      Easy: [
        { id: 'ms-e1', name: 'Linked Lists' },
        { id: 'ms-e2', name: 'Trees (Basic)' },
        { id: 'ms-e3', name: 'Strings' }
      ],
      Medium: [
        { id: 'ms-m1', name: 'System Design Basics' },
        { id: 'ms-m2', name: 'Binary Search Trees' },
        { id: 'ms-m3', name: 'Backtracking' },
        { id: 'ms-m4', name: 'Greedy Algorithms' }
      ],
      Hard: [
        { id: 'ms-h1', name: 'Advanced System Design' },
        { id: 'ms-h2', name: 'Tries' },
        { id: 'ms-h3', name: 'Hard DP' }
      ]
    }
  },
  {
    name: 'IBM',
    domain: 'ibm.com',
    topics: {
      Easy: [
        { id: 'ibm-e1', name: 'Loops & Conditions' },
        { id: 'ibm-e2', name: 'Basic SQL' },
        { id: 'ibm-e3', name: 'Arrays' }
      ],
      Medium: [
        { id: 'ibm-m1', name: 'Queues & Stacks' },
        { id: 'ibm-m2', name: 'Object Oriented Programming' },
        { id: 'ibm-m3', name: 'Database Normalization' }
      ],
      Hard: [
        { id: 'ibm-h1', name: 'Cloud Architecture Basics' },
        { id: 'ibm-h2', name: 'Complex SQL Queries' }
      ]
    }
  },
  {
    name: 'JPMorgan',
    domain: 'jpmorganchase.com',
    topics: {
      Easy: [
        { id: 'jpm-e1', name: 'Basic Math' },
        { id: 'jpm-e2', name: 'String Manipulation' },
        { id: 'jpm-e3', name: 'Sorting' }
      ],
      Medium: [
        { id: 'jpm-m1', name: 'Hash Tables' },
        { id: 'jpm-m2', name: 'Financial Algorithms' },
        { id: 'jpm-m3', name: 'Data Structures' }
      ],
      Hard: [
        { id: 'jpm-h1', name: 'Dynamic Programming' },
        { id: 'jpm-h2', name: 'Graph Algorithms' },
        { id: 'jpm-h3', name: 'Concurrency & Multithreading' }
      ]
    }
  }
];

const CodingDashboard = () => {
  const userName = localStorage.getItem('userName') || 'John';
  const [filteredCompaniesData, setFilteredCompaniesData] = useState(companiesData);
  const [activeCompanyObj, setActiveCompanyObj] = useState(companiesData[0]);
  const [completedTopics, setCompletedTopics] = useState({});

  useEffect(() => {
    const loadTargets = () => {
      const saved = localStorage.getItem('targetCompanies');
      let targets = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            targets = parsed;
          }
        } catch (e) {}
      }
      
      if (targets.length > 0) {
        const filtered = companiesData.filter(c => targets.includes(c.name));
        if (filtered.length > 0) {
          setFilteredCompaniesData(filtered);
          setActiveCompanyObj(prev => {
            if (filtered.find(f => f.name === prev?.name)) return prev;
            return filtered[0];
          });
        } else {
          setFilteredCompaniesData([]);
        }
      } else {
        setFilteredCompaniesData([]);
      }
    };
    loadTargets();
    window.addEventListener('targetCompaniesUpdated', loadTargets);
    return () => window.removeEventListener('targetCompaniesUpdated', loadTargets);
  }, []);

  // Load progress for specific user and company
  useEffect(() => {
    const storageKey = `codingProgress_${userName}_${activeCompanyObj.name}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setCompletedTopics(JSON.parse(stored));
    } else {
      setCompletedTopics({});
    }
  }, [activeCompanyObj.name, userName]);

  const toggleTopic = (topicId) => {
    const storageKey = `codingProgress_${userName}_${activeCompanyObj.name}`;
    const newStatus = !completedTopics[topicId];
    const updated = { ...completedTopics, [topicId]: newStatus };
    setCompletedTopics(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    Object.values(activeCompanyObj.topics).forEach(difficultyList => {
      total += difficultyList.length;
      difficultyList.forEach(t => {
        if (completedTopics[t.id]) completed++;
      });
    });
    return Math.round((completed / total) * 100) || 0;
  };

  const getCompanyLogoUrl = (domain) => {
    return `https://logo.clearbit.com/${domain}`;
  };

  if (!activeCompanyObj) {
    return (
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textMain mb-2">Company-Wise Topics Preparation</h1>
          <p className="text-secondary text-lg">Track your preparation progress for specific target companies.</p>
        </div>
        <div className="card text-center py-16 flex flex-col items-center border-dashed border-2 border-slate-700 bg-transparent">
          <Building2 size={64} className="text-slate-600 mb-6" />
          <h2 className="text-2xl font-bold mb-3">No Target Companies Selected</h2>
          <p className="text-secondary max-w-md">You haven't selected any dream companies yet. Please update your profile to see tailored preparation paths.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Company-Wise Topics Preparation</h1>
        <p className="text-secondary text-lg">Track your preparation progress for specific target companies.</p>
      </div>

      {/* Company Selector */}
      <div className="mb-8">
        <div className="flex gap-3 w-full overflow-x-auto hide-scrollbar pb-2">
          {filteredCompaniesData.map(company => (
            <button 
              key={company.name}
              className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all flex-shrink-0 ${
                activeCompanyObj.name === company.name 
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(192,38,211,0.4)] transform -translate-y-1' 
                : 'bg-slate-800 text-secondary hover:bg-slate-700'
              }`}
              onClick={() => setActiveCompanyObj(company)}
            >
              <Building2 size={18} />
              {company.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-8 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-l-primary">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Target: {activeCompanyObj.name}</h2>
            <p className="text-sm text-secondary">Complete all topics to secure your readiness for {activeCompanyObj.name}'s assessment rounds.</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Completion</span>
            <span className="text-2xl font-bold text-primary">{calculateProgress()}%</span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
            <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full transform -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-color)" strokeWidth="4" strokeDasharray={`${calculateProgress()}, 100`} />
            </svg>
            <Code2 size={20} className="text-secondary" />
          </div>
        </div>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Easy Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Easy Topics</h3>
          </div>
          {activeCompanyObj.topics.Easy.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold ${completedTopics[topic.id] ? 'text-green-400' : 'text-textMain'}`}>{topic.name}</span>
              <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                completedTopics[topic.id] ? 'bg-green-500 border-green-500 text-white' : 'border-slate-500 text-transparent'
              }`}>
                <CheckCircle size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Medium Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Medium Topics</h3>
          </div>
          {activeCompanyObj.topics.Medium.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold ${completedTopics[topic.id] ? 'text-yellow-400' : 'text-textMain'}`}>{topic.name}</span>
              <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                completedTopics[topic.id] ? 'bg-yellow-500 border-yellow-500 text-white' : 'border-slate-500 text-transparent'
              }`}>
                <CheckCircle size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Hard Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Hard Topics</h3>
          </div>
          {activeCompanyObj.topics.Hard.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold ${completedTopics[topic.id] ? 'text-red-400' : 'text-textMain'}`}>{topic.name}</span>
              <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                completedTopics[topic.id] ? 'bg-red-500 border-red-500 text-white' : 'border-slate-500 text-transparent'
              }`}>
                <CheckCircle size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default CodingDashboard;
