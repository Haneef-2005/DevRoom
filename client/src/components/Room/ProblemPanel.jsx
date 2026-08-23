function ProblemPanel({ problem }) {
    if (!problem) {
        return (
            <div className="text-slate-400">
                No problem selected.
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">

            <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-semibold">
                    Problem
                </h2>

                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
                    {problem.difficulty}
                </span>

            </div>

            <h3 className="text-xl font-semibold mb-3">
                {problem.title}
            </h3>

            <p className="text-sm text-slate-400 leading-6">
                {problem.description}
            </p>

            <div className="mt-6">

                <h3 className="text-sm font-semibold mb-2">
                    Example
                </h3>

                {problem.examples.map((example, index) => (
                    <div
                        key={index}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 mb-3"
                    >
                        <p className="mb-2">
                            <span className="text-slate-500">
                                Input:
                            </span>{" "}
                            {example.input}
                        </p>

                        <p>
                            <span className="text-slate-500">
                                Output:
                            </span>{" "}
                            {example.output}
                        </p>
                    </div>
                ))}

            </div>

            <div className="mt-6">

                <h3 className="text-sm font-semibold mb-2">
                    Constraints
                </h3>

                <ul className="space-y-2">
                    {problem.constraints.map(
                        (constraint, index) => (
                            <li
                                key={index}
                                className="text-xs text-slate-400"
                            >
                                • {constraint}
                            </li>
                        )
                    )}
                </ul>

            </div>

        </div>
    );
}

export default ProblemPanel;