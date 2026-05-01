import { loginWithGoogle, loginWithFacebook } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Facebook } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate('/');
    } catch (error) {
      console.error('Facebook login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center z-10"
      >
        <div className="mb-10 inline-flex items-center justify-center w-16 h-16 bg-white border border-border rounded-2xl shadow-xl shadow-slate-200/50">
          <Compass className="text-primary w-8 h-8" />
        </div>
        
        <h1 className="text-5xl font-black font-display text-text-main mb-4 leading-tight tracking-tighter">
          LingoFlow
        </h1>
        
        <p className="text-lg text-text-muted mb-10 font-medium">
          Master any language through intelligent flow.
        </p>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-text-main font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">G</div>
            Continue with Google
          </button>
          
          <button 
            onClick={handleFacebookLogin}
            className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Facebook size={20} fill="currentColor" />
            Continue with Facebook
          </button>

          <div className="py-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">or</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            Start Learning
          </button>
        </div>
      </motion.div>

      <div className="mt-24 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Available Globally</p>
        <div className="flex flex-wrap justify-center gap-6 mt-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-2xl" title="Spanish">🇪🇸</span>
          <span className="text-2xl" title="French">🇫🇷</span>
          <span className="text-2xl" title="German">🇩🇪</span>
          <span className="text-2xl" title="Italian">🇮🇹</span>
          <span className="text-2xl" title="Japanese">🇯🇵</span>
          <span className="text-2xl" title="Korean">🇰🇷</span>
          <span className="text-2xl" title="Chinese">🇨🇳</span>
          <span className="text-2xl" title="Arabic">🇸🇦</span>
          <span className="text-2xl" title="Portuguese">🇧🇷</span>
          <span className="text-2xl" title="Russian">🇷🇺</span>
          <span className="text-2xl" title="Turkish">🇹🇷</span>
          <span className="text-2xl" title="Hindi">🇮🇳</span>
          <span className="text-2xl" title="Greek">🇬🇷</span>
          <span className="text-2xl" title="Swedish">🇸🇪</span>
        </div>
      </div>
    </div>
  );
}
