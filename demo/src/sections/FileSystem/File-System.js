import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useStore } from 'store';
import {
    List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Menu, MenuItem, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, CircularProgress
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import JavascriptIcon from '@mui/icons-material/Javascript';
import CodeIcon from '@mui/icons-material/Code';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DataObjectIcon from '@mui/icons-material/DataObject';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const HOST_URL = 'brainpower-ai.net'

const FileSystemItem = ({ node, level = 0, onUpdate, onDelete, onAdd, onOpen, onRun }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [newName, setNewName] = useState('');

    const handleToggle = () => {
        if (node.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            handleOpen();
        }
    };

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleDialogOpen = (action) => {
        setDialogAction(action);
        setNewName(action === 'rename' ? node.name : '');
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewName('');
    };

    const handleDialogConfirm = () => {
        if (dialogAction === 'rename') {
            onUpdate(node.id, { ...node, name: newName });
        } else if (dialogAction === 'addFile' || dialogAction === 'addFolder') {
            onAdd(node.id, {
                name: newName,
                type: dialogAction === 'addFile' ? 'file' : 'folder',
            });
        }
        handleDialogClose();
    };

    const handleDelete = () => {
        onDelete(node.id);
        handleMenuClose();
    };

    const handleOpen = () => {
        if (node.type === 'file') {
            onOpen(node);
        }
    };


    const handleRun = (event) => {
        event.stopPropagation();
        if (node.type === 'file') {
            onRun(node.id);
        }
    };

    const isRoot = level === 0;
    const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'js':
                return <JavascriptIcon />;
            case 'py':
                return <CodeIcon style={{ color: '#3572A5' }} />; // Python blue
            case 'html':
                return <HtmlIcon />;
            case 'css':
                return <CssIcon />;
            case 'json':
                return <DataObjectIcon />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <ImageIcon />;
            case 'pdf':
                return <PictureAsPdfIcon />;
            case 'txt':
            case 'md':
                return <DescriptionIcon />;
            default:
                return <InsertDriveFileIcon />;
        }
    };

    const getIcon = () => {
        if (node.type === 'folder') {
            return isOpen ? <FolderOpenIcon /> : <FolderIcon />;
        } else {
            return getFileIcon(node.name);
        }
    };

    return (
        <>
            <ListItem
                button
                onClick={handleToggle}
                style={{ paddingLeft: `${level * 16}px` }}
            >
                <ListItemIcon>
                    {getIcon()}
                </ListItemIcon>
                <ListItemText primary={node.name} />
                {node.type === 'folder' && hasChildren && (
                    isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />
                )}
                <IconButton size="small" onClick={handleMenuClick}>
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                {node.type === 'file' && (
                    <IconButton size="small" onClick={handleRun}>
                        <PlayArrowIcon fontSize="small" />
                    </IconButton>
                )}
            </ListItem>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {node.type === 'file' && (
                    <MenuItem onClick={handleRun}>
                        <ListItemText>Run</ListItemText>
                    </MenuItem>
                )}
                {!isRoot && <MenuItem onClick={() => handleDialogOpen('rename')}>Rename</MenuItem>}
                {!isRoot && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
                {node.type === 'folder' && (
                    <>
                        <MenuItem onClick={() => handleDialogOpen('addFile')}>Add File</MenuItem>
                        <MenuItem onClick={() => handleDialogOpen('addFolder')}>Add Folder</MenuItem>
                    </>
                )}
            </Menu>
            {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((childNode) => (
                            <FileSystemItem
                                key={childNode.id}
                                node={childNode}
                                level={level + 1}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                onAdd={onAdd}
                                onOpen={onOpen}
                                onRun={onRun}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>
                    {dialogAction === 'rename' ? 'Rename' : dialogAction === 'addFile' ? 'Add File' : 'Add Folder'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const FileSystemStructure = () => {
    const [fileSystem, setFileSystem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const { state, actions } = useStore();
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [wsConnection, setWsConnection] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!wsConnection && state.user && state.user.id) {
            const ws = connectWebSocket();
            setWsConnection(ws);

            return () => {
                if (ws) {
                    ws.close();
                }
            };
        }
    }, [state.user, wsConnection]);



    const connectWebSocket = useCallback(() => {
        const userId = state.user ? state.user.id : '';

        const wsUrl = `wss://${HOST_URL}/ws/file_structure/?user_id=${userId}`;

        console.log('Attempting to connect to WebSocket', wsUrl);
        const ws = new WebSocket(wsUrl);
        console.log('WebSocket object created:', ws);
        const connectionTimeout = setTimeout(() => {
            console.log('WebSocket connection attempt timed out');
            if (ws.readyState !== WebSocket.OPEN) {
                ws.close();
            }
        }, 10000); // 10 seconds timeout

        ws.onopen = (event) => {
            clearTimeout(connectionTimeout);
            console.log('WebSocket connection opened:', event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error occurred:', error);
            setError('Failed to connect to file system. Please check your internet connection and try again.');
            setLoading(false);
        };

        ws.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            setError(`Connection to file system lost. ${event.reason || 'Please check your internet connection.'}`);
            wsRef.current = null;

            const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempts));
            setTimeout(() => {
                if (reconnectAttempts < 5) {
                    setReconnectAttempts(prev => prev + 1);
                    connectWebSocket();
                } else {
                    setError('Unable to reconnect. Please refresh the page or try again later.');
                }
            }, delay);
        };

        ws.onmessage = handleWebSocketMessage;

        wsRef.current = ws;
    }, [state.user, reconnectAttempts]);

    useEffect(() => {
        if (state.user && state.user.id && !wsRef.current) {
            connectWebSocket();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [state.user, connectWebSocket]);

    const handleWebSocketMessage = useCallback((event) => {
        console.log('Received message:', event.data);
        try {
            const data = JSON.parse(event.data);
            console.log('Parsed data:', data);

            switch(data.type) {
                case 'file_structure':
                    console.log('Received file structure:', data.structure);
                    setFileSystem(data.structure);
                    setLoading(false);
                    setError(null);
                    break;
                case 'file_path':
                    console.log('Received file path:', data.path);
                    actions.setOpenedFile({
                        ...state.openedFile,
                        path: data.path
                    });
                    break;
                case 'file_content':
                    console.log('Received file content:', data.content ? 'Content received' : 'No content');
                    if (data.content !== null && data.content !== undefined) {
                        actions.setOpenedFile({
                            ...state.openedFile,
                            content: data.content
                        });
                        actions.setNewCode(data.content);
                        actions.setEditorTab(0); // Switch to editor tab
                    } else {
                        console.error('Received null or undefined file content');
                        setError('File content is empty or undefined');
                    }
                    break;
                default:
                    console.log('Unhandled message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            setError('Error processing server response');
        }
    }, [actions, state.openedFile, setError, setFileSystem, setLoading]);

    const handleFileSelect = useCallback((file) => {
        console.log('File selected:', file);

        // Set initial state for the opened file
        const initialFileState = {
            id: file.id,
            name: file.name,
            type: file.type,
            path: `Root/${file.name}`,
            content: null
        };
        console.log('Setting initial file state:', initialFileState);
        actions.setOpenedFile(initialFileState);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending file path request for file:', file.id);
            wsRef.current.send(JSON.stringify({
                action: 'get_file_path',
                id: file.id
            }));

            if (file.type === 'file') {
                console.log('Sending file content request for file:', file.id);
                wsRef.current.send(JSON.stringify({
                    action: 'get_file_content',
                    id: file.id
                }));
            }
        } else {
            console.error('WebSocket is not connected');
            setError('Cannot fetch file information: WebSocket is not connected. Please try again.');
        }
    }, [actions, setError]);

    useEffect(() => {
        console.log("state openedFile path: ", state.openedFile.path)
    }, [state.openedFile]);

    const handleRunFile = useCallback((fileId) => {
        console.log(`Attempting to run file with ID: ${fileId}`);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                action: 'run_file',
                id: fileId
            }));
        } else {
            console.error('Cannot run file: WebSocket is not connected');
            setError('Cannot run file: WebSocket is not connected. Please try again.');
        }
    }, []);

    const updateNode = useCallback((id, newNode) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'update_node',
                id: id,
                newName: newNode.name
            }));
            // Update global state
            actions.setFilesInDirectory(prevFiles =>
                prevFiles.map(file => file.id === id ? {...file, name: newNode.name} : file)
            );
        } else {
            setError('Cannot update node: WebSocket is not connected. Please try again.');
        }
    }, [socket, actions]);

