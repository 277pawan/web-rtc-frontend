import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { BiSolidRightArrowAlt } from "react-icons/bi";
function Lobby() {
  const [email, setEmail] = useState<string>("");
  const [room, setRoom] = useState<number | string>("");
  const socket = useSocket();
  const navigate = useNavigate();

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
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
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

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="enter your email...."
                className="w-full rounded-md border-gray-200 bg-white p-3 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="sr-only">
                Room-no.
              </label>
              <input
                type="number"
                value={room}
                placeholder="Room no..."
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-md border-gray-200 bg-white p-3 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                id="room-no"
              />
            </div>

            <button
              type="submit"
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-2 text-white transition focus:ring-3 focus:ring-yellow-400 focus:outline-hidden sm:mt-0 sm:w-auto"
            >
              <span className="text-sm font-medium"> Sign Up </span>

              <BiSolidRightArrowAlt size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Lobby;
