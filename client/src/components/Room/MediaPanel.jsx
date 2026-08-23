import { useEffect, useRef } from "react";

function RemoteVideo({ stream }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !stream) {
            return;
        }

        videoRef.current.srcObject = stream;

        videoRef.current
            .play()
            .catch((error) => {
                console.error(
                    "Remote video/audio playback error:",
                    error
                );
            });

    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            controls={false}
            className="w-full h-full object-cover"
        />
    );
}

function MediaPanel({
    localVideoRef,
    localStream,
    remoteStreams,
    cameraOn,
    micOn,
    toggleCamera,
    toggleMic
}) {
    return (
        <div className="p-4 border-b border-slate-800">

            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                    Interview Video
                </h3>

                <div className="flex gap-2 text-[10px]">
                    <span
                        className={
                            cameraOn
                                ? "text-green-400"
                                : "text-red-400"
                        }
                    >
                        {cameraOn ? "● Camera" : "● Camera off"}
                    </span>

                    <span
                        className={
                            micOn
                                ? "text-green-400"
                                : "text-red-400"
                        }
                    >
                        {micOn ? "● Mic" : "● Mic off"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">

                {/* LOCAL VIDEO */}
                <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800">

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[9px] text-white">
                        You
                    </span>

                </div>

                {/* REMOTE VIDEO */}
                {Object.entries(remoteStreams).map(
                    ([socketId, stream]) => (
                        <div
                            key={socketId}
                            className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800"
                        >
                            <RemoteVideo stream={stream} />

                            <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[9px] text-white">
                                Participant
                            </span>
                        </div>
                    )
                )}

            </div>

            {!localStream && (
                <p className="text-center text-[10px] text-slate-500 mt-3">
                    Camera and microphone are not started.
                </p>
            )}

            <div className="flex gap-2 mt-3">

                <button
                    onClick={toggleCamera}
                    disabled={!localStream}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg py-2 text-xs"
                >
                    {cameraOn
                        ? "📹 Camera"
                        : "🚫 Camera"}
                </button>

                <button
                    onClick={toggleMic}
                    disabled={!localStream}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg py-2 text-xs"
                >
                    {micOn
                        ? "🎤 Mic"
                        : "🔇 Mic"}
                </button>

            </div>

        </div>
    );
}

export default MediaPanel;