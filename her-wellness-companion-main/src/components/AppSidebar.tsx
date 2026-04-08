import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard, ClipboardCheck, Stethoscope, MessageCircle, UserCheck,
  History, BookOpen, Shield, Bell, Settings, LogOut, Heart, TrendingUp, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '../assets/logo.png';

const mainNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Assessment', url: '/assessment', icon: ClipboardCheck },
  { title: 'Symptom Checker', url: '/symptoms', icon: Stethoscope },
  { title: 'AI Assistant', url: '/chatbot', icon: MessageCircle },
  { title: 'Doctor Connect', url: '/doctors', icon: UserCheck },
];

const insightsNav = [
  { title: 'Risk Prediction', url: '/prediction', icon: TrendingUp },
  { title: 'Behavior Simulator', url: '/simulator', icon: Sparkles },
  { title: 'Health History', url: '/history', icon: History },
];

const wellnessNav = [
  { title: 'Awareness Hub', url: '/awareness', icon: BookOpen },
  { title: 'Precautions', url: '/precautions', icon: Shield },
  { title: 'Reminders', url: '/reminders', icon: Bell },
  { title: 'Mood Check', url: '/mood', icon: Heart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();

  const handleClearData = () => {
    if (confirm('This will clear all your local data. Are you sure?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const renderGroup = (items: typeof mainNav, label?: string) => (
    <SidebarGroup>
      {label && !collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70 px-3">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                tooltip={item.title}
              >
                <NavLink to={item.url} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 flex items-center gap-3">
          <img src={logo} alt="DetectHer" className="w-9 h-9 flex-shrink-0" width={36} height={36} />
          {!collapsed && (
            <div>
              <h2 className="font-heading font-bold text-sm text-sidebar-foreground">DetectHer</h2>
              <p className="text-[10px] text-muted-foreground">AI Health Intelligence</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderGroup(mainNav, 'Main')}
          {renderGroup(insightsNav, 'AI Insights')}
          {renderGroup(wellnessNav, 'Wellness')}
        </div>

        <div className="p-3 space-y-2 border-t border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Theme</span>
              <ThemeToggle />
            </div>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleClearData} tooltip="Clear My Data">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Clear My Data</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip="Sign Out">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Sign Out</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
