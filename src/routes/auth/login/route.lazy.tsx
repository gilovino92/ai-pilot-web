import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createLazyFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <Button
            className="w-full"
            onClick={() => {
              auth.signinRedirect({
                redirect_uri: window.location.href,
              });
            }}
          >
            Continue with Pilot SSO
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline underline-offset-4" to="/auth/register">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground justify-center text-center text-sm">
        By continuing, you agree to our Terms of Service
      </div>
    </div>
  );
}
