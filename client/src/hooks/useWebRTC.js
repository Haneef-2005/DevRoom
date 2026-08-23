import { useEffect, useRef, useState } from "react";

export function useWebRTC(socket, participants) {
    const localVideoRef = useRef(null);

    const peerConnections = useRef({});
    const localStreamRef = useRef(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    const configuration = {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    };

    // ==========================================
    // START CAMERA + MICROPHONE
    // ==========================================

    const startLocalStream = async () => {
        try {
            if (localStreamRef.current) {
                return localStreamRef.current;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

            // Start with camera OFF
            stream.getVideoTracks().forEach((track) => {
                track.enabled = false;
            });

            // Start with microphone OFF
            stream.getAudioTracks().forEach((track) => {
                track.enabled = false;
            });

            localStreamRef.current = stream;

            setLocalStream(stream);

            // Attach local stream immediately if video exists
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            return stream;

        } catch (error) {
            console.error(
                "Camera/microphone error:",
                error
            );

            throw error;
        }
    };

    // ==========================================
    // LOCAL VIDEO PREVIEW
    // ==========================================

    useEffect(() => {
        if (
            localVideoRef.current &&
            localStream
        ) {
            localVideoRef.current.srcObject =
                localStream;

            localVideoRef.current
                .play()
                .catch((error) => {
                    console.error(
                        "Local video playback error:",
                        error
                    );
                });
        }
    }, [localStream]);

    // ==========================================
    // CREATE PEER CONNECTION
    // ==========================================

    const createPeerConnection = (userId) => {

        if (peerConnections.current[userId]) {
            return peerConnections.current[userId];
        }

        const peer =
            new RTCPeerConnection(configuration);

        peerConnections.current[userId] = peer;

        // Add local tracks
        if (localStreamRef.current) {
            localStreamRef.current
                .getTracks()
                .forEach((track) => {
                    peer.addTrack(
                        track,
                        localStreamRef.current
                    );
                });
        }

        // ICE candidates
        peer.onicecandidate = (event) => {

            if (!event.candidate) {
                return;
            }

            socket.emit(
                "webrtc-ice-candidate",
                {
                    target: userId,
                    candidate: event.candidate
                }
            );
        };

        // Remote stream
        peer.ontrack = (event) => {

            const stream =
                event.streams[0];

            if (!stream) {
                return;
            }

            setRemoteStreams((current) => ({
                ...current,
                [userId]: stream
            }));
        };

        // Connection state
        peer.onconnectionstatechange = () => {

            console.log(
                "WebRTC connection:",
                userId,
                peer.connectionState
            );

            if (
                peer.connectionState === "failed" ||
                peer.connectionState === "closed" ||
                peer.connectionState === "disconnected"
            ) {

                setRemoteStreams((current) => {

                    const updated = {
                        ...current
                    };

                    delete updated[userId];

                    return updated;
                });
            }
        };

        return peer;
    };

    // ==========================================
    // CALL PARTICIPANT
    // ==========================================

    const callUser = async (userId) => {

        try {

            const peer =
                createPeerConnection(userId);

            const offer =
                await peer.createOffer();

            await peer.setLocalDescription(
                offer
            );

            socket.emit(
                "webrtc-offer",
                {
                    target: userId,
                    offer
                }
            );

        } catch (error) {

            console.error(
                "WebRTC call error:",
                error
            );
        }
    };

    // ==========================================
    // RECEIVE OFFER
    // ==========================================

    useEffect(() => {

        if (!socket) {
            return;
        }

        const handleOffer = async ({
            sender,
            offer
        }) => {

            try {

                const peer =
                    createPeerConnection(sender);

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        offer
                    )
                );

                const answer =
                    await peer.createAnswer();

                await peer.setLocalDescription(
                    answer
                );

                socket.emit(
                    "webrtc-answer",
                    {
                        target: sender,
                        answer
                    }
                );

            } catch (error) {

                console.error(
                    "WebRTC offer error:",
                    error
                );
            }
        };

        // ======================================
        // RECEIVE ANSWER
        // ======================================

        const handleAnswer = async ({
            sender,
            answer
        }) => {

            try {

                const peer =
                    peerConnections.current[
                        sender
                    ];

                if (!peer) {
                    return;
                }

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        answer
                    )
                );

            } catch (error) {

                console.error(
                    "WebRTC answer error:",
                    error
                );
            }
        };

        // ======================================
        // RECEIVE ICE CANDIDATE
        // ======================================

        const handleIceCandidate = async ({
            sender,
            candidate
        }) => {

            try {

                const peer =
                    peerConnections.current[
                        sender
                    ];

                if (!peer || !candidate) {
                    return;
                }

                await peer.addIceCandidate(
                    new RTCIceCandidate(
                        candidate
                    )
                );

            } catch (error) {

                console.error(
                    "ICE candidate error:",
                    error
                );
            }
        };

        socket.on(
            "webrtc-offer",
            handleOffer
        );

        socket.on(
            "webrtc-answer",
            handleAnswer
        );

        socket.on(
            "webrtc-ice-candidate",
            handleIceCandidate
        );

        return () => {

            socket.off(
                "webrtc-offer",
                handleOffer
            );

            socket.off(
                "webrtc-answer",
                handleAnswer
            );

            socket.off(
                "webrtc-ice-candidate",
                handleIceCandidate
            );
        };

    }, [socket]);

    // ==========================================
    // CALL NEW PARTICIPANTS
    // ==========================================

    useEffect(() => {

        if (!socket) {
            return;
        }

        if (!localStreamRef.current) {
            return;
        }

        if (
            !participants ||
            participants.length === 0
        ) {
            return;
        }

        const mySocketId = socket.id;

        participants.forEach((participant) => {

            const userId =
                participant.socketId;

            if (!userId) {
                return;
            }

            if (userId === mySocketId) {
                return;
            }

            if (
                peerConnections.current[userId]
            ) {
                return;
            }

            /*
             * Only the participant with the
             * smaller socket ID starts the call.
             *
             * This prevents both participants
             * from creating offers simultaneously.
             */

            if (
                mySocketId &&
                mySocketId < userId
            ) {
                callUser(userId);
            }

        });

    }, [
        socket,
        participants,
        localStream
    ]);

    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        return () => {

            Object.values(
                peerConnections.current
            ).forEach((peer) => {
                peer.close();
            });

            peerConnections.current = {};

            if (localStreamRef.current) {

                localStreamRef.current
                    .getTracks()
                    .forEach((track) => {
                        track.stop();
                    });

                localStreamRef.current = null;
            }

        };

    }, []);

    // ==========================================
    // RETURN
    // ==========================================

    return {
        localVideoRef,
        localStream,
        remoteStreams,
        startLocalStream,
        callUser
    };
}