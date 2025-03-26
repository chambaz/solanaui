import React from "react";

import { validatePublicKey, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const PKInput = ({ ...props }: React.ComponentPropsWithoutRef<"input">) => {
  const [value, setValue] = React.useState("");
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [hasBlurred, setHasBlurred] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateField = React.useCallback(() => {
    const isValid = validatePublicKey(value);

    if (inputRef.current) {
      if (!isValid) {
        inputRef.current.setCustomValidity("Invalid public key");
      } else {
        inputRef.current.setCustomValidity("");
      }

      setIsInvalid(!inputRef.current.validity.valid);
    }
  }, [value]);

  const handleBlur = React.useCallback(() => {
    setHasBlurred(true);
    validateField();
  }, [validateField]);

  React.useEffect(() => {
    if (hasBlurred) {
      validateField();
    }
  }, [value, validateField, hasBlurred]);

  return (
    <Input
      ref={inputRef}
      type="text"
      {...props}
      className={cn(
        "outline-none",
        props.className,
        isInvalid && "border-destructive focus-visible:ring-destructive",
      )}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      aria-invalid={isInvalid}
    />
  );
};

export { PKInput };
