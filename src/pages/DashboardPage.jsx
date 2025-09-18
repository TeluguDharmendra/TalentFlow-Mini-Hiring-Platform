import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Users, Settings as SettingsIcon, LogOut, Info, BarChart3 } from 'lucide-react';
import AssessmentsPage from './Assessments/AssessmentsPage.jsx';
import JobsPage from './Jobs/JobsPage.jsx';
import CandidatesPage from './Candidates/CandidatesPage.jsx';
import SettingsPage from './SettingsPage.jsx';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to landing page
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleBackToDashboard = () => {
    setActiveTab(null);
  };

  // If a tab is active, show the corresponding page
  if (activeTab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600">
        {/* Back Button */}
        <div className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'assessments' && <AssessmentsPage />}
          {activeTab === 'jobs' && <JobsPage />}
          {activeTab === 'candidates' && <CandidatesPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    );
  }

  // Main dashboard with icons
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600">
      {/* Dashboard Header */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center flex-1"
          >
            <h1 className="text-4xl font-bold text-white mb-2">TalentFlow Dashboard</h1>
            <p className="text-xl text-white/90">Choose a section to get started</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-600 transition-colors shadow-md"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </motion.button>
        </div>
      </div>

      {/* Main Icons Grid - New Order: Candidates, Jobs, Assessments, Settings */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Candidates - Purple */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              onClick={() => handleTabClick('candidates')}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center cursor-pointer transition-all duration-300 h-80 flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidates</h2>
                <p className="text-gray-600 leading-relaxed">
                  View and manage candidate profiles, track application status, and communicate with applicants.
                </p>
              </div>
            </motion.div>

            {/* Total Analysis - Indigo */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              onClick={() => navigate('/analysis')}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center cursor-pointer transition-all duration-300 h-80 flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Analysis</h2>
                <p className="text-gray-600 leading-relaxed">
                  Track hiring progress across departments and analyze hiring funnel.
                </p>
              </div>
            </motion.div>

            {/* Jobs - Green */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              onClick={() => handleTabClick('jobs')}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center cursor-pointer transition-all duration-300 h-80 flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h2>
                <p className="text-gray-600 leading-relaxed">
                  Post and manage job openings, review applications, and track the hiring pipeline.
                </p>
              </div>
            </motion.div>

            {/* Assessments - Blue */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              onClick={() => handleTabClick('assessments')}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center cursor-pointer transition-all duration-300 h-80 flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessments</h2>
                <p className="text-gray-600 leading-relaxed">
                  Create and manage skill assessments to evaluate candidate capabilities and technical expertise.
                </p>
              </div>
            </motion.div>

            {/* Settings - Orange */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              onClick={() => handleTabClick('settings')}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center cursor-pointer transition-all duration-300 h-80 flex flex-col justify-between"
            >
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SettingsIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600 leading-relaxed">
                  Configure your account settings, preferences, and system configurations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* TalentFlow Hiring Process Info Card - Teal */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl shadow-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-white mr-3" />
              <h3 className="text-2xl font-bold text-white">TalentFlow Hiring Process</h3>
            </div>
            <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
              Our streamlined 4-step process ensures you find the right talent efficiently: 
              <span className="font-semibold"> Apply → Assessment → Interview → Offer</span>
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white/90 text-sm">Apply</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white/90 text-sm">Assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white/90 text-sm">Interview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white/90 text-sm">Offer</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;