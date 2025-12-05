import { useNavigate } from "react-router-dom";
import { AuthPanel } from "../../shared/AuthPanel";
import { Button } from "@garden/ui/components/button";

export function LoginPage() {
  const navigate = useNavigate();

  const handleGoToHomePage = () => {
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          🌱 growcult
        </h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>
      <AuthPanel />

      <div className="mt-6">
        <Button
          onClick={handleGoToHomePage}
          className="w-full"
          variant="secondary"
        >
          Go to Home Page
        </Button>
      </div>
    </div>
  );
}
