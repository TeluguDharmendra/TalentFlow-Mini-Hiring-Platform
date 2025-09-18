import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const firstNames = [
  "Arjun", "Priya", "Rohit", "Kavya", "Amit", "Sneha", "Rahul", "Aisha", "Vikram", "Neha",
  "Sanjay", "Ananya", "Karan", "Divya", "Rakesh", "Pooja", "Siddharth", "Isha", "Harsh", "Meera",
  "Aditya", "Nikita", "Manish", "Shreya", "Varun", "Ritu", "Naveen", "Lakshmi", "Akash", "Preeti"
];
const lastNames = [
  "Sharma", "Nair", "Verma", "Reddy", "Patel", "Singh", "Gupta", "Iyer", "Khan", "Das",
  "Rao", "Mukherjee", "Choudhary", "Menon", "Agarwal", "Bhat", "Kulkarni", "Jain", "Chopra", "Shetty",
  "Mehta", "Pandey", "Tripathi", "Basu", "Saxena", "Mishra", "Pillai", "Gill", "Bhattacharya", "Joshi"
];
const statuses = ["Applied", "In Review", "Shortlisted", "Interview", "Selected", "Rejected", "Hired"];
const skillsPool = [
  "JavaScript", "TypeScript", "React", "Node.js", "Express", "GraphQL", "HTML", "CSS", "Tailwind",
  "Redux", "Next.js", "Vue", "Angular", "Java", "Spring", "Python", "Django", "Flask",
  "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "CI/CD", "Jest", "Cypress"
];
const indianCities = [
  "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Gurugram", "Noida", "Kolkata", "Ahmedabad",
  "Jaipur", "Chandigarh", "Kochi", "Indore", "Coimbatore"
];
const emailDomains = [
  "gmail.com", "outlook.in", "yahoo.co.in", "tcs.com", "infosys.com", "wipro.com", "hcl.com", "flipkart.com", "reliancedigital.in"
];

const generateRandomName = () => {
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirstName} ${randomLastName}`;
};

const generateIndianEmail = (name, i) => {
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const local = name.toLowerCase().replace(/\s+/g, '.');
  return `${local}${i % 3 === 0 ? '' : i}@${domain}`;
};

const generateIndianPhone = () => {
  const start = [6,7,8,9][Math.floor(Math.random()*4)];
  let rest = '';
  for (let i = 0; i < 9; i++) rest += Math.floor(Math.random()*10);
  return `+91 ${start}${rest}`;
};

const generateCandidates = (count) => {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    const name = generateRandomName();
    const email = generateIndianEmail(name, i+1);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const experience = Math.floor(Math.random() * 10) + 1; // 1-10 years
    const appliedDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]; // Last 30 days
    const skillsCount = Math.floor(Math.random() * 5) + 2; // 2-6 skills
    const skills = Array.from({ length: skillsCount }, () => skillsPool[Math.floor(Math.random() * skillsPool.length)])
      .filter((v, idx, arr) => arr.indexOf(v) === idx);
    const phone = generateIndianPhone();

    candidates.push({
      id: i + 1,
      name,
      role: "Software Engineer",
      status,
      email,
      location: indianCities[Math.floor(Math.random()*indianCities.length)],
      experience: `${experience} years`,
      appliedDate,
      skills,
      phone,
      resume: `https://example.com/resume/${i+1}`,
      notes: Math.random() > 0.5 ? 'Strong JS/React skills. Great culture fit.' : 'Needs improvement in system design; solid fundamentals.'
    });
  }
  return candidates;
};

