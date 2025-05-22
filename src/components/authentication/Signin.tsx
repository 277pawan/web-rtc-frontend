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
    <section className="flex justify-center items-center">
      <div className=" m-2 flex flex-col px-4 py-14 text-base leading-6 bg-[#0a0a0a] text-white w-full max-w-lg border-2 border-gray-950 max-md:px-4 rounded-xl shadow-lg">
        <div className="self-center text-3xl font-bold leading-10 text-center text-white">
          Create an Account
        </div>
        <div className="flex gap-2 self-center mt-6 text-center">
          <div className="grow text-gray-400">Have an Account?</div>
          <button className="text-blue-600" onClick={handleSignIn}>
            Log In
          </button>
        </div>
        <div className="mt-12 text-sm leading-5 text-gray-500 max-md:mt-10">
          Email
        </div>
        <input
          type="email"
          className="justify-center items-start px-4 py-5 mt-2.5 bg-white rounded border border-solid border-slate-200 text-black max-md:pr-5"
          placeholder="Enter Email Address"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address"
          required
        />
        <div className="mt-7 text-sm leading-5 text-gray-400">Password</div>
        <input
          type="password"
          className="justify-center items-start px-4 py-5 mt-2.5 bg-white rounded border border-solid border-slate-200 text-black max-md:pr-5"
          placeholder="Create Password"
        />
        <button
          className="justify-center items-center px-16 py-5 mt-6 text-white bg-blue-600 rounded max-md:px-5"
          onClick={handleCreateAccount}
        >
          Create Account
        </button>
        <div className="self-center mt-7 text-sm leading-5 text-center text-gray-400">
          By creating account, you agree to our
        </div>
        <div className="self-center text-sm leading-5 text-center text-gray-400">
          <a href="/terms-of-service" className="text-blue-600">
            Terms of Service
          </a>
        </div>
        <div className="shrink-0 mt-7 h-px bg-zinc-200" />
        <div className="self-center mt-7 text-sm leading-5 text-center text-gray-400">
          Or create an account using:
        </div>
        <button
          className="flex justify-center items-center px-16 py-3 mt-7 text-blue-600 bg-white rounded border border-solid border-zinc-200 max-md:px-5"
          onClick={handleGoogleSignIn}
        >
          <div className="flex gap-2.5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a73199f1bb1d3ea89b40297fa0cb3c5a5d23d64a09d3c0065afa4619abb32ce?apiKey=597363a3080546f9b072bf59bebbfd17&"
              className="shrink-0 w-6 aspect-square"
              alt="Google Logo"
            />
            <div className="flex-auto my-auto">Continue with Google</div>
          </div>
        </button>
        <button
          className="flex justify-center items-center px-16 py-3 mt-3 text-blue-600 bg-white rounded border border-solid border-zinc-200 max-md:px-5"
          onClick={handleFacebookSignIn}
        >
          <div className="flex gap-2.5">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3feb9724a7eb37edc68e698d2bf9cfdafff2e78a2d0733da73a89c1beed3d397?apiKey=597363a3080546f9b072bf59bebbfd17&"
              className="shrink-0 w-6 aspect-square"
              alt="Facebook Logo"
            />
            <div className="flex-auto my-auto">Continue with Facebook</div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Signin;
