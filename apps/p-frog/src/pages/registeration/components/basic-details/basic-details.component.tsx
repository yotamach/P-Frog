/* eslint-disable-next-line */
export interface BasicDetailsProps {}

export function BasicDetails(props: BasicDetailsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-dashed border-white/40 bg-white/80 p-6 shadow-sm">
      <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--sidebar-text))' }}>
        Account details
      </h2>
      <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
        Choose a username and secure password to access your dashboard.
      </p>
    </section>
  );
}

export default BasicDetails;
