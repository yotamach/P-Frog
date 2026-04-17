import { menuItems } from "@data/constans/MenuItems";
import { Footer, PageTransition } from "@components/index";
import { IconRail } from "@components/icon-rail/icon-rail";
import { ContentHeader } from "@components/content-header/content-header";
import { Outlet } from 'react-router-dom';

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      {/* Icon Rail - fixed left */}
      <IconRail menuItems={menuItems} />

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Content Header */}
        <ContentHeader />

        {/* Main content */}
        <main
          className="flex-1 overflow-auto p-8 relative"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Footer */}
        <footer
          className="flex items-center justify-center shrink-0 text-sm"
          style={{
            height: 'var(--footer-height)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default Home;
