import { menuItems } from "@data/constans/MenuItems";
import { Footer, Header, Main, SideNav } from "@components/index";

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Header - Full Width */}
      <Header />

      {/* Main Layout - Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside 
          className="overflow-y-auto" 
          style={{ 
            width: 'var(--sidebar-width)', 
            backgroundColor: 'hsl(var(--sidebar-bg))', 
            borderRight: '1px solid hsl(var(--sidebar-border))'
          }}
        >
          <SideNav menuItems={menuItems} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
          <Main />
        </main>
      </div>

      {/* Footer - Full Width */}
      <footer 
        className="flex items-center justify-center px-6 py-4 text-sm text-white" 
        style={{ backgroundColor: 'hsl(var(--footer-bg))' }}
      >
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
