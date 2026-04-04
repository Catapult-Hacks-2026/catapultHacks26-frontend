export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-surface px-10 py-12">
      <div className="max-w-4xl rounded-[2rem] bg-surface-container-lowest p-10 shadow-ambient-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
          Workspace
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tighter text-on-surface">
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
