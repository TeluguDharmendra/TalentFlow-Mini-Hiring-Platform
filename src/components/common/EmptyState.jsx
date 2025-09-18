import { clsx } from 'clsx';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className = ''
}) => {
  return (
    <div className={clsx(
      'text-center py-12',
      className
    )}>
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;