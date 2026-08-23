function EditorToolbar({
    language,
    setLanguage
}) {
    return (
        <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">

            <div className="flex items-center gap-3">

                <span className="text-sm font-medium text-white">
                    Code Editor
                </span>

                <span className="text-xs text-green-400">
                    ● Live
                </span>

            </div>

            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-sm rounded-md px-3 py-1.5 outline-none"
            >
                <option value="javascript">
                    JavaScript
                </option>

                <option value="python">
                    Python
                </option>
            </select>

        </div>
    );
}

export default EditorToolbar;