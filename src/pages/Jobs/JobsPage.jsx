import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Briefcase, Eye, Building2, Users, Calendar, Plus, Edit, Archive as ArchiveIcon, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const departments = ["Engineering", "HR", "Sales", "Marketing", "Operations", "Finance", "Design"];
const indianCities = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Gurugram", "Noida", "Kolkata", "Ahmedabad"];
const companies = ["Infosys", "TCS", "Wipro", "HCL", "Accenture India", "Reliance Retail", "Flipkart", "Paytm", "Ola", "Zomato", "Freshworks", "Zoho"];

const formatINR = (num) => {
  const x = num.toString().split('.');
  let y = x[0];
  const lastThree = y.substring(y.length - 3);
  const otherNumbers = y.substring(0, y.length - 3);
  const result = otherNumbers !== '' ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree : lastThree;
  return `₹${result}`;
};

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners}>{children}</div>
    </div>
  );
};

const JobsPage = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState([
    { id: 1, title: "Software Engineer", company: "Infosys", location: "Bengaluru", type: "Full-time", salary: `${formatINR(850000)} - ${formatINR(1600000)}`, description: "Develop scalable applications and collaborate with cross-functional teams.", tags: ["React", "Node.js", "AWS"], posted: "2 days ago", applicants: 45 },
    { id: 2, title: "Frontend Developer", company: "TCS", location: "Pune", type: "Full-time", salary: `${formatINR(600000)} - ${formatINR(1400000)}`, description: "Build responsive UIs using React and modern tooling.", tags: ["React", "CSS", "TypeScript"], posted: "1 day ago", applicants: 32 },
    { id: 3, title: "Backend Developer", company: "Wipro", location: "Hyderabad", type: "Full-time", salary: `${formatINR(800000)} - ${formatINR(1500000)}`, description: "Design and implement robust backend APIs and services.", tags: ["Python", "Django", "PostgreSQL"], posted: "3 days ago", applicants: 28 },
    { id: 4, title: "DevOps Engineer", company: "HCL", location: "Chennai", type: "Full-time", salary: `${formatINR(900000)} - ${formatINR(1800000)}`, description: "Manage CI/CD pipelines and cloud infrastructure.", tags: ["Docker", "Kubernetes", "AWS"], posted: "1 week ago", applicants: 23 },
    { id: 5, title: "HR Executive", company: "Wipro", location: "Noida", type: "Full-time", salary: `${formatINR(400000)} - ${formatINR(900000)}`, description: "Handle recruitment and employee engagement activities.", tags: ["HR", "Recruitment"], posted: "4 days ago", applicants: 26 },
    { id: 6, title: "Sales Manager", company: "Reliance Retail", location: "Mumbai", type: "Full-time", salary: `${formatINR(700000)} - ${formatINR(2000000)}`, description: "Drive sales operations and manage key accounts.", tags: ["Sales", "CRM"], posted: "2 days ago", applicants: 39 },
    { id: 7, title: "Product Manager", company: "Flipkart", location: "Bengaluru", type: "Full-time", salary: `${formatINR(1200000)} - ${formatINR(2500000)}`, description: "Lead product strategy and roadmap execution.", tags: ["Product", "Analytics"], posted: "3 days ago", applicants: 38 },
    { id: 8, title: "Data Scientist", company: "Accenture India", location: "Gurugram", type: "Full-time", salary: `${formatINR(1000000)} - ${formatINR(2200000)}`, description: "Build ML models and provide data-driven insights.", tags: ["Python", "ML", "TensorFlow"], posted: "4 days ago", applicants: 41 },
    { id: 9, title: "UI/UX Designer", company: "Zoho", location: "Chennai", type: "Full-time", salary: `${formatINR(500000)} - ${formatINR(1200000)}`, description: "Design intuitive user experiences and prototypes.", tags: ["Figma", "Prototyping"], posted: "2 days ago", applicants: 52 },
    { id: 10, title: "Network Engineer", company: "TCS", location: "Delhi", type: "Full-time", salary: `${formatINR(800000)} - ${formatINR(1600000)}`, description: "Maintain network infrastructure and security.", tags: ["Networking", "Security"], posted: "1 week ago", applicants: 14 },
  
    // 20 new dummy jobs
    { id: 11, title: "Mobile App Developer", company: "Capgemini", location: "Bengaluru", type: "Full-time", salary: `${formatINR(700000)} - ${formatINR(1500000)}`, description: "Develop cross-platform mobile applications.", tags: ["Flutter", "React Native"], posted: "1 day ago", applicants: 30 },
    { id: 12, title: "Cloud Architect", company: "IBM India", location: "Pune", type: "Full-time", salary: `${formatINR(1500000)} - ${formatINR(2800000)}`, description: "Design cloud solutions and migration strategies.", tags: ["AWS", "Azure", "GCP"], posted: "3 days ago", applicants: 25 },
    { id: 13, title: "Content Writer", company: "HCL", location: "Chennai", type: "Full-time", salary: `${formatINR(400000)} - ${formatINR(800000)}`, description: "Write engaging content for digital platforms.", tags: ["SEO", "Copywriting"], posted: "5 days ago", applicants: 18 },
    { id: 14, title: "Marketing Executive", company: "Reliance Industries", location: "Mumbai", type: "Full-time", salary: `${formatINR(500000)} - ${formatINR(1200000)}`, description: "Plan and execute marketing campaigns.", tags: ["Digital Marketing", "SEO"], posted: "2 days ago", applicants: 20 },
    { id: 15, title: "QA Engineer", company: "Infosys", location: "Bengaluru", type: "Full-time", salary: `${formatINR(600000)} - ${formatINR(1300000)}`, description: "Test and ensure software quality.", tags: ["Selenium", "Manual Testing"], posted: "1 week ago", applicants: 22 },
    { id: 16, title: "AI Engineer", company: "TCS", location: "Hyderabad", type: "Full-time", salary: `${formatINR(1200000)} - ${formatINR(2300000)}`, description: "Develop AI-driven applications.", tags: ["Python", "PyTorch", "ML"], posted: "3 days ago", applicants: 35 },
    { id: 17, title: "Finance Analyst", company: "Kotak Mahindra Bank", location: "Mumbai", type: "Full-time", salary: `${formatINR(700000)} - ${formatINR(1400000)}`, description: "Analyze financial statements and reports.", tags: ["Excel", "Finance", "Accounting"], posted: "2 days ago", applicants: 19 },
    { id: 18, title: "SEO Specialist", company: "Zoho", location: "Chennai", type: "Full-time", salary: `${formatINR(500000)} - ${formatINR(1100000)}`, description: "Optimize websites for search engines.", tags: ["SEO", "Analytics"], posted: "4 days ago", applicants: 28 },
    { id: 19, title: "Graphic Designer", company: "Wipro", location: "Noida", type: "Full-time", salary: `${formatINR(400000)} - ${formatINR(900000)}`, description: "Create visuals for marketing campaigns.", tags: ["Photoshop", "Illustrator"], posted: "6 days ago", applicants: 15 },
    { id: 20, title: "Business Analyst", company: "Accenture India", location: "Gurugram", type: "Full-time", salary: `${formatINR(900000)} - ${formatINR(1800000)}`, description: "Gather requirements and support project delivery.", tags: ["Business Analysis", "SQL"], posted: "3 days ago", applicants: 32 },
    { id: 21, title: "System Administrator", company: "HCL", location: "Pune", type: "Full-time", salary: `${formatINR(600000)} - ${formatINR(1200000)}`, description: "Maintain IT systems and troubleshoot issues.", tags: ["Linux", "Windows Server"], posted: "1 week ago", applicants: 14 },
    { id: 22, title: "Research Analyst", company: "Reliance Retail", location: "Mumbai", type: "Full-time", salary: `${formatINR(700000)} - ${formatINR(1500000)}`, description: "Conduct market research and report insights.", tags: ["Research", "Excel"], posted: "2 days ago", applicants: 21 },
    { id: 23, title: "Cybersecurity Analyst", company: "Infosys", location: "Bengaluru", type: "Full-time", salary: `${formatINR(1000000)} - ${formatINR(2000000)}`, description: "Monitor and protect company networks.", tags: ["Security", "Network"], posted: "4 days ago", applicants: 25 },
    { id: 24, title: "Java Developer", company: "TCS", location: "Chennai", type: "Full-time", salary: `${formatINR(800000)} - ${formatINR(1600000)}`, description: "Develop and maintain Java applications.", tags: ["Java", "Spring Boot"], posted: "1 day ago", applicants: 30 },
    { id: 25, title: "Python Developer", company: "Wipro", location: "Noida", type: "Full-time", salary: `${formatINR(700000)} - ${formatINR(1500000)}`, description: "Develop backend APIs and data pipelines.", tags: ["Python", "Flask", "SQL"], posted: "3 days ago", applicants: 27 },
    { id: 26, title: "Operations Manager", company: "Reliance Industries", location: "Mumbai", type: "Full-time", salary: `${formatINR(1200000)} - ${formatINR(2500000)}`, description: "Oversee daily operations and logistics.", tags: ["Operations", "Management"], posted: "5 days ago", applicants: 18 },
    { id: 27, title: "Technical Support Engineer", company: "Capgemini", location: "Pune", type: "Full-time", salary: `${formatINR(500000)} - ${formatINR(1000000)}`, description: "Provide technical support to clients.", tags: ["Support", "Troubleshooting"], posted: "2 days ago", applicants: 20 },
    { id: 28, title: "Machine Learning Engineer", company: "IBM India", location: "Bengaluru", type: "Full-time", salary: `${formatINR(1500000)} - ${formatINR(2800000)}`, description: "Implement ML models and pipelines.", tags: ["ML", "Python", "TensorFlow"], posted: "3 days ago", applicants: 34 },
    { id: 29, title: "Accountant", company: "Kotak Mahindra Bank", location: "Mumbai", type: "Full-time", salary: `${formatINR(500000)} - ${formatINR(1200000)}`, description: "Maintain accounts and financial records.", tags: ["Accounting", "Tally"], posted: "1 week ago", applicants: 12 },
    { id: 30, title: "Logistics Coordinator", company: "Flipkart", location: "Bengaluru", type: "Full-time", salary: `${formatINR(600000)} - ${formatINR(1300000)}`, description: "Coordinate supply chain and deliveries.", tags: ["Logistics", "Operations"], posted: "4 days ago", applicants: 22 },
  ].map(j => ({ ...j, department: departments[Math.floor(Math.random() * departments.length)], status: 'Active' })));
  
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [viewArchived, setViewArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState({ title: '', department: '', description: '', requirements: '', status: 'Active', company: '', location: '' });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm({ title: '', department: '', description: '', requirements: '', status: 'Active', company: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({ title: job.title, department: job.department || '', description: job.description || '', requirements: job.requirements || '', status: job.status || 'Active', company: job.company || '', location: job.location || '' });
    setShowModal(true);
  };

  const saveJob = () => {
    if (!form.title) return;
    if (editingJob) {
      const updater = (list) => list.map(j => j.id === editingJob.id ? { ...j, ...form } : j);
      if (editingJob.status === 'Archived') setArchivedJobs(updater);
      else setActiveJobs(updater);
    } else {
      const baseMin = 300000, baseMax = 2500000;
      const min = Math.floor(baseMin + Math.random() * (baseMax - baseMin) * 0.4);
      const max = Math.floor(min * (1.3 + Math.random() * 1.2));
      const newJob = {
        id: Math.max(0, ...activeJobs.map(j=>j.id), ...archivedJobs.map(j=>j.id)) + 1,
        title: form.title,
        department: form.department,
        description: form.description,
        requirements: form.requirements,
        status: form.status,
        company: form.company || companies[Math.floor(Math.random()*companies.length)],
        location: form.location || indianCities[Math.floor(Math.random()*indianCities.length)],
        type: 'Full-time',
        salary: `${formatINR(min)} - ${formatINR(max)}`,
        tags: [],
        posted: 'today',
        applicants: 0,
      };
      if (form.status === 'Archived') setArchivedJobs([...archivedJobs, newJob]);
      else setActiveJobs([...activeJobs, newJob]);
    }
    setShowModal(false);
    setEditingJob(null);
  };

  const archiveJob = (job) => {
    if (job.status === 'Archived') return;
    setActiveJobs(activeJobs.filter(j => j.id !== job.id));
    setArchivedJobs([...archivedJobs, { ...job, status: 'Archived' }]);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = activeJobs.findIndex(j => j.id === active.id);
    const newIndex = activeJobs.findIndex(j => j.id === over.id);
    setActiveJobs(arrayMove(activeJobs, oldIndex, newIndex));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Job Management</h1>
              <p className="text-white/90">Create, edit, archive, and reorder jobs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-lg p-1 flex items-center">
                <button onClick={() => setViewArchived(false)} className={`px-3 py-2 rounded-md text-sm font-medium ${!viewArchived ? 'bg-white text-gray-800' : 'text-white/90'}`}>Active Jobs</button>
                <button onClick={() => setViewArchived(true)} className={`px-3 py-2 rounded-md text-sm font-medium ${viewArchived ? 'bg-white text-gray-800' : 'text-white/90'}`}>Archived Jobs</button>
              </div>
              <button onClick={openCreate} className="inline-flex items-center bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" /> Create Job
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {!viewArchived ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={activeJobs.map(j=>j.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {activeJobs.map((job, index) => (
                  <SortableItem key={job.id} id={job.id}>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.02 }} className="bg-white rounded-2xl shadow-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500 cursor-grab active:cursor-grabbing"><GripVertical className="w-5 h-5" /></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-900">{job.title} – {job.company}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{job.status}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{job.department}</div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="inline-flex items-center"><Building2 className="w-4 h-4 mr-1 text-gray-400" />{job.company}</span>
                              <span className="inline-flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{job.location}</span>
                              <span className="inline-flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" />{job.type}</span>
                              <span className="inline-flex items-center"><DollarSign className="w-4 h-4 mr-1 text-gray-400" />{job.salary} per annum</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(job)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center"><Edit className="w-4 h-4 mr-1" /> Edit</button>
                          <button onClick={() => archiveJob(job)} className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 inline-flex items-center"><ArchiveIcon className="w-4 h-4 mr-1" /> Archive</button>
                          <button onClick={() => handleViewDetails(job.id)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center"><Eye className="w-4 h-4 mr-1" /> View</button>
                        </div>
                      </div>
                      {job.description && (<p className="text-gray-700 text-sm mt-4 line-clamp-3">{job.description}</p>)}
                    </motion.div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-4">
            {archivedJobs.map((job, index) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.02 }} className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{job.title} – {job.company}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Archived</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{job.department}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="inline-flex items-center"><Building2 className="w-4 h-4 mr-1 text-gray-400" />{job.company}</span>
                      <span className="inline-flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{job.location}</span>
                      <span className="inline-flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" />{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(job)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center"><Edit className="w-4 h-4 mr-1" /> Edit</button>
                    <button onClick={() => handleViewDetails(job.id)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center"><Eye className="w-4 h-4 mr-1" /> View</button>
                  </div>
                </div>
                {job.description && (<p className="text-gray-700 text-sm mt-4 line-clamp-3">{job.description}</p>)}
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!viewArchived && activeJobs.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">No Jobs Available</h3>
              <p className="text-white/80">Check back later for new opportunities.</p>
            </div>
          </div>
        )}
        {viewArchived && archivedJobs.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">No Archived Jobs</h3>
              <p className="text-white/80">Archive jobs to see them here.</p>
            </div>
          </div>
        )}

        {/* Create/Edit Job Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900">{editingJob ? 'Edit Job' : 'Create Job'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select value={form.department} onChange={(e)=>setForm({...form, department: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select department</option>
                      {departments.map(d => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={form.status} onChange={(e)=>setForm({...form, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Active">Active</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input value={form.company} onChange={(e)=>setForm({...form, company: e.target.value})} type="text" placeholder="e.g., Infosys" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} type="text" placeholder="e.g., Bengaluru" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea value={form.requirements} onChange={(e)=>setForm({...form, requirements: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                <button onClick={()=>{setShowModal(false); setEditingJob(null);}} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</button>
                <button onClick={saveJob} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Save</button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobsPage;