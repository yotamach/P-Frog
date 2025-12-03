import BasicDetails from './components/basic-details/basic-details.component';
import MoreDetails from './components/more-details/more-details.component';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Registration(props: TasksProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 p-6">
      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Create your account
        </h1>
        <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
          Provide a few details so we can tailor the workspace to your team.
        </p>
      </header>

      <form className="space-y-8">
        <BasicDetails />
        <MoreDetails />
      </form>
    </div>
  );
}

export default Registration;
