import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CardDescription>
            Sign in to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={handleLogin}
            size="lg"
            data-testid="button-login"
          >
            Sign In
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Sign in with Google, GitHub, Email, or other methods
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
