import React from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Trello, 
  Calendar as CalendarIcon,
  Bell,
  Menu,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Trello },
    { id: 'schedule', label: 'Jadwal', icon: CalendarIcon },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0F172A] transition-all duration-300 flex flex-col transition-all border-r border-slate-800",
          isSidebarOpen ? "w-56" : "w-16"
        )}
      >
        <div className="p-6 flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold shadow-blue-500/20 shadow-lg">
            W
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight text-white">WiFiCRM B2B</span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
                activeTab === item.id 
                  ? "bg-blue-600/20 text-white font-semibold border-l-2 border-blue-500 rounded-l-none" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon size={16} className={cn(activeTab === item.id ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300")} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 p-2.5 rounded-lg flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center border border-slate-700 shadow-sm overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} alt="Avatar" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate leading-none mb-1">{profile?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{profile?.role}</p>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start text-slate-400 hover:text-rose-400 group h-9", isSidebarOpen ? "px-3" : "px-0 justify-center")}
            onClick={logout}
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="ml-2 text-xs font-semibold">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-50 rounded text-slate-400">
              <Menu size={18} />
            </button>
            <h2 className="font-bold text-base tracking-tight capitalize text-slate-800">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
             {/* Small header details can go here */}
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Active</span>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 relative h-9 w-9">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};
