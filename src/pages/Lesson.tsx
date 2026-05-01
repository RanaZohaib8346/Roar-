import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuizQuestions, QuizQuestion } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { completeLesson } from '../services/lessonService';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ChevronRight, Volume2, Compass, Trophy } from 'lucide-react';

export default function LessonPage() {
  const { lessonId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!profile) return;
      const data = await generateQuizQuestions(profile.selectedCourseId, "Introduction and Basic Phrases");
      setQuestions(data);
      setIsLoading(false);
    };
    loadQuestions();
  }, [profile]);

  const handleCheck = () => {
    if (!selectedOption) return;
    const current = questions[currentIndex];
    const correct = selectedOption.toLowerCase() === current.answer.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (user) {
        await completeLesson(user.uid, lessonId!, 20);
      }
    }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="w-16 h-16 bg-primary rounded-2xl animate-bounce mb-4 flex items-center justify-center text-white">
        <Compass className="w-8 h-8" />
      </div>
      <p className="text-xl font-display font-bold text-slate-500">Preparing your lesson...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 space-y-6">
      <div className="w-20 h-20 bg-danger/10 text-danger rounded-3xl flex items-center justify-center">
        <X size={40} />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-black text-text-main mb-2">Oops! Content offline</h2>
        <p className="text-slate-400 font-medium max-w-xs mx-auto">We couldn't load questions for this lesson. Please try again later.</p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
      >
        GO BACK
      </button>
    </div>
  );

  if (isFinished) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <AnimatePresence>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="w-28 h-28 bg-linear-to-br from-primary/20 to-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-[0_20px_50px_rgba(86,195,139,0.3),inset_0_-4px_0_rgba(86,195,139,0.2),inset_0_2px_4px_white] border-2 border-white">
            <Trophy size={50} className="fill-current drop-shadow-lg" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-primary mb-3">Lesson Complete!</h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-sm mx-auto">Mastery is within reach. You've earned <span className="text-primary font-black font-display">+20 XP</span> today.</p>
        </motion.div>
      </AnimatePresence>
      <button 
        onClick={() => navigate('/')}
        className="bg-primary hover:bg-primary-dark text-white font-black py-4 px-12 rounded-[2rem] transition-all shadow-xl shadow-primary/20 active:translate-y-1 hover:scale-105"
      >
        CONTINUE JOURNEY
      </button>
    </div>
  );

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      {/* Decorative bg bubbles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="p-6 lg:p-10 flex items-center gap-6 max-w-5xl mx-auto w-full">
        <button 
          onClick={() => navigate('/')} 
          className="text-slate-400 hover:text-danger hover:rotate-90 transition-all duration-300"
        >
          <X size={32} />
        </button>
        <div className="flex-1 h-5 bg-white rounded-full overflow-hidden border-2 border-slate-50 shadow-inner p-1">
          <motion.div 
            className="h-full bg-linear-to-r from-primary to-primary-dark rounded-full shadow-[0_4px_10px_rgba(86,195,139,0.3)] relative" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20" />
          </motion.div>
        </div>
      </header>
 
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full"
          >
            <div className="mb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Question {currentIndex + 1} of {questions.length}</span>
               <h2 className="text-3xl lg:text-4xl font-black font-display text-text-main leading-tight tracking-tight">
                 {currentQuestion.question}
               </h2>
            </div>
 
            {currentQuestion.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentQuestion.options?.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(option)}
                    className={`
                      p-6 lg:p-8 text-left border-3 rounded-[2rem] font-black transition-all duration-300 relative group
                      ${selectedOption === option ? 'border-primary bg-white shadow-2xl scale-105' : 'border-white bg-white hover:bg-slate-50 shadow-xl shadow-slate-200/20 text-slate-500'}
                      ${isAnswered && option === currentQuestion.answer ? 'border-primary bg-emerald-50 text-primary-dark' : ''}
                      ${isAnswered && selectedOption === option && !isCorrect ? 'border-danger bg-red-50 text-danger' : ''}
                    `}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-colors
                        ${selectedOption === option ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-white'}
                      `}>
                        {idx + 1}
                      </span>
                      <span className="text-xl tracking-tight">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
 
            {currentQuestion.type === 'translate' && (
              <div className="w-full">
                <textarea
                  disabled={isAnswered}
                  value={selectedOption || ''}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  placeholder="Type the translation..."
                  className="w-full p-10 bg-white border-3 border-transparent rounded-[3rem] min-h-[200px] outline-none focus:border-primary shadow-2xl shadow-slate-200/30 transition-all text-2xl font-bold placeholder:text-slate-200"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
 
      {/* Footer bar */}
      <footer className={`
        p-8 lg:p-12 border-t-4 transition-all duration-500 relative z-20
        ${isAnswered ? (isCorrect ? 'bg-emerald-500' : 'bg-danger') : 'bg-white border-slate-50'}
      `}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            {isAnswered ? (
               <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 text-white"
               >
                 <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                   <CheckCircle2 size={32} />
                 </div>
                 <div>
                   <h4 className="text-2xl font-black font-display uppercase tracking-widest">{isCorrect ? 'Excellent!' : 'Learn for next time:'}</h4>
                   {!isCorrect && <p className="text-xl font-bold opacity-90">{currentQuestion.answer}</p>}
                 </div>
               </motion.div>
            ) : (
              <div className="hidden lg:block text-slate-300 font-black uppercase tracking-widest text-xs">
                Select the correct answer to proceed
              </div>
            )}
          </div>
          <button
            onClick={isAnswered ? handleNext : handleCheck}
            disabled={!selectedOption && !isAnswered}
            className={`
              w-full md:w-64 py-6 rounded-[2rem] transition-all font-black font-display tracking-widest text-sm shadow-2xl active:translate-y-2
              ${isAnswered ? 'bg-white text-slate-900 hover:scale-105' : (selectedOption ? 'bg-primary text-white border-b-8 border-primary-dark' : 'bg-slate-100 text-slate-300')}
            `}
          >
            {isAnswered ? 'CONTINUE' : 'CHECK ANSWER'}
          </button>
        </div>
      </footer>
    </div>
  );
}
