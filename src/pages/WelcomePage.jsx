import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Phone, Mail, Send, Linkedin, Target, Trophy, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 relative overflow-hidden">
      {/* Floating Blobs with looping motion */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.25, y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-300 blur-3xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2, y: [0, 12, 0] }} transition={{ duration: 3, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-purple-300 blur-3xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15, y: [0, -8, 0] }} transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-blue-300 blur-3xl" />
      {/* Navbar */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-lg p-2 mr-3">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">TalentFlow</h1>
          </div>
          {/* Minimal nav - no section links */}
          <div className="hidden sm:flex items-center space-x-4" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            {/* Centered Hero Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-white text-center">
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mb-4 leading-tight">
                <span className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-white drop-shadow">TalentFlow</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
                Smart hiring management made simple and powerful.
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="relative z-10 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">Who we are</h3>
            <p className="text-white/90 max-w-3xl mx-auto">TalentFlow empowers Indian businesses to streamline hiring—from sourcing to onboarding—with data-driven insights and delightful candidate experiences.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white/10 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2"><Target className="w-5 h-5" /><span className="font-semibold">Mission</span></div>
              <p className="text-white/80 text-sm">Make hiring simple, transparent, and efficient for every Indian team.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white/10 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2"><Layers className="w-5 h-5" /><span className="font-semibold">Services</span></div>
              <p className="text-white/80 text-sm">ATS, Assessments, Candidate CRM, Analytics, and seamless integrations.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white/10 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2"><Trophy className="w-5 h-5" /><span className="font-semibold">Milestones</span></div>
              <p className="text-white/80 text-sm">10K+ candidates processed • 100+ Indian companies • 95% CSAT.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social + Contact */}
      <div className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white">Connect with us</h3>
          </motion.div>
          <div className="flex items-center justify-center gap-4 mb-8">
            <a href="https://t.me/talentflow" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition transform hover:scale-110" aria-label="Telegram">
              <Send className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/company/talentflow" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition transform hover:scale-110" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.a initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} href="tel:+919876543210" className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-3 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition transform hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white"><Phone className="w-5 h-5" /></div>
              <div>
                <div className="text-gray-900 font-semibold">Call Us</div>
                <div className="text-gray-600 text-sm">+91 98765 43210</div>
              </div>
            </motion.a>
            <motion.a initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} href="mailto:contact@talentflow.in" className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-3 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition transform hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white"><Mail className="w-5 h-5" /></div>
              <div>
                <div className="text-gray-900 font-semibold">Email Us</div>
                <div className="text-gray-600 text-sm">contact@talentflow.in</div>
              </div>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Workflow / How it works */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">How TalentFlow Works</h3>
            <p className="text-white/90">A simple, end‑to‑end hiring journey</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[{n:1,t:'Plan',d:'Define role, skills, and success metrics.'},{n:2,t:'Source',d:'Import applicants and publish jobs.'},{n:3,t:'Assess',d:'Run skill tests and structured interviews.'},{n:4,t:'Hire',d:'Offer rollouts and smooth onboarding.'}].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i*0.05 }} className="bg-white/10 rounded-2xl p-5 text-white text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/20 flex items-center justify-center font-bold">{s.n}</div>
                <div className="mt-3 font-semibold">{s.t}</div>
                <div className="text-white/80 text-sm mt-1">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-white/80 text-sm">
          <div>© 2025 TalentFlow</div>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <a href="https://t.me/talentflow" target="_blank" rel="noreferrer" className="hover:text-white">Telegram</a>
            <a href="https://www.linkedin.com/company/talentflow" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
            <a href="mailto:contact@talentflow.in" className="hover:text-white">contact@talentflow.in</a>
            <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;

