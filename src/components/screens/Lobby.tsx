import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { BiSolidRightArrowAlt } from "react-icons/bi";
import { AuthInput } from "../ui/auth-input";
import { motion, useAnimation } from "framer-motion";
function Lobby() {
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<number | string>("");
  const socket = useSocket();
  const navigate = useNavigate();
  const controls = useAnimation();

  // Add the second argument (empty array) to useCallback
  const handleSubmitForm = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      socket?.emit("roomjoin", { email, room });
      console.log(email, room);
    },
    [email, room, socket],
  );

  const handleJoinRoom = useCallback(
    (data: { email: string; room: string }) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [],
  );

  useEffect(() => {
    socket?.on("room:join", handleJoinRoom);
    return () => {
      socket?.off("room:join", handleJoinRoom);
    };
  }, [socket]);

  return (
    <section className="h-auto">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-background md:text-3xl dark:text-white">
            Seamless Video Calling: Connect Anytime, Anywhere
          </h2>

          <p className="hidden text-gray-500 sm:mt-4 sm:block dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae dolor
            officia blanditiis repellat in, vero, aperiam porro ipsum laboriosam
            consequuntur exercitationem incidunt tempora nisi?
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <form
            onSubmit={(e) => handleSubmitForm(e)}
            className="sm:flex sm:gap-4"
          >
            <div className="mt-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <AuthInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="i.e. davon@mail.com"
                required
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="sr-only">
                Room-no.
              </label>
              <AuthInput
                id="room-no"
                type="number"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="1,2,3,4 ..."
                required
              />
            </div>
            <button
              type="submit"
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 text-white transition focus:ring-3 focus:ring-yellow-400 focus:outline-hidden sm:mt-0 sm:w-auto"
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
              <span className="text-sm font-medium"> Sign Up </span>

              <motion.div animate={controls}>
                <BiSolidRightArrowAlt size={20} />
              </motion.div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Lobby;
