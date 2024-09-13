import React from 'react';
import * as MUI from '@mui/material';
import * as MUIIcons from '@mui/icons-material';
import * as Babel from '@babel/standalone';

const DynamicReactComponent = ({ code }) => {
    const [component, setComponent] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const transpileAndEvaluate = () => {
            try {
                // Pre-process the code to handle imports and exports
                let processedCode = code
                    .replace(/import\s+{([^}]+)}\s+from\s+['"]@mui\/material['"]/g,
                        (_, imports) => `const { ${imports} } = MUI;`)
                    .replace(/import\s+(\w+)\s+from\s+['"]@mui\/icons-material\/(\w+)['"]/g,
                        (_, varName, iconName) => `const ${varName} = MUIIcons.${iconName};`)
                    .replace(/import\s+.*?;$/gm, '')
                    .replace(/export\s+default\s+/, '');

                // Wrap the entire code in a function
                processedCode = `
                    return function() {
                        ${processedCode}
                        return (${getComponentName(code)});
                    }
                `;

                // Transform the code
                const transformedCode = Babel.transform(processedCode, {
                    presets: ['react'],
                    filename: 'dynamic.js'
                }).code;

                // Create a function that returns the component
                const ComponentFunction = new Function(
                    'React',
                    ...Object.keys(React),
                    'MUI',
                    'MUIIcons',
                    transformedCode
                );

                // Execute the function with the necessary dependencies
                const Component = ComponentFunction(
                    React,
                    ...Object.values(React),
                    MUI,
                    MUIIcons
                )();

                if (!Component) {
                    throw new Error('No valid React component found in the provided code.');
                }

                setComponent(() => Component);
                setError(null);
            } catch (err) {
                console.error('Error evaluating code:', err);
                setError(err.toString());
            }
        };

        transpileAndEvaluate();
    }, [code]);

    // Helper function to extract the component name
    const getComponentName = (code) => {
        const match = code.match(/export\s+default\s+(\w+)/);
        return match ? match[1] : 'Component';
    };

    if (error) {
        return <div style={{ color: 'red', whiteSpace: 'pre-wrap' }}>Error creating component: {error}</div>;
    }

    return (
        <div style={{ padding: '16px' }}>
            {component ? React.createElement(component) : <div>No component to render</div>}
        </div>
    );
};

export default DynamicReactComponent;