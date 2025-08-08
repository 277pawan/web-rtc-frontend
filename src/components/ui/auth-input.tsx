import * as React from "react";

import { cn } from "../../lib/utils";
const AuthInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md border-0 border-auth-input-border bg-auth-input px-4 py-3 text-sm text-auth-foreground placeholder:text-auth-muted transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-auth-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
AuthInput.displayName = "AuthInput";

export { AuthInput };
