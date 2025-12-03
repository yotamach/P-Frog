/* eslint-disable-next-line */
export interface MoreDetailsProps {}

export function MoreDetails(props: MoreDetailsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/40 bg-white/80 p-6 shadow-sm">
      <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--sidebar-text))' }}>
        Team preferences
      </h2>
      <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
        Tell us more about your team and notification preferences to personalize the experience.
      </p>
    </section>
  );
}

export default MoreDetails;
