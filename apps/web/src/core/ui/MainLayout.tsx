import { Outlet, Link, NavLink as RouterNavLink } from "react-router-dom";
import { House, Users, User, LucideIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";
import {
  Header,
  HeaderContainer,
  HeaderBrand,
  HeaderNav,
  HeaderActions,
} from "./Header";
import { Button } from "@garden/ui/components/button";
import { UserMenu } from "./UserMenu";
import { APP_NAME, ROUTES } from "../config";
import { APP_SHELL_DESKTOP_ONLY, APP_SHELL_MOBILE_ONLY } from "./breakpoints";

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
          <Icon
            className="w-4 h-4"
            strokeWidth={
              isActive
                ? "var(--icon-stroke-width-active)"
                : "var(--icon-stroke-width)"
            }
          />
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
          <Icon
            className="w-5 h-5"
            strokeWidth={
              isActive
                ? "var(--icon-stroke-width-active)"
                : "var(--icon-stroke-width)"
            }
          />
          <span className="text-xs">{children}</span>
        </>
      )}
    </RouterNavLink>
  );
}

export function MainLayout() {
  const auth = useAuth();

  return (
    <div className="app-shell w-full flex flex-col overflow-hidden">
      <div className={`shrink-0 ${APP_SHELL_DESKTOP_ONLY}`}>
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
            {auth.isAuthenticated && (
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
            )}
            <HeaderActions>
              {auth.isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => auth.signinRedirect()}
                  disabled={auth.isLoading}
                >
                  Sign In
                </Button>
              )}
            </HeaderActions>
          </HeaderContainer>
        </Header>
      </div>

      <div className={`shrink-0 ${APP_SHELL_MOBILE_ONLY}`}>
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
              {auth.isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => auth.signinRedirect()}
                  disabled={auth.isLoading}
                >
                  Sign In
                </Button>
              )}
            </HeaderActions>
          </HeaderContainer>
        </Header>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>

      {auth.isAuthenticated && (
        <nav
          className={`${APP_SHELL_MOBILE_ONLY} shrink-0 bg-nav border-t border-border shadow-nav-up pb-[env(safe-area-inset-bottom)]`}
        >
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
      )}
    </div>
  );
}
