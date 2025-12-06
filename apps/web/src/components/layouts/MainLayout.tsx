import {
  Outlet,
  useNavigate,
  Link,
  NavLink as RouterNavLink,
} from "react-router-dom";
import { House, Users, User, LucideIcon } from "lucide-react";
import {
  Header,
  HeaderContainer,
  HeaderBrand,
  HeaderNav,
  HeaderActions,
} from "../shared/Header";
import { Button } from "@garden/ui/components/button";
import { ThemeToggle } from "../shared/ThemeToggle";
import { APP_NAME, ROUTES } from "../../config";

function NavLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors hover:bg-accent ${
          isActive ? "bg-accent text-foreground font-medium" : ""
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
          {children}
        </>
      )}
    </RouterNavLink>
  );
}

function MobileNavLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-md transition-colors flex-1 ${
          isActive ? "text-foreground font-medium" : "text-muted-foreground"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
          <span className="text-xs">{children}</span>
        </>
      )}
    </RouterNavLink>
  );
}

export function MainLayout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header>
          <HeaderContainer>
            <HeaderBrand>
              <Link
                to={ROUTES.HOME}
                className="font-semibold text-lg flex items-center gap-1.5"
              >
                🌱 {APP_NAME}
              </Link>
            </HeaderBrand>
            <HeaderNav>
              <NavLink to={ROUTES.HOME} icon={House}>
                Home
              </NavLink>
              <NavLink to={ROUTES.CULTS} icon={Users}>
                Cults
              </NavLink>
              <NavLink to={ROUTES.PROFILE} icon={User}>
                Profile
              </NavLink>
            </HeaderNav>
            <HeaderActions>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </HeaderActions>
          </HeaderContainer>
        </Header>
      </div>

      {/* Mobile Header - Brand and Sign Out */}
      <div className="md:hidden">
        <Header>
          <HeaderContainer>
            <HeaderBrand>
              <Link
                to={ROUTES.HOME}
                className="font-semibold text-lg flex items-center gap-1.5"
              >
                🌱 {APP_NAME}
              </Link>
            </HeaderBrand>
            <HeaderActions>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </HeaderActions>
          </HeaderContainer>
        </Header>
      </div>

      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nav border-t border-border shadow-nav-up">
        <div className="flex justify-around items-center max-w-7xl mx-auto">
          <MobileNavLink to={ROUTES.HOME} icon={House}>
            Home
          </MobileNavLink>
          <MobileNavLink to={ROUTES.CULTS} icon={Users}>
            Cults
          </MobileNavLink>
          <MobileNavLink to={ROUTES.PROFILE} icon={User}>
            Profile
          </MobileNavLink>
        </div>
      </nav>
    </>
  );
}
