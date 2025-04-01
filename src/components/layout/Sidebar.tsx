
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, LayoutDashboard, Bed, Stethoscope, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "儀表板",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "睡眠記錄",
      href: "/sleep-records",
      icon: Bed,
    },
    {
      name: "醫生訪問",
      href: "/doctor-visits",
      icon: Stethoscope,
    },
    {
      name: "數據分析",
      href: "/analysis",
      icon: BarChart3,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-sidebar border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 py-5 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-sleep flex items-center justify-center">
            <Moon className="text-white h-4 w-4" />
          </div>
          {isOpen && (
            <span className="text-lg font-semibold">Sleepitron</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-2 pt-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 my-1 rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-sleep text-white"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          {isOpen ? "睡眠管理系統 v1.0" : "v1.0"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
