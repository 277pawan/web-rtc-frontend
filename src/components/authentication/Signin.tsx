import { Checkbox } from "../ui/checkbox";
import { AuthButton } from "../ui/auth-button";
import { Link } from "react-router-dom";
import { AuthInput } from "../ui/auth-input";
import heroImage from "../../assets/Signin.png";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { ErrorInput } from "../ui/error";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAnimation, motion, time } from "framer-motion";
import {
  SignInFormData,
  signInValidation,
} from "../../validations/signInValidation";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../../api/users";
import { toast } from "sonner";
const Signin = () => {
  const controls = useAnimation();

  // form state management
  const {
    register,
    handleSubmit,
    reset: SignInReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInValidation),
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    mutate: SignInMutate,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: createUser,
    onSuccess: (response) => {
      toast.success(response.message);
      SignInReset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Submit function for Form
  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    SignInMutate(data);
  };
  // TODO to add google login
  // const handleGoogleSignIn = () => {
  //   // Handle Google sign in logic
  // };

  return (
    <div className="min-h-[92.9vh] bg-auth-background flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Professional team collaboration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-auth-background/40 to-transparent" />
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-auth-foreground">
              Join us today 👋
            </h1>
            <p className="text-auth-muted text-lg leading-relaxed">
              Seamless Video Calling: Connect Anytime, Anywhere
            </p>
          </div>

          {/* Google Sign Up */}
          <AuthButton variant="google" className="w-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </AuthButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-auth-input-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-auth-background text-auth-muted">
                or
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-auth-foreground mb-2"
              >
                First & Last Name
              </label>
              <AuthInput
                id="name"
                type="text"
                placeholder="i.e. Davon Lean"
                {...register("name")}
              />
              {errors.name && <ErrorInput message={errors.name.message} />}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-auth-foreground mb-2"
              >
                Email Address
              </label>
              <AuthInput
                id="email"
                type="email"
                placeholder="i.e. davon@mail.com"
                {...register("email")}
              />
              {errors.email && <ErrorInput message={errors.email.message} />}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-background">
                Password
              </label>
              <div className="relative group">
                <AuthInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Type your password here..."
                  {...register("password")}
                />
                {errors.password && (
                  <ErrorInput message={errors.password.message} />
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-5 transform -translate-y-1/4 text-muted-foreground hover:text-background transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                className="border-auth-input-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="terms" className="text-sm text-auth-muted">
                I agree with the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </Link>{" "}
                of Clarity
              </label>
            </div>

            {/* Submit Button */}
            <AuthButton
              type="submit"
              className="w-full"
              onMouseEnter={() => {
                controls.start({
                  x: [0, 5, 0], // move right by 5px and back
                  transition: {
                    repeat: Infinity,
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                });
              }}
              onMouseLeave={() => {
                controls.stop();
                controls.start({ x: 0 }); // reset position
              }}
            >
              {isPending ? "Creating.." : "Create Account"}
              <motion.div animate={controls}>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.div>
            </AuthButton>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-auth-muted">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
