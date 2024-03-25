import React from 'react';
import { getTheme, ThemeProvider }  from 'theme';
import ErrorBoundary from 'react-error-boundary';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import CustomizedView from 'layout';



export const App = () => (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <ThemeProvider theme={getTheme}>

      <CustomizedView />
    </ThemeProvider>
        </ErrorBoundary>

);


export default App;
