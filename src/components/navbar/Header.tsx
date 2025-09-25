import { Link } from "react-router-dom";
import logo from "../../assets/VideoCallLogo.svg";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { refreshData } from "../../api/users";
import userInfoStore from "../../store/auth/authStore";

function Header() {
  const userData = userInfoStore((state) => state?.storeUserData);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") ?? "";
    refreshMutate({ accessToken });
  }, []);

  const { mutate: refreshMutate, isPending } = useMutation({
    mutationFn: refreshData,
    onSuccess: (response) => {
      console.log(response.message);
      userData(response.data);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
  if (isPending) {
    console.warn("Data fetching is in process....");
  }

  return (
    <header className="bg-transparent border-b-2 border-gray-800">
      <div className="mx-auto w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-primary" to="/">
              <span className="sr-only">Home</span>
              <img src={logo} className="h-auto w-8 object-cover" alt="Logo" />
            </Link>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-muted-foreground transition hover:text-background"
                    to="/"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <a
                    className="text-muted-foreground transition hover:text-background"
                    href="#"
                  >
                    Streamings
                  </a>
                </li>

                <li>
                  <a
                    className="text-muted-foreground transition hover:text-background"
                    href="#"
                  >
                    History
                  </a>
                </li>

                <li>
                  <a
                    className="text-muted-foreground transition hover:text-background"
                    href="#"
                  >
                    Services
                  </a>
                </li>

                <li>
                  <a
                    className="text-muted-foreground transition hover:text-background"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover focus:ring-3 focus:ring-ring focus:outline-none"
                to="/login"
              >
                Login
              </Link>

              <div className="hidden sm:flex">
                <Link
                  className="rounded-md bg-muted px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground focus:ring-3 focus:ring-ring focus:outline-none"
                  to="/sign-in"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="block md:hidden">
              <button className="rounded-sm bg-muted p-2 text-muted-foreground transition hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
