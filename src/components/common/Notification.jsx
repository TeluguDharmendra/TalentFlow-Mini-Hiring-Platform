import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import Button from './Button.jsx';

const Notification = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      iconColor: 'text-secondary-500',
      titleColor: 'text-secondary-800',
      messageColor: 'text-secondary-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
      iconColor: 'text-accent-500',
      titleColor: 'text-accent-800',
      messageColor: 'text-accent-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconColor: 'text-primary-500',
      titleColor: 'text-primary-800',
      messageColor: 'text-primary-700',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-in',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={clsx('h-6 w-6', config.iconColor)} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={clsx('text-sm font-medium', config.titleColor)}>
              {title}
            </p>
            {message && (
              <p className={clsx('mt-1 text-sm', config.messageColor)}>
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(id)}
              icon={<X size={16} />}
              className="p-1 -mr-1"
              aria-label="Dismiss notification"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationContainer = ({ notifications, onClose }) => {
  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export { Notification, NotificationContainer };