const CandidatesPage = () => {
  const allCandidates = useMemo(() => generateCandidates(1000), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const itemsPerPage = 50;

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allCandidates.filter(c => {
      const inName = c.name.toLowerCase().includes(term);
      const inEmail = c.email.toLowerCase().includes(term);
      const inSkills = (c.skills || []).some(s => s.toLowerCase().includes(term));
      const matchesSearch = term ? (inName || inEmail || inSkills) : true;
      const matchesStatus = activeStatus ? c.status === activeStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [allCandidates, searchTerm, activeStatus]);

  const statusSummary = useMemo(() => {
    const counts = statuses.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    filteredCandidates.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [filteredCandidates]);

  const statusColors = {
    'Applied': 'from-gray-50 to-gray-100 text-gray-800 border-gray-200',
    'In Review': 'from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200',
    'Shortlisted': 'from-blue-50 to-blue-100 text-blue-800 border-blue-200',
    'Interview': 'from-purple-50 to-purple-100 text-purple-800 border-purple-200',
    'Selected': 'from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200',
    'Rejected': 'from-rose-50 to-rose-100 text-rose-800 border-rose-200',
    'Hired': 'from-green-50 to-green-100 text-green-800 border-green-200',
  };

  const maxStatusCount = useMemo(() => {
    return Math.max(1, ...Object.values(statusSummary));
  }, [statusSummary]);

  const CountUp = ({ end = 0, duration = 800 }) => {
    const [value, setValue] = useState(0);
    useMemo(() => {
      let start = 0;
      let startTs;
      const step = (ts) => {
        if (!startTs) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        const current = Math.floor(progress * end);
        if (current !== value) setValue(current);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [end, duration]);
    return (
      <span className="inline-flex min-w-[2ch] max-w-full break-words leading-none text-ellipsis">
        {value}
      </span>
    );
  };

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage, itemsPerPage]);

  // Reset to first page when filtering changes
  const _ = useMemo(() => {
    setCurrentPage(1);
    return null;
  }, [searchTerm, activeStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <Clock className="w-4 h-4 text-gray-600" />;
      case 'In Review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Shortlisted':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Interview':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'Selected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Hired':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-gray-100 text-gray-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Candidate Pipeline</h1>
          <p className="text-xl text-white/90">Track and manage your hiring candidates</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or skill..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>
        </div>

        {/* Status Overview - Cards */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statuses.map((s, idx) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className={`rounded-2xl border shadow-sm bg-gradient-to-br ${statusColors[s] || 'from-gray-50 to-gray-100 text-gray-800 border-gray-200'}`}
              >
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">{s}</div>
                    <div className="text-3xl font-extrabold mt-1 leading-none">
                      <CountUp end={statusSummary[s] || 0} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-white/90 rounded-full"
                        style={{ width: `${Math.round(((statusSummary[s] || 0) / maxStatusCount) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Relative share</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStatus(prev => prev === s ? '' : s)}
                  className={`block w-full text-xs font-medium text-center px-3 py-2 rounded-b-2xl border-t ${activeStatus === s ? 'bg-white/70' : 'bg-white/40'} hover:bg-white/70 transition-colors`}
                >
                  {activeStatus === s ? 'Clear Filter' : `Filter: ${s}`}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Overview - Simple Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 p-5"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Overview</h3>
            <p className="text-sm text-gray-500">Distribution of candidates by pipeline stage</p>
          </div>
          <div className="space-y-3">
            {statuses.map((s) => (
              <div key={s} className="flex items-center">
                <div className="w-32 text-sm text-gray-700">{s}</div>
                <div className="flex-1">
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        s === 'Hired' ? 'bg-green-500' :
                        s === 'Rejected' ? 'bg-rose-500' :
                        s === 'Interview' ? 'bg-purple-500' :
                        s === 'Shortlisted' ? 'bg-blue-500' :
                        s === 'In Review' ? 'bg-yellow-500' :
                        s === 'Selected' ? 'bg-emerald-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${Math.round(((statusSummary[s] || 0) / maxStatusCount) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-14 text-right text-sm font-medium text-gray-900 ml-3">{statusSummary[s] || 0}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Candidates Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCandidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    className="transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                          {getInitials(candidate.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {candidate.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {getStatusIcon(candidate.status)}
                        <span className="ml-1">{candidate.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {candidate.appliedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          Contact
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8 text-white animate-fade-in">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Empty State (if no candidates) */}
        {allCandidates.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">No Candidates Yet</h3>
              <p className="text-white/80">Start building your candidate pipeline by adding new candidates.</p>
            </div>
          </div>
        )}

        {/* Candidate Details Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedCandidate(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl font-bold text-gray-900">Candidate Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(selectedCandidate.name)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</div>
                    <div className="text-sm text-gray-500">{selectedCandidate.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Email</div>
                    <div className="text-sm text-gray-900">{selectedCandidate.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Phone</div>
                    <div className="text-sm text-gray-900">{selectedCandidate.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Status</div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCandidate.status)} mt-1`}>
                      {getStatusIcon(selectedCandidate.status)}
                      <span className="ml-1">{selectedCandidate.status}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Resume</div>
                    <a href={selectedCandidate.resume || '#'} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View Resume</a>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCandidate.skills || []).map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase mb-1">Notes</div>
                  <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {selectedCandidate.notes || 'Candidate shows strong fundamentals and good communication. Consider for next round.'}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;