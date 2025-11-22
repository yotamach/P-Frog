import { Fragment } from "react";
import { menuItems } from "@data/constans/MenuItems";
import { Footer, Header, Main, SideNav } from "@components/index";

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* Modern Header */}
      <header className="app-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
            PF
          </div>
          <span className="text-xl font-semibold text-gray-900">P-Frog</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Modern Sidebar */}
        <aside className="app-sidebar">
          <SideNav menuItems={menuItems} color={'gray-700'} />
        </aside>

        {/* Main Content */}
        <main className="app-main min-h-full">
          <Main />
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="h-12 border-t border-border bg-white flex items-center px-6 text-sm text-muted-foreground">
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
