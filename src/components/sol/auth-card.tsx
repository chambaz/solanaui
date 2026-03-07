import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AuthProvider {
  name: string;
  icon: React.ReactNode;
}

interface AuthCardProps extends React.ComponentProps<"div"> {
  title?: string;
  description?: string;
  showEmail?: boolean;
  socialProviders?: AuthProvider[];
  walletProviders?: AuthProvider[];
}

// --- Default provider icons ---

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="Google"
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="X"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="Apple"
  >
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

const PhantomIcon = () => (
  <svg
    viewBox="0 0 512 512"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="Phantom"
  >
    <path d="M60.5 512c65.2 0 114.2-68.2 143.5-122.2-3.6 11.9-5.5 23.9-5.5 35.3 0 31.5 15 54 44.7 54 40.7 0 84.2-43 106.7-89.2-1.6 6.7-2.4 12.9-2.4 18.6 0 22 10.3 35.8 31.2 35.8 66 0 132.5-140.8 132.5-263.9C511.2 84.5 470.8 0 369.6 0 191.7 0 0 261.5 0 430.4 0 496.7 29.6 512 60.5 512zm247.9-342.1c0-23.9 11-40.6 27.2-40.6 15.8 0 26.9 16.7 26.9 40.6s-11.1 41-26.9 41c-16.2 0-27.2-17.2-27.2-41zm84.6 0c0-23.9 11-40.6 27.3-40.6 15.8 0 26.9 16.7 26.9 40.6s-11.1 41-26.9 41c-16.3 0-27.3-17.2-27.3-41z" />
  </svg>
);

const BackpackIcon = () => (
  <svg
    viewBox="0 0 512 512"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="Backpack"
  >
    <path d="M386 369c18 0 27 0 32 5 6 6 6 15 6 33v25c0 36 0 54-11 65s-29 11-65 11H153c-36 0-54 0-65-11s-11-29-11-65v-25c0-18 0-27 5-33 6-5 15-5 33-5h236z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M250 76c176 0 174 118 174 174s0 7 0 7c0 10-8 19-19 19H96c-10 0-19-9-19-19 0 0 0-7 0-63 0-56-2-118 173-118zm0 45c-30 0-54 24-54 54s24 54 54 54 54-24 54-54-24-54-54-54z"
    />
    <path d="M250 3c38 0 71 13 80 35 1 4 2 5 1 7-1 1-4 1-8 0-12-2-29-4-43-4-10-1-20-1-30-1-10 0-20 0-30 1-15 0-32 2-43 4-5 1-7 1-8 0-1-2-1-3 1-7 8-22 41-35 80-35z" />
  </svg>
);

const SolflareIcon = () => (
  <svg
    viewBox="0 0 512 512"
    className="size-4"
    fill="currentColor"
    role="img"
    aria-label="Solflare"
  >
    <path d="M244 276l34-33 64 21c42 14 62 39 62 75 0 27-10 45-31 68l-7 7 3-16c9-59-8-85-66-103L244 276zM158 74l174 58-38 36-90-30c-31-11-42-27-46-62v-2zM148 368l39-38 74 24c39 13 52 30 48 72L148 368zM98 200c0-11 6-22 16-30 10 15 28 28 56 37l62 21-34 33-61-20c-28-9-39-23-39-41zM280 504c127-85 196-142 196-213 0-47-28-73-89-93l-46-16 127-121-25-27-38 33-178-59c-55 18-124 71-124 124 0 6 0 12 2 18-46 26-63 50-63 80 0 29 15 57 63 73l38 13-132 127 26 27 41-38 204 73z" />
  </svg>
);

const DEFAULT_SOCIAL_PROVIDERS: AuthProvider[] = [
  { name: "Google", icon: <GoogleIcon /> },
  { name: "X", icon: <XIcon /> },
  { name: "Apple", icon: <AppleIcon /> },
];

const DEFAULT_WALLET_PROVIDERS: AuthProvider[] = [
  { name: "Phantom", icon: <PhantomIcon /> },
  { name: "Backpack", icon: <BackpackIcon /> },
  { name: "Solflare", icon: <SolflareIcon /> },
];

const AuthCard = ({
  title = "Sign in",
  description = "Connect your wallet or sign in below.",
  showEmail = true,
  socialProviders = DEFAULT_SOCIAL_PROVIDERS,
  walletProviders = DEFAULT_WALLET_PROVIDERS,
  className,
  ...props
}: AuthCardProps) => {
  return (
    <div
      className={cn("flex flex-col gap-4 max-w-sm w-full", className)}
      {...props}
    >
      <div className="flex flex-col gap-2 items-center justify-center pb-2">
        <h2 className="text-2xl font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground text-center">
          {description}
        </p>
      </div>

      {showEmail && (
        <form>
          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="Your email address"
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      )}

      {socialProviders.length > 0 && (
        <>
          {showEmail && <Separator />}
          <div className="flex gap-3 justify-center">
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="secondary"
                size="icon"
                aria-label={`Sign in with ${provider.name}`}
              >
                {provider.icon}
              </Button>
            ))}
          </div>
        </>
      )}

      {walletProviders.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            {walletProviders.map((wallet) => (
              <Button
                key={wallet.name}
                variant="secondary"
                className="gap-2 justify-start"
              >
                {wallet.icon}
                {wallet.name}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export type { AuthCardProps, AuthProvider };
export { AuthCard };
