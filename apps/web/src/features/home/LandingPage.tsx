import { useAuth } from "react-oidc-context";
import { Button } from "@garden/ui/components/button";
import { APP_NAME } from "../../core/config";

export function LandingPage() {
  const auth = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to <span className="text-primary">{APP_NAME}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cultivate your garden and watch it bloom.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => auth.signinRedirect()}
            disabled={auth.isLoading}
          >
            Start Growing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="space-y-2">
            <div className="text-4xl">🌱</div>
            <h3 className="font-semibold text-lg">Plant Your Seeds</h3>
            <p className="text-sm text-muted-foreground">
              Start your garden from scratch and grow exactly what you want.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">🌿</div>
            <h3 className="font-semibold text-lg">Learn & Grow</h3>
            <p className="text-sm text-muted-foreground">
              Discover how to tend your garden and help it thrive.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">👥</div>
            <h3 className="font-semibold text-lg">Share the Harvest</h3>
            <p className="text-sm text-muted-foreground">
              Connect with fellow gardeners and grow together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
