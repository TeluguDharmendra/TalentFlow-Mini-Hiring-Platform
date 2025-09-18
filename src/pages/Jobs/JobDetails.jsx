import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Building2, Users, Calendar, CheckCircle, Star, Briefcase } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo job data (same as in JobsPage)
  const jobData = {
    1: {
      id: 1,
      title: "Senior Software Engineer",
      location: "Remote",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      description: "We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for leading the development of scalable web applications using modern technologies. This role offers the opportunity to work on cutting-edge projects and mentor junior developers.",
      fullDescription: `We are seeking a highly skilled Senior Software Engineer to join our engineering team. In this role, you will:

• Lead the development of scalable web applications using React, Node.js, and AWS
• Design and implement robust APIs and microservices
• Collaborate with cross-functional teams to deliver high-quality software solutions
• Mentor junior developers and conduct code reviews
• Participate in architectural decisions and technical planning
• Ensure code quality through testing and best practices
• Stay up-to-date with emerging technologies and industry trends

Requirements:
• 5+ years of experience in software development
• Strong proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with cloud platforms (AWS, Azure, or GCP)
• Knowledge of database design and optimization
• Experience with CI/CD pipelines and DevOps practices
• Strong problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

Benefits:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development opportunities
• Generous vacation and sick leave
• 401(k) matching program`,
      tags: ["React", "Node.js", "AWS", "TypeScript", "Docker", "Kubernetes", "PostgreSQL", "GraphQL"],
      company: "TechCorp",
      posted: "2 days ago",
      applicants: 45,
      experience: "5+ years",
      benefits: ["Health Insurance", "Dental Insurance", "Vision Insurance", "401(k) Matching", "Flexible Schedule", "Remote Work", "Professional Development", "Stock Options"]
    },
    2: {
      id: 2,
      title: "Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      description: "Join our frontend team to build responsive and interactive user interfaces with React and Vue.js.",
      fullDescription: `We're looking for a talented Frontend Developer to join our team and help build amazing user experiences. You will work closely with our design and backend teams to create intuitive and performant web applications.

Responsibilities:
• Develop responsive web applications using React and Vue.js
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and technical discussions
• Stay current with frontend technologies and best practices

Requirements:
• 3+ years of frontend development experience
• Proficiency in JavaScript, HTML5, and CSS3
• Experience with React, Vue.js, or similar frameworks
• Knowledge of modern CSS frameworks and preprocessors
• Understanding of responsive design principles
• Experience with version control systems (Git)
• Strong attention to detail and problem-solving skills`,
      tags: ["React", "Vue.js", "CSS", "JavaScript", "HTML5", "SASS", "Webpack", "Jest"],
      company: "StartupXYZ",
      posted: "1 day ago",
      applicants: 32,
      experience: "3+ years",
      benefits: ["Health Insurance", "Dental Insurance", "Vision Insurance", "Flexible Schedule", "Stock Options", "Gym Membership", "Free Meals"]
    }
  };

  const job = jobData[id] || jobData[1];

  const handleApplyNow = () => {
    console.log('Apply to job:', job.id);
    // Handle apply logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Jobs</span>
            </button>
            <div className="flex items-center space-x-2 text-orange-600">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Save Job</span>
            </div>
          </div>
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{job.company}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-medium text-green-600">{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{job.applicants} applicants</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Posted {job.posted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                {job.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{job.experience} of relevant experience</span>
                </div>
                {job.tags.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Proficiency in {tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
              <button
                onClick={handleApplyNow}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
              >
                <Briefcase className="w-5 h-5" />
                <span>Apply Now</span>
              </button>
              <p className="text-sm text-gray-600 text-center">
                {job.applicants} people have applied for this job
              </p>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-medium">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{job.posted}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>
              <div className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

