import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { Camera, CameraOff, Mic, MicOff, Repeat2 } from "lucide-react";

function Room() {
  const socket = useSocket();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<
    { email: string; id: string }[]
  >([]);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [selectedFacingMode, setSelectedFacingMode] = useState<
    "user" | "environment"
  >("user");

  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const navigate = useNavigate();

  const toggleMic = () => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  };
  const toggleCamera = () => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setCameraOn((prev) => !prev);
  };

  // Get local media stream
  const setupLocalStream = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMyStream(stream);
      return stream;
    } catch (err) {
      console.error("Failed to get media:", err);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    if (!myStream) return;

    try {
      const newFacingMode =
        selectedFacingMode === "user" ? "environment" : "user";

      // Get new video track with selected camera
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });
      const newVideoTrack = newStream.getVideoTracks()[0];

      // Create a new stream with existing audio and new video
      const combinedStream = new MediaStream([
        ...myStream.getAudioTracks(),
        newVideoTrack,
      ]);

      // Replace tracks in peer connections
      peersRef.current.forEach((peer) => {
        const videoSender = peer
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (videoSender) {
          videoSender
            .replaceTrack(newVideoTrack)
            .catch((err) => console.error("Failed to replace track:", err));
        }
      });

      // Stop old video track (but keep audio)
      myStream.getVideoTracks().forEach((track) => track.stop());

      // Stop the temporary stream's audio if it exists
      newStream.getAudioTracks().forEach((track) => track.stop());

      // Force React to recognize the stream change
      setMyStream(null); // First set to null
      setTimeout(() => {
        setMyStream(combinedStream); // Then set new stream
        setSelectedFacingMode(newFacingMode);
      }, 50);
    } catch (err) {
      console.error("Error switching camera:", err);
    }
  }, [myStream, selectedFacingMode]);
  // Helper functions
  const getCameraTrack = async (facingMode: "user" | "environment") => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });
    return { videoTrack: stream.getVideoTracks()[0], stream };
  };

  const updatePeerConnections = (videoTrack: MediaStreamTrack) => {
    console.log(videoTrack);
    peersRef.current.forEach((peer) => {
      const sender = peer.getSenders().find((s) => s.track?.kind === "video");
      if (sender) sender.replaceTrack(videoTrack);
    });
  };

  // FIXED: Proper stream cleanup function
  const stopLocalStream = useCallback(() => {
    if (myStream) {
      // Stop all tracks properly
      myStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      remoteStreams.forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log(`Stopped remote ${track.kind} track`);
        });
      });
      setMyStream(null);
      setRemoteStreams(null);
      navigate("/lobby");
      console.log("Local stream stopped completely");
    }
  }, [myStream]);

  // Handle user joining room
  const handleUserJoined = useCallback(({ email, id }: any) => {
    setRemoteSocketId((prev) => {
      // Check if user already exists
      if (prev.some((user) => user.id === id)) {
        return prev;
      }
      return [...prev, { email, id }];
    });
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
      setRemoteSocketId(users.map((user) => ({ email: user, id: user })));
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, []);

  console.log(selectedFacingMode);
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
      <div className="flex gap-2 mb-6 flex-wrap">
        {!myStream && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={setupLocalStream}
          >
            Start Camera
          </button>
        )}

        {myStream && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={stopLocalStream}
          >
            Exit Call
          </button>
        )}

        {remoteSocketId.length > 0 && myStream && (
          <>
            {remoteSocketId.map((data) => (
              <button
                key={data.id}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={() => handleCallUser(data.id)}
              >
                Call User {data.email}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Video streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local stream */}
        {myStream && (
          <div className="border rounded-lg p-4 bg-gray-800">
            <h2 className="text-lg font-semibold mb-2">My Stream</h2>

            {/* Video player container */}
            <div className="relative w-full aspect-video mb-4">
              <ReactPlayer
                key={myStream.id} // Force re-render on camera switch
                playing
                muted
                controls
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
                url={myStream}
                config={{
                  file: {
                    attributes: {
                      playsInline: true,
                      webkitPlaysinline: true,
                    },
                  },
                }}
              />
            </div>

            {/* Mic & Camera Controls */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={toggleMic}
                className="px-4 py-2 bg-emerald-900 text-black rounded hover:bg-emarld-800 transition"
              >
                {isMuted ? <MicOff color="white" /> : <Mic color="white" />}
              </button>
              <button
                onClick={toggleCamera}
                className="px-4 py-2 bg-emerald-900 text-white rounded hover:bg-emarald-800 transition"
              >
                {cameraOn ? <Camera /> : <CameraOff />}
              </button>
              <button
                onClick={() => {
                  setSelectedFacingMode((prev) =>
                    prev === "user" ? "environment" : "user",
                  );
                  switchCamera();
                }}
                className="px-4 py-2 bg-emerald-900 text-white rounded hover:bg-emerald-800"
              >
                <Repeat2 />
              </button>
            </div>
          </div>
        )}

        {/* Remote streams */}
        {remoteStreams.size > 0 &&
          Array.from(remoteStreams.entries()).map(([userId, stream]) => (
            <div key={userId} className="border rounded-lg p-4 bg-gray-800">
              <h2 className="text-lg font-semibold mb-2">
                Remote Stream ({userId.slice(0, 5)}...)
              </h2>

              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <ReactPlayer
                  playing
                  controls
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                  url={stream}
                  config={{
                    file: {
                      attributes: {
                        playsInline: true, // Important for mobile
                        webkit_playsinline: true, // iOS Safari
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* No streams message */}
      {!myStream && remoteStreams.size === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Click "Start Camera" to begin video chat</p>
        </div>
      )}
    </div>
  );
}

export default Room;
