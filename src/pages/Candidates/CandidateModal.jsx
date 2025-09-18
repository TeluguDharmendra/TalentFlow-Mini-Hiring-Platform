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
import { useCandidatesApi } from '../../hooks/useApi.js';
import { useApp } from '../../contexts/AppContext.jsx';
import { CANDIDATE_STAGES } from '../../types/index.js';
import { validateEmail } from '../../utils/api.js';

// Validation schema
const candidateSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').test('email', 'Invalid email address', validateEmail),
  phone: yup.string(),
  stage: yup.string().required('Stage is required'),
  jobId: yup.number().required('Job is required'),
  experience: yup.number().min(0, 'Experience cannot be negative').max(50, 'Experience cannot exceed 50 years'),
  resume: yup.string().url('Resume must be a valid URL'),
});

const CandidateModal = ({ isOpen, onClose, mode, candidate, jobs, onSuccess }) => {
  const { createCandidate, updateCandidate } = useCandidatesApi();
  const { actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(candidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      stage: CANDIDATE_STAGES.APPLIED,
      jobId: '',
      experience: 0,
      resume: '',
    },
  });

  // Initialize form when candidate data changes
  useEffect(() => {
    if (candidate && mode === 'edit') {
      setValue('name', candidate.name);
      setValue('email', candidate.email);
      setValue('phone', candidate.phone || '');
      setValue('stage', candidate.stage);
      setValue('jobId', candidate.jobId);
      setValue('experience', candidate.experience);
      setValue('resume', candidate.resume || '');
      
      setSkills(candidate.skills || []);
    } else if (mode === 'create') {
      reset();
      setSkills([]);
    }
  }, [candidate, mode, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const candidateData = {
        ...data,
        skills: skills.filter(skill => skill.trim()),
        jobId: parseInt(data.jobId),
      };

      if (mode === 'create') {
        const newCandidate = await createCandidate(candidateData);
        actions.addCandidate(newCandidate);
      } else {
        const updatedCandidate = await updateCandidate(candidate.id, candidateData);
        actions.updateCandidate(updatedCandidate);
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const stageOptions = Object.values(CANDIDATE_STAGES).map(stage => ({
    value: stage,
    label: stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const jobOptions = jobs.map(job => ({
    value: job.id.toString(),
    label: job.title
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add New Candidate' : 'Edit Candidate'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Aarav Sharma"
            required
          />
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="aarav.sharma@gmail.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Years of Experience"
            type="number"
            {...register('experience')}
            error={errors.experience?.message}
            placeholder="5"
            min="0"
            max="50"
          />
        </div>

        {/* Job and Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Job Position"
            {...register('jobId')}
            error={errors.jobId?.message}
            options={jobOptions}
            placeholder="Select a job..."
            required
          />
          <Select
            label="Current Stage"
            {...register('stage')}
            error={errors.stage?.message}
            options={stageOptions}
            required
          />
        </div>

        {/* Resume URL */}
        <Input
          label="Resume/Portfolio URL"
          type="url"
          {...register('resume')}
          error={errors.resume?.message}
          placeholder="https://drive.google.com/resume.pdf"
          helperText="Link to candidate's resume or portfolio"
        />

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="primary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
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
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g. JavaScript, React)..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              icon={<Plus size={16} />}
              disabled={!newSkill.trim() || skills.includes(newSkill.trim())}
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
            {mode === 'create' ? 'Add Candidate' : 'Update Candidate'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CandidateModal;