import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import { useJobsApi } from '../../hooks/useApi.js';
import { useApp } from '../../contexts/AppContext.jsx';
import { generateSlug } from '../../utils/api.js';
import { JOB_STATUS } from '../../types/index.js';

// Validation schema
const jobSchema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  location: yup.string().required('Location is required'),
  type: yup.string().required('Type is required'),
  status: yup.string().required('Status is required'),
  requirements: yup.array().of(yup.string()).min(1, 'At least one requirement is required'),
  salaryMin: yup.number().positive('Minimum salary must be positive').nullable(),
  salaryMax: yup.number().positive('Maximum salary must be positive').nullable(),
  currency: yup.string(),
});

const JobModal = ({ isOpen, onClose, mode, job, onSuccess }) => {
  const { createJob, updateJob } = useJobsApi();
  const { actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [requirements, setRequirements] = useState(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      location: '',
      type: 'Full-time',
      status: JOB_STATUS.ACTIVE,
      requirements: [],
      salaryMin: null,
      salaryMax: null,
      currency: 'USD',
    },
  });

  const watchedTitle = watch('title');

  // Generate slug from title
  useEffect(() => {
    if (watchedTitle && mode === 'create') {
      const slug = generateSlug(watchedTitle);
      setValue('slug', slug);
    }
  }, [watchedTitle, mode, setValue]);

  // Initialize form when job data changes
  useEffect(() => {
    if (job && mode === 'edit') {
      setValue('title', job.title);
      setValue('slug', job.slug);
      setValue('description', job.description);
      setValue('location', job.location);
      setValue('type', job.type);
      setValue('status', job.status);
      setValue('salaryMin', job.salary?.min || null);
      setValue('salaryMax', job.salary?.max || null);
      setValue('currency', job.salary?.currency || 'USD');
      
      setRequirements(job.requirements || ['']);
      setTags(job.tags || []);
    } else if (mode === 'create') {
      reset();
      setRequirements(['']);
      setTags([]);
    }
  }, [job, mode, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const jobData = {
        ...data,
        requirements: requirements.filter(req => req.trim()),
        tags,
        salary: data.salaryMin || data.salaryMax ? {
          min: data.salaryMin,
          max: data.salaryMax,
          currency: data.currency,
        } : null,
      };

      if (mode === 'create') {
        const newJob = await createJob(jobData);
        actions.addJob(newJob);
      } else {
        const updatedJob = await updateJob(job.id, jobData);
        actions.updateJob(updatedJob);
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Job' : 'Edit Job'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g. Senior Frontend Developer"
            required
          />
          <Input
            label="URL Slug"
            {...register('slug')}
            error={errors.slug?.message}
            placeholder="senior-frontend-developer"
            required
            helperText="Used in job URLs. Only lowercase letters, numbers, and hyphens."
          />
        </div>

        <Input
          label="Description"
          {...register('description')}
          error={errors.description?.message}
          placeholder="Describe the role and responsibilities..."
          required
          className="min-h-[100px]"
          as="textarea"
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Location"
            {...register('location')}
            error={errors.location?.message}
            placeholder="Remote, San Francisco, etc."
            required
          />
          <Select
            label="Type"
            {...register('type')}
            error={errors.type?.message}
            required
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
            ]}
          />
          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            required
            options={[
              { value: JOB_STATUS.ACTIVE, label: 'Active' },
              { value: JOB_STATUS.ARCHIVED, label: 'Archived' },
            ]}
          />
        </div>

        {/* Salary */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Salary Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Minimum Salary"
              type="number"
              {...register('salaryMin')}
              error={errors.salaryMin?.message}
              placeholder="60000"
            />
            <Input
              label="Maximum Salary"
              type="number"
              {...register('salaryMax')}
              error={errors.salaryMax?.message}
              placeholder="100000"
            />
            <Select
              label="Currency"
              {...register('currency')}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
          
          {requirements.map((requirement, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder="Enter a requirement..."
                className="flex-1"
              />
              {requirements.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  icon={<Trash2 size={16} />}
                  className="flex-shrink-0"
                />
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addRequirement)}
              placeholder="Add a new requirement..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addRequirement}
              icon={<Plus size={16} />}
              disabled={!newRequirement.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Tags</h3>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="primary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTag)}
              placeholder="Add a tag (e.g. React, Node.js)..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              icon={<Plus size={16} />}
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {mode === 'create' ? 'Create Job' : 'Update Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JobModal;