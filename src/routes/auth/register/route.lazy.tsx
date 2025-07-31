import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Users2,
} from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppForm } from "@/config/form";
import { registerUser } from "@/data/user";

export const Route = createLazyFileRoute("/auth/register")({
  component: RouteComponent,
});

const registerSchema = z.object({
  confirm_password: z.string().min(1, "Confirm password is required"),
  domain: z.string().min(1, "Domain is required"),
  email: z.email("Email is required"),
  organization_name: z.string().min(1, "Organization is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions",
  }),
});

function FeatureCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { isError, isSuccess, mutateAsync } = useMutation({
    mutationFn: registerUser,
  });

  const form = useAppForm({
    defaultValues: {
      confirm_password: "",
      domain: "",
      email: "",
      organization_name: "",
      password: "",
      terms: false,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
    validators: {
      onChange: registerSchema,
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4 py-8 lg:py-10">
        <div className="-mt-4 mb-4 text-center lg:-mt-8 lg:mb-15">
          <Link className="inline-flex items-center gap-2" href="/" to={""}>
            <img
              alt="X-Pilot"
              className="h-auto w-[250px] lg:w-[500px]"
              src="/x-pilot-1.webp"
            />
          </Link>
          <div className="-mt-10 lg:-mt-18">
            <span className="text-sm font-medium text-blue-600 lg:text-2xl">
              AI Sales Solutions
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-1 flex flex-col justify-center">
            <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-100 sm:p-6 lg:p-8">
              <div className="mb-6 text-center lg:mb-8">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Register
                </h2>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Register an account to get started
                </p>
              </div>

              {isError && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Something went wrong!</AlertTitle>
                  <AlertDescription>
                    There was an error registering your account. Please try
                    again.
                  </AlertDescription>
                </Alert>
              )}
              {isSuccess ? (
                <Alert>
                  <CheckCircle2 />
                  <AlertTitle>Registration successful!</AlertTitle>
                  <AlertDescription>
                    Please check your email to verify your account.
                  </AlertDescription>
                </Alert>
              ) : (
                <form
                  className="space-y-4 sm:space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <form.AppField name="email">
                    {(f) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <f.TextField
                          className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-blue-500 sm:h-12"
                          placeholder="m@example.com"
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="organization_name">
                    {(f) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Organization
                        </label>
                        <f.TextField
                          className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-blue-500 sm:h-12"
                          placeholder="ACME Inc."
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="domain">
                    {(f) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Domain
                        </label>
                        <f.TextField
                          className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-blue-500 sm:h-12"
                          placeholder="acme.com"
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="password">
                    {(f) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <f.PasswordField
                          className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-blue-500 sm:h-12"
                          placeholder="Password"
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField
                    name="confirm_password"
                    validators={{
                      onChange: ({ fieldApi, value }) => {
                        if (value !== fieldApi.form.getFieldValue("password")) {
                          return { message: "Passwords do not match" };
                        }
                      },
                    }}
                  >
                    {(f) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <f.PasswordField
                          className="h-10 rounded-xl border-gray-200 bg-gray-50 focus-visible:ring-blue-500 sm:h-12"
                          placeholder="Confirm Password"
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="terms">
                    {(f) => (
                      <div className="flex items-start space-x-2 py-4">
                        <input
                          checked={f.state.value}
                          className="mt-0.5 cursor-pointer"
                          onBlur={f.handleBlur}
                          onChange={(e) => f.handleChange(e.target.checked)}
                          type="checkbox"
                        />
                        <label className="text-sm text-gray-600">
                          I agree to the{" "}
                          <a className="text-blue-600 hover:underline" href="#">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a className="text-blue-600 hover:underline" href="#">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    )}
                  </form.AppField>

                  <form.AppForm>
                    <form.Submit className="h-10 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-md sm:h-12">
                      Register
                    </form.Submit>
                  </form.AppForm>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                        to="/auth/login"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </form>
              )}

              <div className="mt-4 text-center text-xs text-gray-500 sm:mt-6">
                By continuing, you agree to our Terms of Service
              </div>
            </div>
          </div>

          <div className="order-2 hidden flex-col items-center justify-center space-y-8 sm:space-y-12 lg:flex">
            <div className="max-w-lg px-4">
              <h2 className="mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-center text-3xl font-bold tracking-tight text-transparent sm:mb-8 sm:text-5xl">
                FASTER REPLIES,
                <br />
                SMARTER DEALS
              </h2>

              <div className="relative mb-8 sm:mb-16">
                <div className="absolute top-1/2 -left-4 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600 sm:-left-6 sm:h-3 sm:w-3"></div>
                <p className="text-center text-lg leading-relaxed font-medium text-blue-600 sm:text-xl">
                  AI-Driven Solutions for Smart Leads, Data Insights, and
                  Seamless Global Trade Operations.
                </p>
                <div className="absolute top-1/2 -right-4 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600 sm:-right-6 sm:h-3 sm:w-3"></div>
              </div>

              <div className="grid gap-4 sm:gap-5">
                <FeatureCard
                  description="Engage prospects with inteligent, personalized conversations"
                  icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="AI-Powered Sales Conversations"
                />

                <FeatureCard
                  description="Organize and track your customer relationships effortlessly"
                  icon={<Users2 className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Simple Customer Management"
                />

                <FeatureCard
                  description="Find and qualify new leads with powerful AI tools"
                  icon={<Search className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Easy Lead Sourcing"
                />

                <FeatureCard
                  description="Never miss an opportunity with automated follow-ups"
                  icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
                  title="Automatic Follow-up Tasks"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
