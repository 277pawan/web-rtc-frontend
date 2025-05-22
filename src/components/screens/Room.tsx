import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import ReactPlayer from "react-player";

function Room() {
  const socket = useSocket();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Get local media stream
  const setupLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  // Handle user joining room
  const handleUserJoined = useCallback(({ email, id }: any) => {
    console.log("User joined the room:", email, id);
    setRemoteSocketId((prev) => [...prev, id]);
  }, []);

  // Create or get peer connection
  const getPeerConnection = useCallback(
    (userId: string) => {
      if (peersRef.current.has(userId)) {
        return peersRef.current.get(userId)!;
      }

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("sendICECandidate", {
            to: userId,
            candidate: event.candidate,
          });
        }
      };

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log("Received track from:", userId);
        setRemoteStreams((prev) => {
          const newMap = new Map(prev);
          newMap.set(userId, event.streams[0]);
          return newMap;
        });
      };

      peersRef.current.set(userId, peerConnection);
      return peerConnection;
    },
    [socket],
  );

  // Initiate call to another user
  const handleCallUser = useCallback(
    async (targetUserId: string) => {
      try {
        // Ensure we have local stream
        let stream = myStream;
        if (!stream) {
          stream = await setupLocalStream();
        }

        const peerConnection = getPeerConnection(targetUserId);

        // Add local tracks to connection
        if (stream) {
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream!);
          });
        }

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket?.emit("user:call", { to: targetUserId, offer });
      } catch (error) {
        console.error("Error calling user:", error);
      }
    },
    [myStream, setupLocalStream, getPeerConnection, socket],
  );

  // Handle incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      try {
        console.log("Incoming call from:", from);

        // Ensure we have local stream
        let stream = myStream;
        if (!stream) {
          stream = await setupLocalStream();
        }

        const peerConnection = getPeerConnection(from);

        // Set remote description (offer)
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        // Add local tracks
        if (stream) {
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream!);
          });
        }

        // Create and send answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket?.emit("call:accepted", { to: from, ans: answer });
      } catch (error) {
        console.error("Error handling incoming call:", error);
      }
    },
    [myStream, setupLocalStream, getPeerConnection, socket],
  );

  // Handle call acceptance
  const handleCallAccepted = useCallback(
    ({ from, ans }: any) => {
      try {
        console.log("Call accepted by:", from);
        const peerConnection = getPeerConnection(from);
        peerConnection.setRemoteDescription(new RTCSessionDescription(ans));
      } catch (error) {
        console.error("Error handling call acceptance:", error);
      }
    },
    [getPeerConnection],
  );

  // Handle ICE candidates
  const handleIceCandidate = useCallback(
    ({ from, candidate }: any) => {
      try {
        console.log("Received ICE candidate from:", from);
        const peerConnection = getPeerConnection(from);
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    },
    [getPeerConnection],
  );

  // Handle negotiation needed
  const handleNegotiationNeeded = useCallback(
    async (userId: string) => {
      try {
        console.log("Negotiation needed with:", userId);
        const peerConnection = getPeerConnection(userId);

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket?.emit("peer:nego:needed", { to: userId, offer });
      } catch (error) {
        console.error("Error during negotiation:", error);
      }
    },
    [getPeerConnection, socket],
  );

  // Handle incoming negotiation request
  const handleNegotiationRequest = useCallback(
    async ({ from, offer }: any) => {
      try {
        console.log("Negotiation request from:", from);
        const peerConnection = getPeerConnection(from);

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket?.emit("peer:nego:done", { to: from, ans: answer });
      } catch (error) {
        console.error("Error handling negotiation request:", error);
      }
    },
    [getPeerConnection, socket],
  );

  // Handle negotiation completion
  const handleNegotiationComplete = useCallback(
    ({ from, ans }: any) => {
      try {
        console.log("Negotiation complete with:", from);
        const peerConnection = getPeerConnection(from);
        peerConnection.setRemoteDescription(new RTCSessionDescription(ans));
      } catch (error) {
        console.error("Error finalizing negotiation:", error);
      }
    },
    [getPeerConnection],
  );

  // Initialize socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationRequest);
    socket.on("peer:nego:final", handleNegotiationComplete);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("roomUsers", (users: string[]) => {
      console.log("Current users in room:", users);
      setRemoteSocketId(users);
    });

    // Clean up event listeners
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationRequest);
      socket.off("peer:nego:final", handleNegotiationComplete);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("roomUsers");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationRequest,
    handleNegotiationComplete,
    handleIceCandidate,
  ]);

  // Set up event handlers for all peer connections
  useEffect(() => {
    const setupPeerConnectionListeners = (
      userId: string,
      pc: RTCPeerConnection,
    ) => {
      pc.onnegotiationneeded = () => handleNegotiationNeeded(userId);
    };

    peersRef.current.forEach(setupPeerConnectionListeners);
  }, [handleNegotiationNeeded]);

  // Join room on component mount
  useEffect(() => {
    if (socket) {
      // Replace with your actual room joining logic
      // socket.emit("roomjoin", { email: "user@example.com", room: "room1" });
    }
  }, [socket]);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Video Chat Room</h1>

      {/* Connection status */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Status</h2>
        <p>
          {remoteSocketId.length > 0
            ? `Connected with ${remoteSocketId.length} user(s)`
            : "No one in room"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        {!myStream && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={setupLocalStream}
          >
            Start Camera
          </button>
        )}

        {remoteSocketId.length > 0 && myStream && (
          <>
            {remoteSocketId.map((id) => (
              <button
                key={id}
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => handleCallUser(id)}
              >
                Call User ({id.slice(0, 5)}...)
              </button>
            ))}
          </>
        )}
      </div>

      {/* Video streams */}
      <div className="h-auto overflow-auto flex flex-wrap gap-2">
        {/* Local stream */}
        {myStream && (
          <div className="border w-1/3 h-full rounded p-4">
            <h2 className="text-lg font-semibold mb-2">My Stream</h2>
            <ReactPlayer
              playing
              muted
              controls
              height="300px"
              width="100%"
              url={myStream}
            />
          </div>
        )}

        {/* Remote streams */}
        {remoteStreams.size > 0 &&
          Array.from(remoteStreams.entries()).map(([userId, stream]) => (
            <div key={userId} className="border w-1/3 h-full rounded p-4">
              <h2 className="text-lg font-semibold mb-2">
                Remote Stream ({userId.slice(0, 5)}...)
              </h2>
              <ReactPlayer
                playing
                controls
                height="300px"
                width="100%"
                url={stream}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Room;
