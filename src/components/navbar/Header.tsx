import { Link } from "react-router-dom";
import logo from "../../assets/VideoCallLogo.svg";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { refreshData } from "../../api/users";
import userInfoStore from "../../store/auth/authStore";
import {
  ChevronDown,
  User,
  Settings,
  Download,
  HelpCircle,
  LogOut,
  Circle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const userDataSet = userInfoStore((state) => state?.storeUserData);
  const userInfo = userInfoStore((state) => state);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") ?? "";
    refreshMutate({ accessToken });
  }, []);

  const { mutate: refreshMutate, isPending } = useMutation({
    mutationFn: refreshData,
    onSuccess: (response) => {
      console.log(response.message);
      userDataSet(response.data);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    localStorage.removeItem("accessToken");
    setOpen(false);
  };

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

          {!userInfo?.email ? (
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
            </div>
          ) : (
            <div className="relative">
              <div
                ref={triggerRef}
                className="flex justify-center items-center px-2 py-2 bg-white/90 backdrop-blur-sm rounded-sm gap-3 cursor-pointer shadow-sm border border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => setOpen(!open)}
              >
                <div className="relative">
                  <img
                    src="https://placehold.co/32"
                    alt="user profile"
                    className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                  />
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 text-white overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <img
                              src="https://placehold.co/48"
                              alt="user profile"
                              className="w-12 h-12 rounded-full border-3 border-white/30 object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {userInfo.name}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {userInfo.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <div
                        className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm text-gray-700 hover:bg-primary/5 hover:text-primary hover:translate-x-1"
                        onClick={() => {
                          console.log("View Profile clicked");
                          setOpen(false);
                        }}
                      >
                        <span className="opacity-70">
                          <User size={18} />
                        </span>
                        <span>View Profile</span>
                      </div>

                      <div
                        className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm text-gray-700 hover:bg-primary/5 hover:text-primary hover:translate-x-1"
                        onClick={() => {
                          console.log("Settings clicked");
                          setOpen(false);
                        }}
                      >
                        <span className="opacity-70">
                          <Settings size={18} />
                        </span>
                        <span>Account Settings</span>
                      </div>

                      <div
                        className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm text-gray-700 hover:bg-primary/5 hover:text-primary hover:translate-x-1"
                        onClick={() => {
                          console.log("Help clicked");
                          setOpen(false);
                        }}
                      >
                        <span className="opacity-70">
                          <HelpCircle size={18} />
                        </span>
                        <span>Help & Support</span>
                      </div>

                      {/* Divider */}
                      <div className="my-2 mx-4 h-px bg-gray-200" />

                      <div
                        className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm text-red-600 hover:bg-red-100 hover:text-red-700 hover:translate-x-1"
                        onClick={handleLogout}
                      >
                        <span className="opacity-70">
                          <LogOut size={18} />
                        </span>
                        <span>Logout</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
