import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Archive, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  FileText,
  Calendar
} from 'lucide-react';
import { useJobsApi } from '../../hooks/useApi.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { formatDate, formatCurrency } from '../../utils/api.js';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const { getJob } = useJobsApi();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobData = await getJob(jobId);
      setJob(jobData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <FileText size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-600 mb-6">
          {error || 'The job you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/">
          <Button icon={<ArrowLeft size={16} />}>
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" icon={<ArrowLeft size={16} />}>
            Back to Jobs
          </Button>
        </Link>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<Edit size={16} />}>
            Edit Job
          </Button>
          <Button variant="outline" icon={<Archive size={16} />}>
            Archive Job
          </Button>
        </div>
      </div>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mr-4">
                {job.title}
              </h1>
              <Badge variant={job.status} size="lg">
                {job.status === 'active' ? 'Active' : 'Archived'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {job.type}
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              <span>Created {formatDate(job.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>Last updated {formatDate(job.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-2">
              <Users size={20} className="text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-2">
              <FileText size={20} className="text-secondary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">In Review</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-lg mx-auto mb-2">
              <Calendar size={20} className="text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Interviews Scheduled</div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to={`/candidates?jobId=${job.id}`}>
            <Button icon={<Users size={16} />}>
              View Candidates
            </Button>
          </Link>
          <Link to={`/assessments/${job.id}`}>
            <Button variant="outline" icon={<FileText size={16} />}>
              Manage Assessment
            </Button>
          </Link>
          <Button variant="outline">
            Share Job
          </Button>
          <Button variant="outline">
            Duplicate Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;