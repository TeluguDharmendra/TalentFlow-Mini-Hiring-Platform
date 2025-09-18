import { clsx } from 'clsx';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-secondary-100 text-secondary-800',
    warning: 'bg-accent-100 text-accent-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    // Status-specific variants
    active: 'bg-secondary-100 text-secondary-800',
    archived: 'bg-gray-100 text-gray-800',
    applied: 'bg-blue-100 text-blue-800',
    screening: 'bg-accent-100 text-accent-800',
    interview: 'bg-purple-100 text-purple-800',
    offer: 'bg-primary-100 text-primary-800',
    hired: 'bg-secondary-100 text-secondary-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;