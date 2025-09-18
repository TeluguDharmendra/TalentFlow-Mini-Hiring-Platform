import { useDroppable, useDraggable } from '@dnd-kit/core';
import { MoreVertical, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { CANDIDATE_STAGES } from '../../types/index.js';
import { formatDate } from '../../utils/api.js';

const DroppableColumn = ({ id, title, children, count }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4 transition-colors duration-200 ${
        isOver ? 'bg-primary-50 ring-2 ring-primary-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900 capitalize">
            {title.replace('_', ' ')}
          </h3>
          <Badge variant={id} size="sm">
            {count}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Plus size={16} />}
          className="p-1"
          title="Add candidate to this stage"
        />
      </div>
      <div className="space-y-3 min-h-[200px]">
        {children}
      </div>
    </div>
  );
};

const DraggableCard = ({ candidate, onView, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-1 z-10' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-700">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {candidate.name}
            </h4>
            <p className="text-xs text-gray-500 truncate">{candidate.email}</p>
          </div>
        </div>
        
        <div className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            icon={<MoreVertical size={14} />}
            className="p-1"
          />
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-30">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(candidate);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye size={14} className="mr-2" />
                  View Profile
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(candidate);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(candidate);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{candidate.experience}y experience</span>
          <span>{formatDate(candidate.createdAt)}</span>
        </div>
        
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="default" size="sm" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 2 && (
              <Badge variant="default" size="sm" className="text-xs">
                +{candidate.skills.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ data, onView, onEdit, onDelete }) => {
  const stageNames = {
    [CANDIDATE_STAGES.APPLIED]: 'Applied',
    [CANDIDATE_STAGES.SCREENING]: 'Screening',
    [CANDIDATE_STAGES.INTERVIEW]: 'Interview',
    [CANDIDATE_STAGES.OFFER]: 'Offer',
    [CANDIDATE_STAGES.HIRED]: 'Hired',
    [CANDIDATE_STAGES.REJECTED]: 'Rejected',
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {Object.entries(data).map(([stage, candidates]) => (
        <DroppableColumn
          key={stage}
          id={stage}
          title={stageNames[stage]}
          count={candidates.length}
        >
          {candidates.map((candidate) => (
            <DraggableCard
              key={candidate.id}
              candidate={candidate}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </DroppableColumn>
      ))}
    </div>
  );
};

export default KanbanBoard;