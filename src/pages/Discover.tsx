import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Globe, Zap, BookOpen, Users, Sparkles, Trophy, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { name: 'Travel', icon: Globe, color: 'bg-blue-500' },
  { name: 'Business', icon: Zap, color: 'bg-primary' },
  { name: 'Culture', icon: Sparkles, color: 'bg-accent' },
  { name: 'Slang', icon: Users, color: 'bg-pink-500' },
];

const GUIDES = [
  { title: 'The Science of Spaced Repetition', type: 'ARTICLE', icon: BookOpen },
  { title: 'Choosing Your First Second Language', type: 'GUIDE', icon: Compass },
  { title: 'Polyglot Habits: Speak from Day 1', type: 'INTERVIEW', icon: Users },
  { title: 'Japanese Honorifics: A Deep Dive', type: 'ARTICLE', icon: Sparkles },
  { title: 'Mastering French Subjunctive', type: 'GUIDE', icon: BookOpen },
  { title: 'Negotiation in Business English', type: 'ARTICLE', icon: Zap },
  { title: 'Spanish Idioms for Daily Life', type: 'INTERVIEW', icon: Users },
];

export default function Discover() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const filteredGuides = GUIDES.filter(item => 
    (item.title.toLowerCase().includes(search.toLowerCase()) || 
     item.type.toLowerCase().includes(search.toLowerCase()))
  );

  const handleJoinChallenge = () => {
    if (hasJoinedChallenge) {
      toast("You're already in the leaderboard!", { icon: '🚀' });
      return;
    }
    setHasJoinedChallenge(true);
    toast.success("Welcome to the Challenge! Go learn to earn extra Gems.");
  };

  const handleGuideClick = (title: string) => {
    toast(`Learning Guide: "${title}" is loading...`, {
      icon: '📚',
    });
  };

  return (
    <div className="space-y-12 pb-20 px-4 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 pt-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black font-display text-text-main mb-4 leading-[1.1] tracking-tight">
            Explore <span className="text-primary italic">new</span> worlds
          </h1>
          <p className="text-text-muted font-medium text-lg leading-relaxed max-w-md">
            Dive into cultural insights, language hacks, and expert guides curated just for you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-80">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-3xl py-4 pl-12 pr-6 text-sm font-semibold focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Trending Topics</h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`
                sleek-card p-8 flex flex-col items-center gap-5 group cursor-pointer transition-all relative overflow-hidden h-full rounded-[2.5rem]
                ${selectedCategory === cat.name ? 'border-primary bg-primary/[0.03] shadow-[0_20px_50px_rgba(86,195,139,0.1)]' : 'hover:border-slate-200 hover:bg-slate-50/50 shadow-sm'}
              `}
            >
              <div className={cn(
                "p-5 rounded-3xl text-white transition-all duration-500 group-hover:scale-110",
                cat.color,
                "shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_-4px_0_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.3)]"
              )}>
                <cat.icon size={28} className="drop-shadow-md" />
              </div>
              <span className="font-extrabold text-sm uppercase tracking-widest text-text-main">{cat.name}</span>
              
              {/* Subtle accent background line */}
              <div className={`absolute bottom-0 left-0 w-full h-1.5 transition-all duration-500 ${selectedCategory === cat.name ? cat.color : 'bg-transparent opacity-0 group-hover:opacity-100 group-hover:h-1'}`} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Community Challenge */}
      <section className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden group shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/5 shadow-2xl">
             <Trophy size={14} className="text-amber-400" />
             Summer Event Live
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-display mb-6 md:mb-8 leading-[1.05] tracking-tight">Summer<br /><span className="text-primary italic">Speedrun</span></h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-10 md:mb-12">
            Level up your skills this summer. Complete 10 original lessons and claim your <span className="text-white font-bold underline decoration-primary decoration-4 underline-offset-4">5,000 Gems</span> reward.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-5">
            <button 
              onClick={handleJoinChallenge}
              className={`
                font-black text-[11px] uppercase tracking-[0.15em] px-8 md:px-12 py-5 md:py-6 rounded-2.5xl md:rounded-[2rem] transition-all shadow-2xl
                ${hasJoinedChallenge ? 'bg-emerald-500 text-white cursor-default' : 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:scale-105 active:scale-100'}
              `}
            >
              {hasJoinedChallenge ? '✓ Already In' : 'Join the Race'}
            </button>
            <button 
              onClick={() => setShowRules(!showRules)}
              className="bg-white/5 hover:bg-white/10 text-white font-black text-[11px] uppercase tracking-[0.15em] px-8 md:px-12 py-5 md:py-6 rounded-2.5xl md:rounded-[2rem] transition-all backdrop-blur-md border border-white/10"
            >
              {showRules ? 'Hide Rules' : 'See Details'}
            </button>
          </div>

          <AnimatePresence>
            {showRules && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-12 overflow-hidden"
              >
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-primary font-black mb-4 text-[11px] uppercase tracking-[0.3em]">Requirements</h4>
                    <ul className="text-slate-300 text-sm space-y-4 font-medium opacity-80">
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Finish 10 new lessons</li>
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Keep a 7-day streak</li>
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> No lesson skips</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-accent font-black mb-4 text-[11px] uppercase tracking-[0.3em]">Rewards</h4>
                    <ul className="text-slate-300 text-sm space-y-4 font-medium opacity-80">
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> 5,000 Rare Gems</li>
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> "Flash" profile badge</li>
                       <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Summer UI Theme</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.05] pointer-events-none transform translate-x-20 scale-125 lg:scale-150 rotate-12 group-hover:rotate-0 duration-[2000ms]">
           <Compass size={500} />
        </div>
      </section>

      {/* Recommended Articles */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black font-display text-text-main">Popular Guides</h2>
          <button 
            onClick={() => {
              setSearch('');
              setSelectedCategory(null);
              toast.success("Filters reset!", { icon: '✨' });
            }}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-all"
          >
            Show Everything
          </button>
        </div>
        
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGuideClick(item.title)}
                className="group cursor-pointer"
              >
                <div className="sleek-card p-8 flex items-center justify-between bg-white hover:bg-primary/[0.02] border-2 border-slate-50 hover:border-primary/20 transition-all rounded-[2.5rem] h-full shadow-sm hover:shadow-xl hover:shadow-primary/5">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-white text-slate-400 group-hover:text-primary transition-all shadow-inner border border-transparent group-hover:border-slate-100 group-hover:scale-110 duration-500">
                        <item.icon size={28} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{item.type}</div>
                        <h4 className="text-xl font-bold text-text-main leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Search size={32} />
             </div>
             <p className="text-lg font-bold text-slate-400">Oops! No guides match your search.</p>
             <button 
               onClick={() => setSearch('')}
               className="mt-4 text-xs font-black text-primary uppercase tracking-[0.2em] hover:underline"
             >
               Clear Search
             </button>
          </div>
        )}
      </section>
    </div>
  );
}
