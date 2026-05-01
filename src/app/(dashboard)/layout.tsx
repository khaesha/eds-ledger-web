import Sidebar from '@/components/layout/Sidebar';
import EddaAvatar from '@/components/edward/EdwardAvatar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-edward-navy overflow-hidden">
      {/* Sidebar — fixed left */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="
          h-16 px-6 flex items-center justify-between
          border-b border-white/5 bg-edward-navy shrink-0
        "
        >
          <h1 className="text-edward-amber font-bold text-lg hidden md:block">
            Ed&apos;s Ledger
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-edward-muted text-sm">
              {new Date().toLocaleDateString('en-ID', {
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>

      {/* Edda floating avatar */}
      <EddaAvatar />
    </div>
  );
}