// Similar updates for addNode and deleteNode functions

    const addNode = useCallback((parentId, newNode) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'add_node',
                parentId: parentId,
                node: newNode
            }));
        } else {
            setError('Cannot add node: WebSocket is not connected. Please try again.');
        }
    }, [socket]);

    const deleteNode = useCallback((id) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'delete_node',
                id: id
            }));
        } else {
            setError('Cannot delete node: WebSocket is not connected. Please try again.');
        }
    }, [socket]);

    const renameNode = useCallback((id, newName) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'rename_node',
                id: id,
                newName: newName
            }));
        } else {
            setError('Cannot rename node: WebSocket is not connected. Please try again.');
        }
    }, [socket]);

    const getFullPath = useCallback((file) => {
        console.log('Getting full path for file:', file);
        let path = file.name;
        let current = file;
        console.log('Initial path:', path);
        while (current.parent) {
            console.log('Current parent:', current.parent);
            current = current.parent;
            path = `${current.name}/${path}`;
            console.log('Updated path:', path);
        }
        console.log('Final full path calculated:', path);
        return path;
    }, []);


    useEffect(() => {
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
            wsConnection.send(JSON.stringify({ action: 'get_structure' }));
        }
    }, [wsConnection]);


    useEffect(() => {
        if (wsConnection) {
            wsConnection.onmessage = handleWebSocketMessage;
        }
    }, [wsConnection, handleWebSocketMessage]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
                <Typography variant="body1" style={{ marginLeft: '10px' }}>
                    Loading file system...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" height="100%">
                <Typography color="error" gutterBottom>{error}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setLoading(true);
                        setError(null);
                        setReconnectAttempts(0);
                        connectWebSocket();
                    }}
                    style={{ marginTop: '10px' }}
                >
                    Reconnect
                </Button>
            </Box>
        );
    }

    if (!fileSystem) {
        return <Typography>Please refresh the page or try to log in.</Typography>;
    }

    return (
        <Box style={{height: "76.5vh", overflow: 'auto'}}>
            <FileSystemItem
                node={fileSystem}
                onUpdate={updateNode}
                onDelete={deleteNode}
                onAdd={addNode}
                onRename={renameNode}
                onOpen={handleFileSelect}
                onRun={handleRunFile}
            />
        </Box>
    );
};

export default FileSystemStructure;