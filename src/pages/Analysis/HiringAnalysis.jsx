import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const departments = ['Engineering', 'HR', 'Sales', 'Marketing'];
const statuses = ['Applied', 'In Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Hired'];

// Dummy summary data
const hiredByDept = {
  Engineering: 72,
  HR: 18,
  Sales: 44,
  Marketing: 37,
};

const inProcessByStatus = {
  'Applied': 137,
  'In Review': 126,
  'Shortlisted': 141,
  'Interview': 148,
  'Selected': 130,
};

const colors = {
  Hired: 'bg-green-500',
  Rejected: 'bg-rose-500',
  Interview: 'bg-orange-500',
  Applied: 'bg-gray-400',
  'In Review': 'bg-yellow-500',
  Shortlisted: 'bg-blue-500',
  Selected: 'bg-emerald-500',
};

export default function HiringAnalysis() {
  const totals = useMemo(() => {
    const totalHired = Object.values(hiredByDept).reduce((a, b) => a + b, 0);
    const totalInProcess = Object.values(inProcessByStatus).reduce((a, b) => a + b, 0);
    const totalCandidates = totalHired + totalInProcess + 147; // add sample rejected
    return { totalCandidates, totalHired, totalInProcess };
  }, []);

  const maxDept = Math.max(...Object.values(hiredByDept));
  const maxStatus = Math.max(...Object.values(inProcessByStatus));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="text-white/90 hover:text-white inline-flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Hiring Analysis</h1>
          <div />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[{label:'Total Candidates', value: totals.totalCandidates}, {label:'Total Hired', value: totals.totalHired}, {label:'Total In Process', value: totals.totalInProcess}].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i*0.05 }} className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-3xl font-extrabold text-gray-900 leading-none">{kpi.value}</div>
              <div className="text-gray-600 mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dept-wise Hired (bar style) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hired by Department</h2>
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700">{dept}</div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-green-500`} style={{ width: `${Math.round((hiredByDept[dept] / maxDept) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900 ml-3">{hiredByDept[dept]}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status-wise In Process (donut-ish) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">In-Process by Status</h2>
            <div className="space-y-3">
              {Object.keys(inProcessByStatus).map((s) => (
                <div key={s} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700">{s}</div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        s === 'Interview' ? 'bg-orange-500' :
                        s === 'Shortlisted' ? 'bg-blue-500' :
                        s === 'In Review' ? 'bg-yellow-500' :
                        s === 'Selected' ? 'bg-emerald-500' :
                        'bg-gray-400'
                      }`} style={{ width: `${Math.round((inProcessByStatus[s] / maxStatus) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900 ml-3">{inProcessByStatus[s]}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


