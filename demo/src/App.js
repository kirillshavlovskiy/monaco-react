import React from 'react';
import { getTheme, CustomThemeProvider }  from 'theme';
import ErrorBoundary from 'react-error-boundary';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import Layout from 'layout';



export const App = () => (
    <CustomThemeProvider>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>


      <Layout />

        </ErrorBoundary>
    </CustomThemeProvider>

);


export default App;
