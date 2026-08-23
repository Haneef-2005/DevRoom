import { useEffect, useState } from "react";

export function useFullscreenMonitor(
    enabled = true,
    socket = null,
    isInterviewer = false
) {
    const [isFullscreen, setIsFullscreen] = useState(
        !!document.fullscreenElement
    );

    const [exitCount, setExitCount] = useState(0);
    const [showFullscreenWarning, setShowFullscreenWarning] =
        useState(false);

    useEffect(() => {
        if (!enabled) return;

        const handleFullscreenChange = () => {
            const fullscreen = !!document.fullscreenElement;

            setIsFullscreen(fullscreen);

            // Only candidate exits are monitored
            if (!fullscreen && !isInterviewer) {
    setExitCount((count) => {
        const newCount = count + 1;

        if (socket) {
            socket.emit("candidate-fullscreen-exit");
        }

        return newCount;
    });

    setShowFullscreenWarning(true);
}
        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, [enabled, socket, isInterviewer]);

    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
        } catch (error) {
            console.error(
                "Unable to enter fullscreen:",
                error
            );
        }
    };

    const dismissFullscreenWarning = () => {
        setShowFullscreenWarning(false);
    };

    return {
        isFullscreen,
        exitCount,
        showFullscreenWarning,
        enterFullscreen,
        dismissFullscreenWarning
    };
}