import {
  Outlet,
  useNavigate,
  Link,
  NavLink as RouterNavLink,
} from "react-router-dom";
import { Home, Users, User, LucideIcon } from "lucide-react";
import {
  Header,
  HeaderContainer,
  HeaderBrand,
  HeaderNav,
  HeaderActions,
} from "../shared/Header";
import { Button } from "@garden/ui/components/button";

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
      <Icon className="w-4 h-4" />
      {children}
    </RouterNavLink>
  );
}

export function MainLayout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/login");
  };

  return (
    <>
      <Header>
        <HeaderContainer>
          <HeaderBrand>
            <Link
              to="/"
              className="font-semibold text-lg flex items-center gap-1.5"
            >
              🌱 growcult
            </Link>
          </HeaderBrand>
          <HeaderNav>
            <NavLink to="/" icon={Home}>
              Home
            </NavLink>
            <NavLink to="/cults" icon={Users}>
              Cults
            </NavLink>
            <NavLink to="/profile" icon={User}>
              Profile
            </NavLink>
          </HeaderNav>
          <HeaderActions>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </HeaderActions>
        </HeaderContainer>
      </Header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
