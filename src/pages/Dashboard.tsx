import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLessons, subscribeToProgress, Lesson } from '../services/lessonService';
import { updateCourse } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Star, Check, Lock, ChevronDown, Sparkles, Trophy, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import LanguageSelector from '../components/LanguageSelector';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isResuming, setIsResuming] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const navigate = useNavigate();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.id === profile?.selectedCourseId) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!profile) return;

    const loadData = async () => {
      const courseChanged = lessons.length > 0 && lessons[0].courseId !== profile.selectedCourseId;
      if (lessons.length === 0 || courseChanged) {
        setIsLoading(true);
      }
      
      const fetched = await fetchLessons(profile.selectedCourseId);
      if (fetched.length === 0) {
          const cid = profile.selectedCourseId;
          setLessons([
          { id: `${cid}_l1`, title: 'Daily Basics', order: 1, xp: 10, courseId: cid, type: 'vocabulary', level: 'Unit 1' },
          { id: `${cid}_l2`, title: 'Small Talk', order: 2, xp: 15, courseId: cid, type: 'vocabulary', level: 'Unit 1' },
          { id: `${cid}_l3`, title: 'Numbers', order: 3, xp: 20, courseId: cid, type: 'vocabulary', level: 'Unit 1' },
          { id: `${cid}_l4`, title: 'Food & Menu', order: 4, xp: 25, courseId: cid, type: 'vocabulary', level: 'Unit 2' },
          { id: `${cid}_l5`, title: 'Family Tree', order: 5, xp: 25, courseId: cid, type: 'vocabulary', level: 'Unit 2' },
          { id: `${cid}_l6`, title: 'Everyday Life', order: 6, xp: 25, courseId: cid, type: 'vocabulary', level: 'Unit 2' },
          { id: `${cid}_l7`, title: 'Travel Prep', order: 7, xp: 30, courseId: cid, type: 'vocabulary', level: 'Unit 3' },
          { id: `${cid}_l8`, title: 'Office Chat', order: 8, xp: 35, courseId: cid, type: 'vocabulary', level: 'Unit 3' },
          { id: `${cid}_l9`, title: 'Grammar Fun', order: 9, xp: 35, courseId: cid, type: 'grammar', level: 'Unit 3' },
          { id: `${cid}_l10`, title: 'Social Ideas', order: 10, xp: 40, courseId: cid, type: 'grammar', level: 'Unit 4' },
          { id: `${cid}_l11`, title: 'Read News', order: 11, xp: 40, courseId: cid, type: 'practice', level: 'Unit 4' },
          { id: `${cid}_l12`, title: 'Discussions', order: 12, xp: 45, courseId: cid, type: 'practice', level: 'Unit 4' },
          { id: `${cid}_l13`, title: 'Real Books', order: 13, xp: 50, courseId: cid, type: 'vocabulary', level: 'Unit 5' },
          { id: `${cid}_l14`, title: 'Current Events', order: 14, xp: 55, courseId: cid, type: 'vocabulary', level: 'Unit 5' },
          { id: `${cid}_l15`, title: 'Expert Words', order: 15, xp: 55, courseId: cid, type: 'vocabulary', level: 'Unit 5' },
          { id: `${cid}_l16`, title: 'Advanced Grammar', order: 16, xp: 60, courseId: cid, type: 'grammar', level: 'Unit 5' },
          { id: `${cid}_l17`, title: 'Tone Mastery', order: 17, xp: 70, courseId: cid, type: 'practice', level: 'Unit 6' },
          { id: `${cid}_l18`, title: 'Essay Writing', order: 18, xp: 75, courseId: cid, type: 'vocabulary', level: 'Unit 6' },
          { id: `${cid}_l19`, title: 'Pro Native', order: 19, xp: 80, courseId: cid, type: 'practice', level: 'Unit 6' },
          { id: `${cid}_l20`, title: 'The Summit', order: 20, xp: 100, courseId: cid, type: 'grammar', level: 'Unit 6' },
          { id: `${cid}_l21`, title: 'Global Business', order: 21, xp: 85, courseId: cid, type: 'vocabulary', level: 'Unit 7' },
          { id: `${cid}_l22`, title: 'Negotiations', order: 22, xp: 90, courseId: cid, type: 'practice', level: 'Unit 7' },
          { id: `${cid}_l23`, title: 'Presentations', order: 23, xp: 90, courseId: cid, type: 'practice', level: 'Unit 7' },
          { id: `${cid}_l24`, title: 'Debate Topics', order: 24, xp: 95, courseId: cid, type: 'practice', level: 'Unit 8' },
          { id: `${cid}_l25`, title: 'Philosophy', order: 25, xp: 100, courseId: cid, type: 'vocabulary', level: 'Unit 8' },
          { id: `${cid}_l26`, title: 'Critical Thinking', order: 26, xp: 100, courseId: cid, type: 'grammar', level: 'Unit 8' },
          { id: `${cid}_l27`, title: 'Local Slang', order: 27, xp: 110, courseId: cid, type: 'vocabulary', level: 'Unit 9' },
          { id: `${cid}_l28`, title: 'Classic Cinema', order: 28, xp: 110, courseId: cid, type: 'practice', level: 'Unit 9' },
          { id: `${cid}_l29`, title: 'Modern Arts', order: 29, xp: 115, courseId: cid, type: 'vocabulary', level: 'Unit 9' },
          { id: `${cid}_l30`, title: 'Pure Fluency', order: 30, xp: 150, courseId: cid, type: 'practice', level: 'Unit 10' },
          { id: `${cid}_l31`, title: 'Native Insight', order: 31, xp: 150, courseId: cid, type: 'practice', level: 'Unit 10' },
          { id: `${cid}_l32`, title: 'Beyond Borders', order: 32, xp: 200, courseId: cid, type: 'grammar', level: 'Unit 10' },
        ]);
      } else {
        setLessons(fetched);
      }
      setIsLoading(false);
    };

    loadData();
    const unsubscribe = subscribeToProgress(user!.uid, (p) => setProgress(p));
    return () => unsubscribe();
  }, [profile, user]);

  const levels = Array.from(new Set(lessons.map(l => (l as any).level || 'Unit 1')));

  const handleLessonClick = (lesson: Lesson, isLocked: boolean) => {
    if (isLocked) return;
    navigate(`/lesson/${lesson.id}`);
  };

  const handleLanguageSelect = async (lang: any, pathId?: string) => {
    if (user) {
      await updateCourse(user.uid, lang.id, pathId || 'beginner');
      setIsSelectorOpen(false);
    }
  };

  if (isLoading && lessons.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-12 h-12 bg-primary rounded-xl animate-bounce flex items-center justify-center text-white font-black">L</div>
      <div className="text-sm font-bold text-primary animate-pulse">Syncing Course...</div>
    </div>
  );

  return (
    <div className={cn("max-w-2xl mx-auto px-4 md:px-0 transition-all duration-700", isLoading ? "opacity-40 scale-[0.98] blur-[2px] pointer-events-none" : "opacity-100 scale-100 blur-0")}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex items-center justify-between pt-4"
      >
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSelectorOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group border-2 border-transparent hover:border-slate-50"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform duration-500">{currentLang.flag}</span>
          <div className="text-left">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-0.5">Course</div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-text-main tracking-tight">{currentLang.name}</span>
              <ChevronDown size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </motion.button>

        <div className="flex flex-wrap items-center justify-end gap-3 flex-1 ml-4">
           <motion.div 
             whileHover={{ y: -5, scale: 1.02 }}
             className="hidden lg:flex items-center gap-2.5 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm ring-4 ring-slate-50/50 hover:shadow-md transition-all cursor-default"
           >
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_4px_8px_rgba(86,195,139,0.2)]">
               <Zap size={14} className="fill-current" />
             </div>
             <div className="text-left">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Track</div>
               <div className="text-xs font-black text-slate-700 uppercase tracking-tight capitalize">{profile?.learningLevel || 'beginner'}</div>
             </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5, scale: 1.02 }}
             className="hidden sm:flex items-center gap-2.5 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm ring-4 ring-slate-50/50 hover:shadow-md transition-all cursor-default"
           >
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_4px_8px_rgba(59,130,246,0.2)]">
               <Shield size={14} className="fill-current" />
             </div>
             <div className="text-left">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Total XP</div>
               <div className="text-xs font-black text-slate-700 uppercase tracking-tight">{profile?.totalXP?.toLocaleString() || 0}</div>
             </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5, scale: 1.02 }}
             className="flex items-center gap-2.5 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm ring-4 ring-slate-50/50 hover:shadow-md transition-all cursor-default"
           >
             <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_4px_8px_rgba(245,158,11,0.2)]">
               <Trophy size={16} />
             </div>
             <div className="text-left">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">League</div>
               <div className="text-xs font-black text-slate-700 uppercase tracking-tight">Silver</div>
             </div>
           </motion.div>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-linear-to-br from-primary to-primary-dark rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 text-white mb-16 md:mb-20 shadow-[0_30px_60px_rgba(86,195,139,0.3)] relative overflow-hidden group"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-5 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl animate-float">
            <div className="w-5 md:w-6 h-5 md:h-6 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Sparkles size={12} className="fill-current" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Path to Fluency</p>
          </div>
          <h3 className="text-4xl md:text-5xl font-black font-display mb-6 leading-[1.05] md:leading-[1.1] tracking-tightest">
            {profile?.learningLevel === 'beginner' ? 'Start your' : profile?.learningLevel === 'basic' ? 'Resume your' : 'Accelerate'}
            <br />
            <span className="text-white/80 italic">{currentLang.name}</span> basics
          </h3>
          <p className="text-white/70 max-w-sm text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-10">
            {profile?.learningLevel === 'pro' 
              ? `You're on the Pro track! Dive deep into ${currentLang.name} and master advanced fluency today.` 
              : currentLang.description}
          </p>
          
          <div className="flex">
            <button 
              onClick={() => {
                const nextLesson = lessons.find(l => !progress[l.id]);
                if (nextLesson) {
                  setIsResuming(true);
                  setTimeout(() => {
                    navigate(`/lesson/${nextLesson.id}`);
                  }, 800);
                }
              }}
              disabled={isResuming}
              className="bg-white text-primary btn-3d px-10 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-2.5xl text-xs md:text-sm shadow-white/20 flex items-center justify-center min-w-[180px] md:min-w-[200px] disabled:opacity-70"
            >
              {isResuming ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Wait...
                </div>
              ) : (
                'Resume Journey'
              )}
            </button>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 p-6 opacity-10 blur-sm transform rotate-12 transition-transform group-hover:scale-110 duration-1000">
           <Star size={400} fill="white" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/5 rounded-full blur-3xl" />
      </motion.div>

      {levels.map((level, levelIndex) => {
        const levelLessons = lessons.filter(l => (l as any).level === level || (!level && (l as any).level === 'Unit 1'));
        const isLevelComplete = levelLessons.every(l => progress[l.id]);

        return (
          <motion.div 
            key={level} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 md:mb-16 relative"
          >
            <div className="bg-white border-2 border-slate-100 rounded-[3rem] md:rounded-[4rem] p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.03)] relative overflow-hidden group">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110 opacity-60" />
               <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-10 md:mb-12 relative z-10">
                 <div className="flex items-center gap-4 md:gap-6 min-w-0">
                   <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl md:rounded-3xl bg-linear-to-br from-primary to-primary-dark text-white flex items-center justify-center font-black text-xl md:text-2xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
                     {levelIndex + 1}
                   </div>
                   <div className="min-w-0 flex-1">
                     <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 mb-1 md:mb-2 truncate">{level}</h4>
                     <h3 className="text-xl md:text-3xl font-black text-text-main tracking-tight leading-tight">
                       {["Getting Started", "Daily Essentials", "Communication", "Social Skills", "Advanced Reading", "Final Mastery", "Professional Edge", "Expert Logic", "Cultural Soul", "Ultimate Legend"][levelIndex] || "Continuing Journey"}
                     </h3>
                   </div>
                 </div>
                 
                 {isLevelComplete && (
                   <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 border-b-4 border-emerald-700 shadow-lg shadow-emerald-500/20"
                   >
                     <Check size={16} strokeWidth={4} />
                     <span className="text-[11px] font-black uppercase tracking-widest">Unit Mastered</span>
                   </motion.div>
                 )}
               </div>

               <div className="lesson-path relative z-10 px-4 md:px-10">
                 <div className="path-line opacity-20" />
                 {levelLessons.map((lesson, idx) => {
                   const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                   const isCompleted = progress[lesson.id];
                   const isCurrent = globalIndex === 0 || progress[lessons[globalIndex - 1]?.id];
                   const isLocked = !isCompleted && !isCurrent;
 
                   const offset = (idx % 2 === 0 ? 0 : 50) * (idx % 4 < 2 ? 1 : -1);
 
                   return (
                     <motion.div 
                       key={lesson.id} 
                       initial={{ opacity: 0, scale: 0.8, y: 20 }}
                       whileInView={{ opacity: 1, scale: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ delay: idx * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                       className="relative w-full flex justify-center mb-12 last:mb-0"
                     >
                       <div className="relative" style={{ transform: `translateX(${offset}px)` }}>
                         <motion.button
                           whileHover={{ scale: 1.15, rotate: isCurrent ? 5 : 0 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => handleLessonClick(lesson, isLocked)}
                           className={`
                             lesson-node ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}
                             ${!isLocked ? 'cursor-pointer' : ''}
                           `}
                         >
                           {isCompleted ? <Check className="w-8 h-8" strokeWidth={4} /> : (isCurrent ? <Star className="w-8 h-8 font-black fill-current animate-pulse" /> : <Lock className="w-6 h-6 opacity-30" />)}
                           
                           {/* Floating bubbles for current lesson */}
                           {isCurrent && !isCompleted && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-2xl z-20 animate-float"
                             >
                               Jump in!
                               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45" />
                             </motion.div>
                           )}

                           <motion.div 
                              initial={{ opacity: 0, x: idx % 2 === 0 ? 10 : -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.12 }}
                              className={`
                                absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-6 py-3 rounded-2xl pointer-events-none
                                ${idx % 2 === 0 ? 'left-[calc(100%+32px)]' : 'right-[calc(100%+32px)] text-right'}
                                ${isLocked ? 'opacity-30' : 'opacity-100'}
                                bg-white border-2 border-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.03)]
                              `}
                            >
                             <span className="text-sm font-black text-text-main tracking-tight block">{lesson.title}</span>
                             {!isLocked && !isCompleted && <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 block">Ready to start</span>}
                             {isCompleted && <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 block">Perfected</span>}
                           </motion.div>
                         </motion.button>
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
            </div>
          </motion.div>
        );
      })}

      <LanguageSelector 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleLanguageSelect}
        currentLangId={profile?.selectedCourseId}
      />
    </div>
  );
}
