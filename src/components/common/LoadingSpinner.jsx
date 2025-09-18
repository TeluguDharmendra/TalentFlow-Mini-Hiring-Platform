import { clsx } from 'clsx';

const LoadingSpinner = ({ size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-200 border-t-primary-500',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;