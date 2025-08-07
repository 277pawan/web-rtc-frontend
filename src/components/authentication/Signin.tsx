import { Checkbox } from "../ui/checkbox";
import { AuthButton } from "../ui/auth-button";
import { Link } from "react-router-dom";
import { AuthInput } from "../ui/auth-input";
import heroImage from "../../assets/Signin.png";
const Signin = () => {
  const handleSignIn = () => {
    // Handle sign in logic
  };

  const handleCreateAccount = () => {
    // const emailInput = document.querySelector('input[type="email"]');
    // if (emailInput.checkValidity()) {
    //   alert("Create account logic placeholder");
    // } else {
    //   // Provide feedback to the user that the email is invalid
    //   alert("Please enter a valid email address.");
    // }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic
  };

  const handleFacebookSignIn = () => {
    // Handle Facebook sign in logic
  };

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
          <form className="space-y-6">
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
                required
              />
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
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-auth-foreground mb-2"
              >
                Password
              </label>
              <AuthInput
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
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

            <AuthButton type="submit" className="w-full">
              Create Account
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
