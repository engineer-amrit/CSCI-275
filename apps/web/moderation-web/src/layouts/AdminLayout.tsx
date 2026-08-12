import { useState, type ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface AdminLayoutProps {
  items: NavItem[];
  activeItem: string;
  onNavigate: (id: string) => void;
  title: string;
  description?: string;
  onLogout: () => void;
  children: ReactNode;
}

export function AdminLayout({
  items,
  activeItem,
  onNavigate,
  title,
  description,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-primary-950">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-9 h-9 bg-secondary-500 rounded-lg flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold leading-tight">Moderation</div>
          <div className="text-primary-300 text-xs leading-tight">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
          Moderation
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeItem === item.id
                ? "bg-primary-700/60 text-white"
                : "text-primary-200 hover:text-white hover:bg-primary-800/60"
            }`}
          >
            <span
              className={`shrink-0 ${
                activeItem === item.id
                  ? "text-secondary-400"
                  : "text-primary-300"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">
              Amrit Singh
            </div>
            <div className="text-xs text-primary-300 truncate">
              Administrator
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-2 rounded-lg text-primary-300 hover:text-white hover:bg-primary-800/60 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-gray-500 hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-100 text-tertiary-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-500" />
              Online
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
