import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const BackButton = ({ title, customPath }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="fixed top-24 left-6 sm:left-8 md:left-12 z-40 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 pointer-events-auto"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white shadow-2xl hover:bg-indigo-600 hover:border-indigo-400 transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black tracking-tight">Back</span>
        </motion.button>
        
        {title && (
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </h1>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BackButton;
