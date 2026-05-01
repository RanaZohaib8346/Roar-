import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, ChevronRight, Search } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '../constants/languages';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lang: Language, path?: string) => void;
  currentLangId?: string;
}

const COURSE_PATHS = [
  { id: 'beginner', title: 'Beginner', description: 'Start from the very basics. No prior knowledge needed.', icon: '🌱', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'basic', title: 'Basic', description: 'Strengthen your core. Perfect for quick refreshers.', icon: '📘', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'pro', title: 'Pro', description: 'Accelerated path. Focus on mastery and deep fluency.', icon: '⚡', color: 'bg-purple-50 text-purple-600 border-purple-100' },
];

export default function LanguageSelector({ isOpen, onClose, onSelect, currentLangId }: LanguageSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  const filtered = SUPPORTED_LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLang = (lang: Language) => {
    setSelectedLang(lang);
  };

  const handleSelectPath = (pathId: string) => {
    if (selectedLang) {
      onSelect(selectedLang, pathId);
      setSelectedLang(null);
      setSearch('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              setSelectedLang(null);
            }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed inset-x-4 top-24 bottom-auto lg:top-1/2 lg:inset-auto lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 bg-white rounded-3xl shadow-2xl z-[110] flex flex-col overflow-hidden border border-border transition-all duration-500",
              selectedLang ? "lg:max-w-md h-auto" : "lg:max-w-xl h-[500px]"
            )}
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className={cn("p-4 lg:p-6 border-b border-border flex flex-col bg-slate-50 transition-all duration-300", selectedLang ? "gap-1 py-3" : "gap-6")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-xl flex items-center justify-center text-primary transition-all", selectedLang ? "w-6 h-6 bg-transparent" : "w-10 h-10 bg-primary/10")}>
                    <Globe size={selectedLang ? 16 : 24} />
                  </div>
                  <div>
                    <h2 className={cn("font-bold transition-all", selectedLang ? "text-base" : "text-xl")}>{selectedLang ? `Path for ${selectedLang.name}` : 'Pick a Course'}</h2>
                    <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">{selectedLang ? 'Select intensity' : 'Expand your horizons'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (selectedLang) setSelectedLang(null);
                    else onClose();
                  }}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X size={20} className="text-text-muted transition-transform active:scale-90" />
                </button>
              </div>

              {!selectedLang && (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="Search over 20 languages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all"
                  />
                </div>
              )}
            </div>

            <div className={cn("overflow-y-auto custom-scrollbar", selectedLang ? "p-4" : "p-3 lg:p-4 flex-1")}>
              {!selectedLang ? (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3"
                >
                  {filtered.map((lang) => (
                    <motion.button
                      variants={{
                        hidden: { opacity: 0, scale: 0.9, y: 10 },
                        visible: { opacity: 1, scale: 1, y: 0 }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={lang.id}
                      onClick={() => handleSelectLang(lang)}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group
                        ${currentLangId === lang.id ? 'border-primary bg-primary/5' : 'border-white hover:border-slate-100 hover:bg-slate-50 bg-white shadow-xs'}
                      `}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-left flex-1">
                        <div className="font-bold text-text-main">{lang.name}</div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{lang.nativeName}</div>
                      </div>
                      <ChevronRight size={16} className={`text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all`} />
                    </motion.button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-sm font-bold text-text-muted">No languages found for "{search}"</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-3 py-2"
                >
                  {COURSE_PATHS.map((path) => (
                    <motion.button
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      whileTap={{ scale: 0.99 }}
                      key={path.id}
                      onClick={() => handleSelectPath(path.id)}
                      className="w-full sleek-card p-3 lg:p-4 flex items-center gap-3 lg:gap-4 group hover:border-primary transition-all text-left"
                    >
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-lg lg:rounded-xl flex items-center justify-center text-xl lg:text-2xl shadow-xs border ${path.color} group-hover:scale-105 transition-transform`}>
                        {path.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm lg:text-base font-black text-text-main mb-0">{path.title}</h4>
                        <p className="text-[10px] lg:text-xs text-text-muted font-medium line-clamp-1 opacity-80">{path.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                  
                  <button 
                    onClick={() => setSelectedLang(null)}
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors text-center"
                  >
                    ← Back to language list
                  </button>
                </motion.div>
              )}
            </div>

            {!selectedLang && (
              <div className="p-3 bg-slate-50 border-t border-border flex justify-center">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em]">More languages coming soon</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
