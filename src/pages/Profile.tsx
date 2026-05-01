import React from 'react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Zap, Target, Search, ChevronRight, Trophy, Award, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LanguageSelector from '../components/LanguageSelector';
import { updateCourse } from '../services/authService';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleLevelChange = async (lang: any, pathId?: string) => {
    if (user) {
      await updateCourse(user.uid, lang.id, pathId || 'beginner');
      setIsSelectorOpen(false);
    }
  };

  if (!profile) return null;

  const stats = [
    { label: 'Longest Streak', value: `${profile.streak} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Total XP', value: profile.totalXP.toLocaleString(), icon: Award, color: 'text-primary' },
    { label: 'Current League', value: 'Silver', icon: Trophy, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 mb-16 md:mb-20 p-8 md:p-12 bg-white border-2 border-slate-50 rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 transition-transform duration-[2000ms] group-hover:rotate-45" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full -ml-20 -mb-20 transition-transform duration-[3000ms] group-hover:-rotate-45" />

        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-32 md:w-40 h-32 md:h-40 rounded-2.5xl md:rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white ring-4 ring-slate-50 relative z-10"
          >
             <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt={profile.displayName} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-3 -right-3 w-10 md:w-14 h-10 md:h-14 bg-emerald-500 border-4 border-white rounded-xl md:rounded-2.5xl flex items-center justify-center shadow-2xl z-20"
          >
             <div className="w-2 md:w-3 h-2 md:h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
          </motion.div>
        </div>
        
        <div className="text-center md:text-left relative z-10 flex-1">
          <motion.h1 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-black font-display text-text-main mb-3 tracking-tighter leading-none"
          >
            {profile.displayName}
          </motion.h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 md:mb-8">
            <p className="text-slate-400 font-extrabold text-[9px] md:text-[10px] uppercase tracking-[0.4em] flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl">
              <Shield size={12} className="text-primary fill-current" />
              Mastery Lvl 42
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
             <span className="px-5 py-2.5 md:px-6 md:py-3 bg-primary/10 text-primary-dark font-black rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] border-2 border-primary/5 shadow-inner">Silver League</span>
             <span className="px-5 py-2.5 md:px-6 md:py-3 bg-amber-500/10 text-amber-600 font-black rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] border-2 border-amber-500/5 shadow-inner flex items-center gap-2">
               <Zap size={10} className="fill-current animate-pulse" />
               Global Top 1%
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white p-10 group relative overflow-hidden rounded-[3rem] border-2 border-slate-50 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] hover:-translate-y-2"
          >
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className={cn("p-4 rounded-2.5xl transition-transform duration-500 group-hover:rotate-12", 
                stat.color === 'text-primary' ? 'bg-primary/10 shadow-[inset_0_2px_4px_rgba(86,195,139,0.1),0_4px_12px_rgba(86,195,139,0.2)]' : 
                stat.color === 'text-orange-500' ? 'bg-orange-500/10 shadow-[inset_0_2px_4px_rgba(249,115,22,0.1),0_4px_12px_rgba(249,115,22,0.2)]' : 
                stat.color === 'text-amber-500' ? 'bg-amber-500/10 shadow-[inset_0_2px_4px_rgba(245,158,11,0.1),0_4px_12px_rgba(245,158,11,0.2)]' : 'bg-slate-100'
              )}>
                <stat.icon size={26} className={cn(stat.color, "group-hover:scale-110 transition-transform duration-500 drop-shadow-sm")} />
              </div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none block">{stat.label}</div>
            </div>
            <div className="text-4xl font-black font-display text-text-main tracking-tighter leading-none group-hover:text-primary transition-colors">{stat.value}</div>
            
            {/* Background design */}
            <div className={cn("absolute -bottom-8 -right-8 w-24 h-24 opacity-[0.05] transition-transform duration-1000 group-hover:scale-150 rotate-12", stat.color)} />
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xl font-black font-display text-text-main">Settings</h3>
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol v1.2</span>
        </div>
        
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] shadow-xl shadow-slate-200/20 overflow-hidden divide-y divide-slate-50">
          <div 
            onClick={() => setIsSelectorOpen(true)}
            className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group"
          >
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                  <Target size={22} className="text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>
                <div>
                  <div className="text-base font-black text-text-main mb-0.5">Learning Path</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.learningLevel || 'beginner'} Track</div>
                </div>
             </div>
             <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                Change
             </div>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                  <Zap size={22} className="text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>
                <div>
                  <div className="text-base font-black text-text-main mb-0.5">Sound Effects</div>
                  <div className="text-[10px] font-bold text-slate-400">Tactile audio feedback</div>
                </div>
             </div>
             <div className="w-12 h-7 bg-primary rounded-full relative shadow-inner ring-4 ring-primary/5">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-md" />
             </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full text-left p-6 flex items-center gap-5 hover:bg-red-50/50 transition-all group"
          >
            <div className="w-14 h-14 bg-red-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all text-red-400 group-hover:text-red-500">
               <LogOut size={22} className="group-hover:scale-110 transition-all" />
            </div>
            <div>
              <div className="text-base font-black text-red-600 mb-0.5">Sign Out</div>
              <div className="text-[10px] font-bold text-red-400 opacity-60">Session termination</div>
            </div>
          </button>
        </div>
      </div>

      <LanguageSelector 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleLevelChange}
        currentLangId={profile?.selectedCourseId}
      />
    </div>
  );
}
