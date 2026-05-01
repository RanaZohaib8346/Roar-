import React, { useEffect, useState } from 'react';
import { db, isMockMode } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserProfile } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Trophy, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_LEADERBOARD: UserProfile[] = [
  { uid: '1', displayName: 'Elena G.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', totalXP: 15400, streak: 45, gems: 1200, email: '', selectedCourseId: 'spanish', learningLevel: 'pro', lastActive: '', createdAt: '' },
  { uid: 'mock-user-123', displayName: 'Lingo Explorer (You)', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky', totalXP: 1250, streak: 5, gems: 450, email: '', selectedCourseId: 'korean', learningLevel: 'beginner', lastActive: '', createdAt: '' },
  { uid: '2', displayName: 'Marco S.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco', totalXP: 12800, streak: 32, gems: 800, email: '', selectedCourseId: 'italian', learningLevel: 'basic', lastActive: '', createdAt: '' },
  { uid: '3', displayName: 'Yuki T.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', totalXP: 11200, streak: 12, gems: 950, email: '', selectedCourseId: 'japanese', learningLevel: 'pro', lastActive: '', createdAt: '' },
  { uid: '4', displayName: 'Sarah K.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', totalXP: 9500, streak: 8, gems: 300, email: '', selectedCourseId: 'french', learningLevel: 'beginner', lastActive: '', createdAt: '' },
  { uid: '5', displayName: 'Alex M.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', totalXP: 8200, streak: 15, gems: 400, email: '', selectedCourseId: 'german', learningLevel: 'basic', lastActive: '', createdAt: '' },
  { uid: '6', displayName: 'Chloe L.', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', totalXP: 7800, streak: 21, gems: 600, email: '', selectedCourseId: 'french', learningLevel: 'basic', lastActive: '', createdAt: '' },
];

export default function Leaderboard() {
  const { profile } = useAuth();
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      if (isMockMode || !db) {
        const sorted = [...MOCK_LEADERBOARD];
        if (profile) {
           const myIndex = sorted.findIndex(u => u.uid === profile.uid || u.uid === 'mock-user-123');
           if (myIndex !== -1) {
             sorted[myIndex] = { ...profile, displayName: `${profile.displayName} (You)` };
           }
        }
        setTopUsers(sorted.sort((a, b) => b.totalXP - a.totalXP));
        setIsLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        setTopUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      } catch (error) {
        console.error("Leaderboard fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopUsers();
  }, [profile]);

  if (isLoading) return <div className="p-8 text-center animate-pulse text-primary font-bold">Loading Leaderboard...</div>;

  const topThree = topUsers.slice(0, 3);
  const rest = topUsers.slice(3);

  return (
    <div className="max-w-2xl mx-auto pb-20 pt-10 px-4">
      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" 
        />
        <div className="flex flex-col items-center gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-6 bg-linear-to-br from-amber-50 to-amber-100/50 rounded-[2.5rem] text-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.2),inset_0_-4px_0_rgba(245,158,11,0.2),inset_0_2px_4px_white] border-2 border-white animate-float relative"
          >
            <Trophy size={48} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black font-display text-text-main tracking-tightest leading-none">Silver League</h1>
        </div>
        <div className="flex items-center justify-center gap-3">
           <div className="h-[1px] w-8 md:w-12 bg-slate-100" />
           <div className="text-slate-400 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(86,195,139,0.5)]" />
             Ends in 2 Days 14 Hours
           </div>
           <div className="h-[1px] w-8 md:w-12 bg-slate-100" />
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex items-end justify-center gap-4 md:gap-6 mb-20 md:mb-24 px-2 md:px-4 h-64 md:h-72">
        {topThree[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center flex-1 group"
          >
            <div className="relative mb-6 md:mb-8">
              <div className="w-16 md:w-24 h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200 ring-2 ring-slate-100 group-hover:rotate-3 transition-transform duration-500">
                <img src={topThree[1].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].uid}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -translate-x-1/2 left-1/2 w-8 md:w-10 h-8 md:h-10 bg-slate-200 rounded-xl md:rounded-2xl border-2 md:border-4 border-white flex items-center justify-center font-black text-[10px] md:text-xs text-slate-500 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_-2px_0_rgba(0,0,0,0.1)]">2</div>
            </div>
            <div className="text-center mb-4 md:mb-6">
              <div className="text-[11px] md:text-sm font-black text-slate-700 truncate max-w-[70px] md:max-w-[100px] mb-0.5">{topThree[1].displayName}</div>
              <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{topThree[1].totalXP.toLocaleString()} XP</div>
            </div>
            <div className="w-full bg-linear-to-b from-slate-100 to-slate-50 rounded-t-2xl md:rounded-t-[3rem] h-24 md:h-32 border-x border-t border-slate-50 shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        )}

        {topThree[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center flex-1 group"
          >
            <div className="relative mb-8 md:mb-10 scale-110 md:scale-125">
              <div className="relative z-10 w-20 md:w-28 h-20 md:h-28 rounded-2.5xl md:rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl shadow-amber-200 ring-2 ring-amber-400 group-hover:-rotate-3 transition-transform duration-500">
                <img src={topThree[0].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].uid}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl md:text-5xl drop-shadow-2xl animate-bounce">👑</div>
              <div className="absolute -bottom-3 -translate-x-1/2 left-1/2 w-10 md:w-12 h-10 md:h-12 bg-amber-400 rounded-xl md:rounded-2xl border-2 md:border-4 border-white flex items-center justify-center font-black text-xs md:text-sm text-white shadow-2xl">1</div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-48 h-32 md:h-48 bg-amber-400/20 blur-2xl md:blur-3xl -z-10 rounded-full" />
            </div>
            <div className="text-center mb-6 md:mb-8 relative z-10">
              <div className="text-sm md:text-lg font-black text-amber-600 truncate max-w-[90px] md:max-w-[130px] drop-shadow-sm mb-1">{topThree[0].displayName}</div>
              <div className="text-[10px] md:text-[11px] font-black text-amber-500 uppercase tracking-widest leading-none">{topThree[0].totalXP.toLocaleString()} XP</div>
            </div>
            <div className="w-full bg-linear-to-b from-amber-100 to-amber-50 rounded-t-3xl md:rounded-t-[4rem] h-36 md:h-48 border-x border-t border-amber-200/40 shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        )}

        {topThree[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center flex-1 group"
          >
            <div className="relative mb-6 md:mb-8">
              <div className="w-16 md:w-24 h-16 md:h-24 rounded-2xl md:rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-orange-100 ring-2 ring-orange-200 group-hover:-rotate-3 transition-transform duration-500">
                <img src={topThree[2].photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].uid}`} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -translate-x-1/2 left-1/2 w-8 md:w-10 h-8 md:h-10 bg-orange-200 rounded-xl md:rounded-2xl border-2 md:border-4 border-white flex items-center justify-center font-black text-[10px] md:text-xs text-orange-600 shadow-lg">3</div>
            </div>
            <div className="text-center mb-4 md:mb-6">
              <div className="text-[11px] md:text-sm font-black text-slate-700 truncate max-w-[70px] md:max-w-[100px] mb-0.5">{topThree[2].displayName}</div>
              <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{topThree[2].totalXP.toLocaleString()} XP</div>
            </div>
            <div className="w-full bg-linear-to-b from-orange-100 to-orange-50 rounded-t-2xl md:rounded-t-[3rem] h-20 md:h-28 border-x border-t border-orange-100 shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-white border-2 border-slate-50 rounded-[4rem] shadow-[0_30px_90px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-50 mb-12">
        {rest.map((user, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            key={user.uid} 
            className={cn(
              "flex items-center gap-6 p-6 lg:p-8 transition-all hover:bg-slate-50/50 group",
              user.uid === profile?.uid || (isMockMode && user.uid === 'mock-user-123') ? "bg-primary/[0.03]" : ""
            )}
          >
            <div className="w-8 text-sm font-black font-display text-slate-300 group-hover:text-primary transition-colors">
              {index + 4}
            </div>
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
               <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className={cn("text-base font-extrabold", user.uid === profile?.uid || (isMockMode && user.uid === 'mock-user-123') ? "text-primary" : "text-text-main")}>
                {user.displayName || 'Anonymous Learner'}
                {(user.uid === profile?.uid || (isMockMode && user.uid === 'mock-user-123')) && (
                  <span className="ml-4 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-[0_4px_10px_rgba(86,195,139,0.3)] border-b-2 border-primary-dark">
                    Legendary You
                  </span>
                )}
              </div>
              <div className="text-[11px] font-bold text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="text-orange-500">🔥</span> {user.streak} day streak
              </div>
            </div>
            <div className="text-right">
              <div className="text-text-main font-black font-display text-2xl leading-none tracking-tight">
                {user.totalXP.toLocaleString()}
              </div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">XP Earned</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-10 bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-100 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 shadow-[0_20px_50px_rgba(249,164,62,0.1)] group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-200/40 relative z-10 shrink-0 animate-float">
          <Trophy size={40} className="fill-current" />
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-2xl border-4 border-white flex items-center justify-center text-white text-xs font-black shadow-lg">
            XP
          </div>
        </div>
        <div className="text-center md:text-left relative z-10">
          <h4 className="text-2xl font-black text-amber-800 leading-tight mb-2 tracking-tight group-hover:text-primary transition-colors">Promotion Zone</h4>
          <p className="text-base text-amber-700/60 font-bold leading-relaxed max-w-sm">
            You're currently on track! Top 5 players advance to the <span className="text-emerald-500 font-black px-2 py-1 bg-emerald-500/10 rounded-lg">Emerald League</span> on Monday!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
