import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  FileText,
  MessageCircle,
  User,
  Briefcase,
  Send,
  X
} from 'lucide-react';
import { useCandidatesApi } from '../../hooks/useApi.js';
import { useApp } from '../../contexts/AppContext.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { formatDate, formatDateTime } from '../../utils/api.js';

const CandidateDetailPage = () => {
  const { candidateId } = useParams();
  const { getCandidate, getCandidateTimeline, addCandidateNote } = useCandidatesApi();
  const { state } = useApp();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const mentionRef = useRef(null);

  useEffect(() => {
    loadCandidateData();
  }, [candidateId]);

  const loadCandidateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [candidateData, timelineData] = await Promise.all([
        getCandidate(candidateId),
        getCandidateTimeline(candidateId)
      ]);
      
      setCandidate(candidateData);
      setTimeline(timelineData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock team members for @mentions
  const teamMembers = [
    { id: 1, name: 'Rajesh Sharma', role: 'HR Manager' },
    { id: 2, name: 'Priya Gupta', role: 'Technical Lead' },
    { id: 3, name: 'Amit Kumar', role: 'Hiring Manager' },
    { id: 4, name: 'Sneha Patel', role: 'Recruiter' },
  ];

  const handleNoteChange = (e) => {
    const value = e.target.value;
    setNewNote(value);

    // Check for @mentions
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const suggestions = teamMembers.filter(member =>
        member.name.toLowerCase().includes(query)
      );
      setMentionSuggestions(suggestions);
      setShowMentions(true);
      
      // Position the mention dropdown
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        setMentionPosition({
          top: rect.bottom + 5,
          left: rect.left
        });
      }
    } else {
      setShowMentions(false);
      setMentionSuggestions([]);
    }
  };

  const handleMentionSelect = (member) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = newNote.substring(0, cursorPosition);
    const textAfterCursor = newNote.substring(cursorPosition);
    const beforeMention = textBeforeCursor.replace(/@\w*$/, '');
    const newText = `${beforeMention}@${member.name} ${textAfterCursor}`;
    
    setNewNote(newText);
    setShowMentions(false);
    setMentionSuggestions([]);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursorPosition = beforeMention.length + member.name.length + 2;
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addCandidateNote(candidateId, newNote);
      setNewNote('');
      setShowNoteForm(false);
      loadCandidateData(); // Reload timeline
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowMentions(false);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-500">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <User size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidate Not Found</h2>
        <p className="text-gray-600 mb-6">
          {error || 'The candidate you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/app/candidates">
          <Button icon={<ArrowLeft size={16} />}>
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/app/candidates">
          <Button variant="outline" icon={<ArrowLeft size={16} />}>
            Back to Candidates
          </Button>
        </Link>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<Edit size={16} />}>
            Edit Candidate
          </Button>
        </div>
      </div>

      {/* Candidate Profile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {candidate.name}
              </h1>
              <Badge variant={candidate.stage} size="lg">
                {candidate.stage.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <a href={`mailto:${candidate.email}`} className="hover:text-primary-600">
                  {candidate.email}
                </a>
              </div>
              
              {candidate.phone && (
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <a href={`tel:${candidate.phone}`} className="hover:text-primary-600">
                    {candidate.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                {candidate.experience} years experience
              </div>
              
              <div className="flex items-center">
                <FileText size={16} className="mr-2 text-gray-400" />
                Applied {formatDate(candidate.createdAt)}
              </div>
            </div>
            
            {candidate.resume && (
              <div className="mt-4">
                <a 
                  href={candidate.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <FileText size={16} className="mr-1" />
                  View Resume
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Timeline</h2>
        
        {timeline.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                          <MessageCircle size={16} className="text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Moved to <span className="font-medium text-gray-900">{event.stage}</span> stage
                          </p>
                          {event.notes && (
                            <p className="mt-1 text-sm text-gray-700">{event.notes}</p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={event.createdAt}>
                            {formatDateTime(event.createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No activity recorded yet.</p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            icon={<MessageCircle size={16} />}
            onClick={() => setShowNoteForm(!showNoteForm)}
          >
            Add Note
          </Button>
          <Button variant="outline" icon={<FileText size={16} />}>
            Schedule Interview
          </Button>
          <Button variant="outline" icon={<Mail size={16} />}>
            Send Email
          </Button>
          <Button variant="outline">
            Move to Next Stage
          </Button>
        </div>

        {/* Note Form */}
        {showNoteForm && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newNote}
                onChange={handleNoteChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your note here... Use @ to mention team members"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={4}
              />
              
              {/* Mention Suggestions Dropdown */}
              {showMentions && mentionSuggestions.length > 0 && (
                <div
                  ref={mentionRef}
                  className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
                  style={{
                    top: mentionPosition.top,
                    left: mentionPosition.left,
                    minWidth: '200px'
                  }}
                >
                  {mentionSuggestions.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleMentionSelect(member)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-700">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteForm(false);
                  setNewNote('');
                  setShowMentions(false);
                }}
                icon={<X size={16} />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                icon={<Send size={16} />}
              >
                Add Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailPage;