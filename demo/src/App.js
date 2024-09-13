
import React from 'react';
import { MuiThemeProvider }  from 'theme';
import ErrorBoundary from 'react-error-boundary';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import Notifications from 'notifications';
import Layout from 'layout';

export const App = () => (
    <MuiThemeProvider>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>


      <Layout />
            <Notifications />

        </ErrorBoundary>
    </MuiThemeProvider>

);


export default App;
