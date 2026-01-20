import { Fragment } from "react";
import { Footer, Header, Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@components/index";
import { Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface WelcomeProps {}

export function Welcome(props: WelcomeProps) {
  return (
    <Fragment>
      <Header title={'LOGO'} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
              Welcome to P-Frog
            </h1>
            <p className="mt-4 text-lg" style={{ color: 'hsl(var(--table-text-muted))' }}>
              Streamline your project planning, task tracking, and team collaboration in a single modern workspace.
            </p>
          </div>

          {/* Features Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-blue-200 bg-white/95 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-create))' }} />
                <CardTitle className="text-xl" style={{ color: 'hsl(var(--sidebar-text))' }}>Task Management</CardTitle>
                <CardDescription style={{ color: 'hsl(var(--table-text-muted))' }}>
                  Organize tasks into intuitive boards and monitor progress in real time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-bordo-200 bg-white/95 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-edit))' }} />
                <CardTitle className="text-xl" style={{ color: 'hsl(var(--sidebar-text))' }}>Dashboards</CardTitle>
                <CardDescription style={{ color: 'hsl(var(--table-text-muted))' }}>
                  Visualize project health with dashboards tailored for your team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200 bg-white/95 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <div className="mb-2 h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--color-button-delete))' }} />
                <CardTitle className="text-xl" style={{ color: 'hsl(var(--sidebar-text))' }}>Collaboration</CardTitle>
                <CardDescription style={{ color: 'hsl(var(--table-text-muted))' }}>
                  Collaborate securely with role-based access and instant notifications.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Card */}
          <Card className="border-blue-200 bg-white/95 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'hsl(var(--sidebar-text))' }}>
                    Ready to get started?
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
                    Sign in to access your workspace or create a new account.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/registration">
                    <Button size="lg" variant="outline">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
}

export default Welcome;
