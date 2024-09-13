import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { useTheme } from "@mui/material/styles";
import { Button, CircularProgress, Typography, Box, Paper, Snackbar, Alert, Link, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useStyles from "../useStyles";
import { useStore } from "../../../store";
import html2canvas from 'html2canvas';


const DEFAULT_FILE_NAME = 'rendered-test-component.js';
const DEFAULT_LANGUAGE = 'react';
const DEFAULT_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="

const Interface = forwardRef(({ code, fileName, style }, ref) => {
    console.log('Interface component rendering');

    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [containerId, setContainerId] = useState(null);
    const [containerStatus, setContainerStatus] = useState('');
    const [status, setStatus] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [iframeSrc, setIframeSrc] = useState('');
    const iframeRef = useRef(null);
    const theme = useTheme();
    const classes = useStyles();
    const {
        state: { uiContext, user },
        actions: { setUiContext },
    } = useStore();
    const userId = user ? user.id : '0';
    const context = uiContext ? uiContext : '';
    const [progressStatus, setProgressStatus] = useState('');
    const effectiveFileName = fileName || DEFAULT_FILE_NAME;
    const [screenshotBase64, setScreenshotBase64] = useState(DEFAULT_IMAGE_BASE64);
    const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedUrl, setDeployedUrl] = useState('');
    const getLanguage = (filename) => {
        return filename.endsWith('.py') ? 'python' : DEFAULT_LANGUAGE;
    };

    const language = getLanguage(effectiveFileName);

    console.log('Initial state:', {
        isVisible, isLoading, error, containerId, containerStatus,
        status, isServerRunning, iframeSrc, userId, progressStatus,
        effectiveFileName, isCapturingScreenshot, language
    });

    useEffect(() => {
        console.log('Initial uiContext:', uiContext);
        console.log('Default image is set to uiContext:', DEFAULT_IMAGE_BASE64);
        setUiContext({
            ...uiContext,
            screenshot: DEFAULT_IMAGE_BASE64
        });
        console.log('Default uiContext updated:', uiContext);

    }, []);

    useImperativeHandle(ref, () => ({
        setVisibility: (visible) => {
            console.log('Setting visibility:', visible);
            setIsVisible(visible);
        }
    }));

    const requestScreenshot = () => {
        if (iframeRef.current && iframeSrc) {
            console.log('Requesting screenshot from iframe');
            setIsCapturingScreenshot(true);
            try {
                const iframeOrigin = new URL(iframeSrc).origin;
                iframeRef.current.contentWindow.postMessage({ type: 'takeScreenshot' }, iframeOrigin);
            } catch (error) {
                console.error('Error requesting screenshot:', error);
                setIsCapturingScreenshot(false);
            }
        } else {
            console.log('Cannot request screenshot: iframe not ready or src not set');
        }
    };

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        console.log('uiContext updated:', uiContext);
        return () => window.removeEventListener('message', handleMessage);
    }, [iframeSrc, uiContext]);

    const handleMessage = (event) => {
        if (iframeSrc) {
            try {
                const iframeOrigin = new URL(iframeSrc).origin;
                if (event.origin !== iframeOrigin) return;
            } catch (error) {
                console.error('Error parsing iframeSrc:', error);
                return;
            }
        }

        if (event.data.type === 'screenshot') {
            console.log('Received screenshot from iframe');
            const newScreenshot = event.data.screenshot;

            setIsCapturingScreenshot(false);

            // Update uiContext with the new screenshot
            setUiContext({
                ...uiContext,
                screenshot: newScreenshot
            });
        }
    };


    useEffect(() => {
        window.addEventListener('message', handleMessage);
        console.log('uiContext updated:', uiContext);
        return () => window.removeEventListener('message', handleMessage);
    }, [iframeSrc, uiContext]);


    const checkContainerReady = async (containerIdParam) => {
        console.log('Checking container readiness:', containerIdParam);
        const maxAttempts = 90;
        let attempts = 0;

        const checkStatus = async () => {
            try {
                const response = await axios.get(`http://13.61.3.236:8000/sandbox/check_container_ready/?container_id=${containerIdParam}&user_id=${userId}&file_name=${fileName}`);
                console.log('Container status response:', response.data);

                // Update the progress status with the latest log
                setProgressStatus(response.data.log || 'No logs available');

                switch(response.data.status) {
                    case 'ready':
                        console.log('Container is ready');
                        setIframeSrc(response.data.url);
                        setIsServerRunning(true);
                        setIsLoading(false);
                        setContainerStatus('running');
                        break;
                    case 'content_loading':
                    case 'container_starting':
                    case 'server_starting':
                    case 'waiting_for_port':
                        console.log('Container not ready yet:', response.data.status);
                        if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(checkStatus, 2000);
                        } else {
                            throw new Error('Timeout waiting for server to be ready');
                        }
                        break;
                    default:
                        throw new Error('Unexpected status');
                }
            } catch (error) {
                console.error('Error checking container status:', error);
                setError(`Error checking container status: ${error.message}`);
                setIsLoading(false);
                setProgressStatus('');
                setIsServerRunning(false);
            }
        };

        checkStatus();
    };

    const startDevServer = async () => {
        console.log('Starting development server');
        if (!isVisible) return;
        setIsLoading(true);
        setError('');
        setProgressStatus('Initializing...');
        try {
            const response = await axios.post('http://13.61.3.236:8000/sandbox/execute/', {
                main_code: code,
                language,
                user_id: userId,
                file_name: effectiveFileName,
                main_file_path: 'Root/Project/component.js',
            });
            console.log('Server start response:', response.data);
            if (response.data.container_id) {
                setContainerId(response.data.container_id);
                setContainerStatus('starting');
                await checkContainerReady(response.data.container_id);
            } else {
                throw new Error(response.data.error || 'Unexpected response from server');
            }
        } catch (error) {
            console.error('Error starting development server:', error);
            setError(`Error starting development server: ${error.message}`);
            setIsLoading(false);
            setProgressStatus('');
        }
    };

    const stopDevServer = async () => {
        console.log('Stopping development server');
        if (!isVisible || !isServerRunning) return;
        setIsLoading(true);
        setError('');
        setProgressStatus('Stopping development server...');
        try {
            const response = await axios.post('http://13.61.3.236:8000/sandbox/stop_container/', {
                container_id: containerId,
                user_id: userId,
                file_name: effectiveFileName
            });
            console.log('Server stop response:', response.data);
            if (response.data.status === 'Container stopped and removed' ||
                response.data.status === 'Container not found, possibly already removed') {
                setContainerId(null);
                setIframeSrc('');
                setIsServerRunning(false);
                setContainerStatus('stopped');
                setStatus('Development server stopped');
            } else {
                throw new Error(response.data.error || 'Unexpected response from server');
            }
        } catch (error) {
            console.error('Error stopping development server:', error);
            setError(`Error stopping development server: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCodeInContainer = async () => {
        console.log('Updating code in container');
        if (!isServerRunning || !containerId) return;
        try {
            await axios.post('http://13.61.3.236:8000/sandbox/update_code/', {
                container_id: containerId,
                user_id: userId,
                file_name: effectiveFileName,
                main_code: code,
                main_file_path: 'Root/Project/component.js',  // Assuming openedFile has a path property
                language
            });
            if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src;
            }
        } catch (error) {
            console.error('Error updating code in container:', error);
            setError(`Error updating code: ${error.message}`);
        }
    };



    useEffect(() => {
        if (isServerRunning && code && containerId) {
            console.log('Code changed, scheduling update');
            const debounceTimer = setTimeout(() => {
                console.log('Debounce timer expired, updating code');
                updateCodeInContainer();
            }, 1000); // Debounce for 1 second

            return () => {
                console.log('Clearing debounce timer');
                clearTimeout(debounceTimer);
            };
        }
    }, [code, isServerRunning, containerId]);

    if (!isVisible) {
        console.log('Interface not visible, returning null');
        return null;
    }

    console.log('Rendering Interface component');

    const deployToProduction = async () => {
        if (!isServerRunning || !containerId) return;
        setIsDeploying(true);
        setError('');
        try {
            const response = await axios.post('http://13.61.3.236:8000/sandbox/deploy_to_server/', {
                withCredentials: true,
                container_id: containerId,
                user_id: userId,
                file_name: effectiveFileName
            });
            if (response.data.status === 'success') {
                setDeployedUrl(response.data.production_url);
                setStatus('Application deployed successfully');
                setSnackbarOpen(true);
            } else {
                throw new Error(response.data.error || 'Deployment failed');
            }
        } catch (error) {
            console.error('Error deploying to production:', error);
            setError(`Error deploying to production: ${error.message}`);
            setSnackbarOpen(true);
        } finally {
            setIsDeploying(false);
        }
    };


    return (
        <Box sx={{ background: theme.palette.background.paper, display: 'block' }}>
            <Box className={classes.editorContent} sx={{ height: "71.2vh", overflow: 'hidden', padding: '16px' }}>
                {isLoading ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontColor: '#F4F4F4',
                    }}>
                        <CircularProgress
                            size={60}
                            thickness={3}
                            sx={{
                                color: '#F4F4F4',
                            }}
                        />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {progressStatus || status}
                        </Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                ) : isServerRunning ? (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ mr: 2, marginLeft: '5px' }}>
                                Dev Server URL: <Link href={iframeSrc} target="_blank" rel="noopener noreferrer">{iframeSrc}</Link>
                            </Typography>
                            <Chip
                                label={containerStatus}
                                color={containerStatus === 'running' ? 'success' : 'error'}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            <iframe
                                ref={iframeRef}
                                src={iframeSrc}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: 'block'
                                }}
                                title="Rendered React Component"
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>

                            {deployedUrl && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Deployed URL: <Link href={deployedUrl} target="_blank" rel="noopener noreferrer">{deployedUrl}</Link>
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Typography>Click the button to start the development server</Typography>
                )}
            </Box>
            <Box className={classes.buttonContainer} sx={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center', marginRight: '15px' }}>
                <Typography variant="body2">{fileName}</Typography>
                <Button
                    onClick={deployToProduction}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={isDeploying || !isServerRunning}
                    sx={{
                        backgroundColor: '#FFD700',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#FFC700',
                        },
                    }}
                >
                    {isDeploying ? 'Deploying...' : 'Deploy'}
                </Button>
                <Button
                    onClick={requestScreenshot}
                    variant="contained"
                    disabled={isCapturingScreenshot || !isServerRunning}
                    sx={{
                        backgroundColor: '#90CAF9',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: isServerRunning ? '#64B5F6' : '#90CAF9',
                        },
                    }}
                >
                    {isCapturingScreenshot ? <CircularProgress size={24} /> : 'FIX UI'}
                </Button>

                <Button
                    className={classes.execute_button}
                    variant="contained"
                    onClick={isServerRunning ? stopDevServer : startDevServer}
                    startIcon={isServerRunning ? <StopIcon /> : <PlayArrowIcon />}
                    disabled={isLoading}
                    sx={{
                        backgroundColor: isServerRunning ? '#90CAF9' : '#81C784',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: isServerRunning ? '#64B5F6' : '#66BB6A',
                        },
                    }}
                >
                    {isServerRunning ? 'Stop Server' : 'Start Server'}
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={status}
            />
        </Box>
    );
});

export default Interface;