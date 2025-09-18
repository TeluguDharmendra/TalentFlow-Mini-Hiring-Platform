import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '../../contexts/AppContext.jsx';
import Button from '../common/Button.jsx';

const Sidebar = () => {
  const { state, actions } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Briefcase },
    { name: 'Jobs', href: '/app', icon: Briefcase },
    { name: 'Candidates', href: '/app/candidates', icon: Users },
    { name: 'Assessments', href: '/app/assessments', icon: FileText },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    actions.logout();
    setMobileMenuOpen(false);
  };

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== '/dashboard' && item.href !== '/' && location.pathname.startsWith(item.href));
        
        return (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={clsx(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              {
                'bg-primary-100 text-primary-700 border-r-2 border-primary-500': isActive,
                'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !isActive,
              }
            )}
          >
            <item.icon 
              className={clsx(
                'mr-3 h-5 w-5 transition-colors duration-200',
                {
                  'text-primary-600': isActive,
                  'text-gray-400 group-hover:text-gray-500': !isActive,
                }
              )} 
            />
            {item.name}
            {isActive && (
              <ChevronRight className="ml-auto h-4 w-4 text-primary-600" />
            )}
          </NavLink>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          icon={mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          className="bg-white shadow-lg"
          aria-label="Toggle menu"
        />
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          {
            'translate-x-0': mobileMenuOpen,
            '-translate-x-full': !mobileMenuOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-primary-500 rounded-lg p-2 mr-3">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TalentFlow</h1>
                <p className="text-sm text-gray-500">Hiring Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItems />
          </nav>

          {/* User info and logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-100 rounded-full p-2">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {state.auth.user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {state.auth.user?.role || 'admin'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut size={16} />}
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              Sign out
            </Button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>TalentFlow v1.0</p>
              <p>Mini Hiring Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar toggle */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar content is rendered above */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;