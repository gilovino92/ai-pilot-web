import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

import { cn } from "@/components/libs/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createLazyFileRoute("/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <header className="sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <Link className="flex cursor-pointer items-center gap-3" to="/">
              <img alt="logo" className="h-16 w-auto" src="/x-pilot-1.webp" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <Button
                    className="cursor-pointer rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      auth.signinRedirect({
                        redirect_uri: window.location.href,
                      });
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    Log in
                  </Button>
                  <Button
                    asChild
                    className="cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    variant="default"
                  >
                    <Link to="/auth/register">Register</Link>
                  </Button>
                </div>
              </div>
              <div className="md:hidden">
                <Sheet
                  onOpenChange={setIsMobileMenuOpen}
                  open={isMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button className="rounded-lg" size="icon" variant="ghost">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[280px] p-0" side="right">
                    <div className="flex h-full flex-col">
                      <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                              <span className="text-base font-medium">X</span>
                            </div>
                            <span className="text-lg font-medium text-gray-900">
                              X-Pilot
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto py-2">
                        <>
                          <Button
                            className="flex w-full items-center justify-start gap-2 rounded-none px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              auth.signinRedirect({
                                redirect_uri: window.location.href,
                              });
                            }}
                            variant="ghost"
                          >
                            <svg
                              className="lucide lucide-log-in"
                              fill="none"
                              height="16"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                              <polyline points="10 17 15 12 10 7" />
                              <line x1="15" x2="3" y1="12" y2="12" />
                            </svg>
                            <span>Log in</span>
                          </Button>
                          <Button
                            className="flex w-full items-center justify-start gap-2 rounded-none px-4 py-2 text-gray-700 hover:bg-gray-100"
                            variant="ghost"
                          >
                            <Link to="/auth/register">
                              <svg
                                className="lucide lucide-user-plus"
                                fill="none"
                                height="16"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" x2="19" y1="8" y2="14" />
                                <line x1="22" x2="16" y1="11" y2="11" />
                              </svg>
                              <span>Register</span>
                            </Link>
                          </Button>
                        </>
                      </div>
                      <div className="border-t p-4">
                        <div className="text-xs text-gray-500">
                          © 2025 X-Pilot AI
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="container mx-auto flex w-full flex-col px-4">
          <div className="flex w-full flex-col items-center justify-center">
            <h1 className="mt-10 mb-10 text-4xl font-semibold text-gray-800">
              Your Trading Edge, One Question Away
            </h1>
            <div
              className={cn(
                "relative h-[700px] w-full max-w-3xl",
                isIframeReady ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="absolute z-10 hidden h-[56px] w-full rounded-t-[12px] border-t border-r border-l border-[#10182814] md:block md:bg-[#F8FAFB]"></div>
              <iframe
                allow="microphone"
                frameBorder="0"
                onLoad={() => {
                  setIsIframeReady(true);
                }}
                src="https://dify.agripilot.xyz/chatbot/CPq8fNotV8FWFJZM"
                style={{
                  height: "100%",
                  minHeight: "300px",
                  width: "100%",
                }}
              ></iframe>
              <div className="absolute bottom-0 z-1 h-[58px] w-full bg-white md:hidden"></div>
            </div>
            <div className="z-2 mt-[-30px] w-full max-w-3xl md:py-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
