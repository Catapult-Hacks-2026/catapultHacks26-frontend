export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-surface px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      <div className="max-w-4xl rounded-[2rem] bg-surface-container-lowest p-6 shadow-ambient-sm sm:p-8 lg:p-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
          Workspace
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tighter text-on-surface sm:text-5xl">
          Settings
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant">
          Control agent approvals, escalation preferences, audit exports, and
          procurement program defaults for Galileo deployments.
        </p>
      </div>
    </div>
  );
}
