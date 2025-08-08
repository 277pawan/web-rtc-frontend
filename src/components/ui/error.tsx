import * as React from "react";
import { cn } from "../../lib/utils";

interface ErrorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  message?: string;
}

const ErrorInput = React.forwardRef<HTMLInputElement, ErrorInputProps>(
  ({ className, message, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-destructive mt-1", className)}
        {...props}
      >
        {message}
      </p>
    );
  },
);

ErrorInput.displayName = "ErrorInput";

export { ErrorInput };
