import { useAuth } from "react-oidc-context";
import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@garden/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@garden/ui/components/dropdown-menu";
import { Switch } from "@garden/ui/components/switch";
import { useTheme } from "./ThemeProvider";
import { signOutRedirect } from "../auth/cognito";

export function UserMenu() {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = () => {
    auth.removeUser();
    signOutRedirect();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user initials from email
  const getInitials = () => {
    const email = auth.user?.profile.email as string | undefined;
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={auth.user?.profile.picture as string | undefined}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {auth.user?.profile.email as string}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            toggleTheme();
          }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">Dark Mode</span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light");
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
