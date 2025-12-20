import { Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface NotFoundProps {}

export function NotFound(props: NotFoundProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'hsl(var(--secondary))' }}
    >
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-white/95 p-10 shadow-2xl backdrop-blur">
        <p
          className="text-sm font-semibold uppercase tracking-[0.3em]"
          style={{ color: 'hsl(var(--table-text-muted))' }}
        >
          404
        </p>
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Page not found
        </h1>
        <p className="text-base" style={{ color: 'hsl(var(--table-text-muted))' }}>
          The page you are looking for doesn&apos;t exist or has been moved. Check the URL or head back to a
          known destination.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center"
          >
            Go to dashboard
          </Link>
          <Link
            to="/login"
            className="btn-secondary inline-flex items-center justify-center"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
