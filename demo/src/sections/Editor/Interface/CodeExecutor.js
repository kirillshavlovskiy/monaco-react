import React, { useState } from 'react';

const CodeExecutor = ({ code, language, setOutput }) => {
    const [isLoading, setIsLoading] = useState(false);

    const runCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/sandbox/execute/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOutput(data.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <button
                onClick={runCode}
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                {isLoading ? 'Running...' : 'Run Code'}
            </button>
        </div>
    );
};

export default CodeExecutor;