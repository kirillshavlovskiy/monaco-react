import React, { useState, useCallback, useEffect } from 'react';
import Editor from '../Editor'; // Adjust the path as needed
import { useStore } from 'store';
import {
    List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Menu, MenuItem, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box
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
            onOpen(node.id, node.name, node.type);
        }
    };

    const handleRun = () => {
        onRun(node.id);
        handleMenuClose();
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
    const [openedFile, setOpenedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const { state, actions } = useStore();

    const addNodeToState = useCallback((parentId, newNode) => {
        console.log('Adding node to state:', parentId, newNode);
        setFileSystem(prevState => {
            const addNode = (node) => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        children: [...(node.children || []), newNode]
                    };
                }
                if (node.children) {
                    return { ...node, children: node.children.map(addNode) };
                }
                return node;
            };
            return addNode(prevState);
        });
    }, []);


    const connectWebSocket = useCallback(() => {
        const userId = state.user ? state.user.id : '';
        const wsUrl = `ws://localhost:8000/ws/file_structure/?user_id=${userId}`;
        console.log('Attempting to connect to WebSocket');
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setSocket(ws);
            ws.send(JSON.stringify({ action: 'get_structure' }));
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Failed to connect to file system. Please try again later.');
            setLoading(false);
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected', event);
            setError(`Connection to file system lost. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`);

            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        };

        return ws;
    }, [state.user]);

    const updateNode = useCallback((id, newNode) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'update_node',
                id: id,
                newName: newNode.name

            }));
        } else {
            setError('Cannot update node: WebSocket is not connected');
        }
    }, [socket]);



    const addNode = useCallback((parentId, newNode) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'add_node',
                parentId: parentId,
                node: newNode
            }));
        } else {
            setError('Cannot add node: WebSocket is not connected');
        }
    }, [socket]);

    const handleRunFile = (fileId) => {
        // Implement logic to run the file
        console.log(`Running file with id: ${fileId}`);
    };

    const renameNode = useCallback((id, newName) => {
        console.log('Renaming node:', id, newName);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'rename_node',
                id: id,
                newName: newName
            }));
        } else {
            setError('Cannot rename node: WebSocket is not connected');
        }
    }, [socket]);

    const deleteNode = useCallback((id) => {
        console.log('Deleting node:', id);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'delete_node',
                id: id
            }));
        } else {
            setError('Cannot delete node: WebSocket is not connected');
        }
    }, [socket]);

    const updateFileSystemState = useCallback((updatedNode) => {
        setFileSystem(prevState => {
            const updateNode = (node) => {
                if (node.id === updatedNode.id) {
                    return { ...node, ...updatedNode };
                }
                if (node.children) {
                    return { ...node, children: node.children.map(updateNode) };
                }
                return node;
            };
            return updateNode(prevState);
        });
    }, []);

    const removeNodeFromState = useCallback((nodeId) => {
        setFileSystem(prevState => {
            const removeNode = (node) => {
                if (node.id === nodeId) {
                    return null;
                }
                if (node.children) {
                    return {
                        ...node,
                        children: node.children.filter(child => child.id !== nodeId).map(removeNode)
                    };
                }
                return node;
            };
            return removeNode(prevState);
        });
    }, []);


    const handleOpenFile = useCallback((fileId, fileName, fileType) => {
        console.log(`Attempting to open file: ${fileName} (ID: ${fileId})`);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: 'get_file_content',
                id: fileId
            }));
        } else {
            console.error('Cannot fetch file content: WebSocket is not connected');
            setError('Cannot fetch file content: WebSocket is not connected');
        }
    }, [socket, setError]);

    const handleFileSelect = useCallback((file) => {
        console.log('File selected:', file);  // Log the file parameter, not openedFile state
        actions.setOpenedFile(file);
        actions.setNewCode(file.content || '');
        actions.setEditorTab(0); // Switch to editor tab
        // Any other necessary state updates
    }, [actions]);

    useEffect(() => {
        const ws = connectWebSocket();

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            const data = JSON.parse(event.data);
            switch(data.type) {
                case 'file_structure':
                    console.log('Received file structure:', data.structure);
                    setFileSystem(data.structure);
                    setLoading(false);
                    break;
                case 'node_added':
                    console.log('Node added:', data.node);
                    addNodeToState(data.node.parent, data.node);
                    break;
                case 'node_renamed':
                    console.log('Node renamed:', data.node);
                    updateFileSystemState(data.node);
                    break;
                case 'node_deleted':
                    console.log('Node deleted:', data.id);
                    removeNodeFromState(data.id);
                    break;
                case 'file_content':
                    console.log('Received file content:', data);
                    if (data.content !== null && data.content !== undefined) {
                        const updatedFile = {
                            id: data.id,
                            name: data.name,
                            content: data.content,
                            type: 'file'
                        };
                        handleFileSelect(updatedFile);
                    } else {
                        console.error('Received null or undefined file content');
                        setError('File content is empty or undefined');
                    }
                    break;
                case 'error':
                    console.error('Received error:', data.message);
                    setError(data.message);
                    break;
                default:
                    console.log('Received unknown message type:', data.type);
            }
        };

        return () => {
            if (ws) {
                console.log('Closing WebSocket connection');
                ws.close();
            }
        };
    }, [connectWebSocket, actions, handleFileSelect, openedFile]);


    if (loading) {
        return <Typography>Loading file system...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!fileSystem) {
        return <Typography>No file system found.</Typography>;
    }

    return (
        <>
        <Box style={{height: "76.5vh"}}>
            {error && <div style={{color: 'red', height: "76.5vh"}}>{error}</div>}
            <FileSystemItem
                node={fileSystem}
                onUpdate={updateNode}
                onDelete={deleteNode}
                onAdd={addNode}
                onRename={renameNode}
                onOpen={handleOpenFile}
                onRun={handleRunFile}
            />

        </Box>
        </>
    );
};

export default FileSystemStructure;