
import React from 'react';
import { MuiThemeProvider }  from 'theme';
import ErrorBoundary from 'react-error-boundary';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import Layout from 'layout';



export const App = () => (
    <MuiThemeProvider>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>


      <Layout />

        </ErrorBoundary>
    </MuiThemeProvider>

);


export default App;
