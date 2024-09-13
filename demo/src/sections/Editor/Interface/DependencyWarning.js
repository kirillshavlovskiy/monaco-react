import React from 'react';

const DependencyWarning = ({ unsupportedDependencies }) => {
    if (unsupportedDependencies.length === 0) return null;

    return (
        <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '4px',
            color: '#856404',
            padding: '12px',
            marginBottom: '16px'
        }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Unsupported Libraries or Icons Detected</h2>
            <p>The generated code includes unsupported libraries:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                {unsupportedDependencies.map((dep, index) => (
                    <li key={index}>{dep}</li>
                ))}
            </ul>
            <p style={{ marginTop: '8px' }}>
                The code itself may still be valid and functional. However, due to the missing components,
                we are unable to render or execute it in this environment.
            </p>
        </div>
    );
};

export default DependencyWarning;