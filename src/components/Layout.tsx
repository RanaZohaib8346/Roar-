import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Trophy, User, Settings, Compass, Search, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <motion.div
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    className="w-full"
  >
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group font-display font-black text-sm uppercase tracking-widest w-full",
          isActive 
            ? "bg-white text-primary shadow-[0_20px_40px_rgba(86,195,139,0.15)] ring-2 ring-primary/10 scale-105 border-b-4 border-primary" 
            : "text-slate-400 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:text-primary-dark"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("w-6 h-6 transition-all duration-500", isActive ? "text-primary scale-110" : "text-slate-300 group-hover:text-primary group-hover:scale-110")} />
          <span className="hidden lg:inline">{label}</span>
        </>
      )}
    </NavLink>
  </motion.div>
);

export default function Layout() {
  const { profile } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 flex flex-row justify-around py-3 px-6 z-50 lg:static lg:w-72 lg:min-h-screen lg:flex-col lg:justify-start lg:gap-1 lg:px-8 lg:py-12 lg:border-r lg:border-t-0 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
        <div className="hidden lg:flex items-center gap-5 px-3 mb-14 group">
          <div className="w-14 h-14 bg-linear-to-br from-primary to-primary-dark rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 rotate-6 group-hover:rotate-0 transition-all duration-700 relative">
            <Compass className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-text-main font-display tracking-tightest leading-none">LingoFlow</h1>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mt-1">Language Lab</span>
          </div>
        </div>
        
        <nav className="flex flex-row flex-1 justify-around w-full lg:flex-col lg:gap-2">
          <NavItem to="/" icon={Home} label="Learn" />
          <NavItem to="/discover" icon={Search} label="Discover" />
          <NavItem to="/leaderboard" icon={Trophy} label="Leaderboard" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </nav>
        
        <div className="hidden lg:block mt-auto pt-8 border-t border-slate-50">
          {profile && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100/50 group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="relative">
                <img src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} alt="" className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-white shadow-sm" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[11px] font-black text-text-main truncate leading-none mb-1 group-hover:text-primary transition-colors">{profile.displayName}</div>
                <div className="flex items-center gap-1.5 opacity-60">
                  <Trophy size={8} className="text-amber-500 fill-current" />
                  <div className="text-[9px] font-black text-text-muted uppercase tracking-widest">Silver Learner</div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-amber-500/5 p-5 rounded-[1.5rem] border border-amber-500/10">
             <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 opacity-70">Weekly Streak</div>
             <div className="text-xl font-black text-amber-600 flex items-center gap-2">
               <span className="text-2xl animate-pulse">🔥</span> {profile?.streak || 0} Days
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 lg:pb-0 overflow-y-auto w-full px-4 md:px-12 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Right Sidebar - Analytics & Stats */}
      <aside className="hidden xl:flex w-80 h-screen sticky top-0 p-10 flex-col gap-8 bg-bg">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-xl font-black font-display text-text-main">Stats</h2>
           <div className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all">
             <Settings className="w-5 h-5 text-slate-300" />
           </div>
        </div>

        <div className="space-y-6">
          <div className="sleek-card p-8">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Daily Goal</h4>
               <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Zap size={14} className="fill-current" />
               </div>
            </div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Progress</span>
              <span className="text-sm font-black text-text-main">{profile?.totalXP || 0} <span className="text-slate-300 font-bold">/ 5000</span></span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-slate-100/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((profile?.totalXP || 0) / 5000) * 100, 100)}%` }}
                className="h-full bg-linear-to-r from-primary to-emerald-400 rounded-full shadow-sm" 
              />
            </div>
          </div>
          
          <div className="sleek-card p-8">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Badges</h4>
               <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[ '🔥', '⭐', '🎯', '🚀', '✨', '🛡️'].map((emoji, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer",
                  i < 3 
                    ? "bg-amber-50 text-shadow shadow-[0_4px_12px_rgba(249,164,62,0.15)] scale-105 border border-amber-100" 
                    : "bg-slate-50 opacity-30 grayscale border border-transparent hover:opacity-100 hover:grayscale-0 hover:bg-white hover:scale-110"
                )}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto sleek-card overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5">
          <div className="bg-primary p-6 text-white">
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Upgrade Pro</h4>
            <p className="text-xs text-white/70 font-medium leading-relaxed">Unlimited practice & no ads</p>
          </div>
          <button className="w-full py-5 text-xs font-black uppercase tracking-widest text-primary hover:bg-slate-50 transition-all">
            Unlock Everything
          </button>
        </div>
      </aside>
    </div>
  );
}
