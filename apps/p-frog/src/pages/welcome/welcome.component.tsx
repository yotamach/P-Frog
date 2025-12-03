import { Fragment } from "react";
import { Footer, Header } from "@components/index";

/* eslint-disable-next-line */
export interface WelcomeProps {}

export function Welcome(props: WelcomeProps) {
  return (
    <Fragment>
      <Header title={'LOGO'} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
              Welcome to P-Frog
            </h1>
            <p className="mt-3 text-base" style={{ color: 'hsl(var(--table-text-muted))' }}>
              Streamline your project planning, task tracking, and team collaboration in a single modern workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/90 p-8 shadow-lg">
            <ul className="space-y-3 text-sm" style={{ color: 'hsl(var(--sidebar-text))' }}>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-create))' }} />
                <span>Organize tasks into intuitive boards and monitor progress in real time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-edit))' }} />
                <span>Visualize project health with dashboards tailored for your team.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-delete))' }} />
                <span>Collaborate securely with role-based access and instant notifications.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}

export default Welcome;
