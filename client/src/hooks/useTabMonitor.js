import { useEffect, useState } from "react";

export function useTabMonitor(
    enabled = true,
    socket = null,
    isInterviewer = false
) {
    const [warningCount, setWarningCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Don't monitor when disabled
        if (!enabled) return;

        // IMPORTANT:
        // Interviewer must NOT get a local tab-switch warning.
        // Only the candidate is monitored locally.
        if (isInterviewer) return;

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                return;
            }

            // Candidate's own warning count
            setWarningCount((count) => {
                const newCount = count + 1;

                return newCount;
            });

            // Show warning ONLY to candidate
            setShowWarning(true);

            // Notify server so interviewer can be informed
            if (socket) {
                socket.emit("candidate-tab-switch");
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [enabled, socket, isInterviewer]);

    const dismissWarning = () => {
        setShowWarning(false);
    };

    return {
        warningCount,
        showWarning,
        dismissWarning
    };
}