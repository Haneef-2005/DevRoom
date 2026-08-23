import Editor from "@monaco-editor/react";

function MonacoEditor({
    code,
    setCode,
    language = "javascript"
}) {
    const handleEditorChange = (value) => {
        setCode(value || "");
    };

    return (
        <div className="h-full w-full overflow-hidden rounded-lg">
            <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: {
                        enabled: false
                    },

                    fontSize: 14,

                    automaticLayout: true,

                    padding: {
                        top: 12
                    },

                    scrollBeyondLastLine: false,

                    // Avoid unnecessary editor diagnostics
                    // for interview-style code.
                    renderValidationDecorations: "off"
                }}
            />
        </div>
    );
}

export default MonacoEditor;