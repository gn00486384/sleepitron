
import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  CalendarClock, 
  Home, 
  Stethoscope, 
  Moon, 
  User
} from 'lucide-react';

const navigation = [
  { name: '首頁', href: '/', icon: Home },
  { name: '睡眠記錄', href: '/sleep-records', icon: Moon },
  { name: '人格記錄', href: '/personality-records', icon: User },
  { name: '醫生訪問', href: '/doctor-visits', icon: Stethoscope },
  { name: '數據分析', href: '/analysis', icon: BarChart },
];

const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const paths = useMemo(() => navigation.map((item) => item.href), []);

  // Find exact matching path first
  const activeIndex = paths.findIndex(
    (path) => path === currentPath || (path !== '/' && currentPath.startsWith(path))
  );

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
        <nav className="mt-5 flex-1 space-y-1 px-2" aria-label="Sidebar">
          {navigation.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default memo(AppSidebar);
