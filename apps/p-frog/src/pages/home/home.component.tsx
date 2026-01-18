import { menuItems } from "@data/constans/MenuItems";
import { Footer, Header, SideNav, PageTransition } from "@components/index";
import { Outlet } from 'react-router-dom';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header - fixed at top */}
      <Header />

      {/* Middle section with sidebar and main content */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar - 1/4 width on left */}
        <aside 
          className="w-1/4 shrink-0 h-full border-r overflow-y-auto"
          style={{
            backgroundColor: 'hsl(var(--sidebar-bg))',
            borderColor: 'hsl(var(--sidebar-border))'
          }}
        >
          <SideNav menuItems={menuItems} />
        </aside>

        {/* Main content - 3/4 width fills remaining space */}
        <main 
          className="w-3/4 shrink-0 h-full overflow-auto p-8 relative"
          style={{
            backgroundColor: 'hsl(var(--table-selected))'
          }}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Footer - fixed at bottom */}
      <footer 
        className="flex items-center justify-center shrink-0 text-white text-sm"
        style={{
          height: 'var(--footer-height)',
          backgroundColor: 'hsl(var(--footer-bg))'
        }}
      >
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
