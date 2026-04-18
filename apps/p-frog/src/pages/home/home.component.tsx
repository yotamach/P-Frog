import { menuItems } from "@data/constans/MenuItems";
import { Footer, PageTransition } from "@components/index";
import { IconRail } from "@components/icon-rail/icon-rail";
import { ContentHeader } from "@components/content-header/content-header";
import { Outlet } from 'react-router-dom';
import { useStore } from '@tanstack/react-store';
import { authStore, selectUser } from '@data/store/authStore';
import { SystemRole } from '@p-frog/data';

const roleHierarchy: Record<SystemRole, number> = {
  [SystemRole.SUPERUSER]: 4,
  [SystemRole.ADMIN]: 3,
  [SystemRole.PROJECT_MANAGER]: 2,
  [SystemRole.MEMBER]: 1,
};

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  const user = useStore(authStore, selectUser);
  const userRole: SystemRole = user?.role ?? SystemRole.MEMBER;

  const visibleMenuItems = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    return (roleHierarchy[userRole] ?? 0) >= (roleHierarchy[item.requiredRole] ?? 0);
  });

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      {/* Icon Rail - fixed left */}
      <IconRail menuItems={visibleMenuItems} />

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
