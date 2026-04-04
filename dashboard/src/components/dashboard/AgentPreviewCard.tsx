export function AgentPreviewCard() {
  return (
    <div className="rounded-xl bg-surface-container-low p-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
        Agent Preview
      </p>
      <div className="mt-6 space-y-4 rounded-3xl bg-surface-container-lowest p-6 shadow-ambient-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Deployment Window
          </p>
          <p className="mt-2 text-xl font-bold text-on-surface">
            Oct 12, 2024 - Oct 18, 2024
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Service Mode
          </p>
          <p className="mt-2 text-sm text-on-surface-variant">Hotel</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Negotiation Brief
          </p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            120 deluxe rooms, 5 suites, flexible attrition language, and
            airport transfer coverage for executive arrivals.
          </p>
        </div>
      </div>
    </div>
  );
}
