import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { storage } from '@/lib/storage';

export default function AppLayout({ children }: { children: ReactNode }) {
  const name = storage.get<string>('detecther_name', '');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome back, <span className="font-semibold text-foreground">{name || 'User'}</span>
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-xs text-right hidden md:block">
              ⚠️ This app does not provide medical diagnosis.
            </p>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
