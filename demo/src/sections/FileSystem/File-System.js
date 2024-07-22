import React, { useState, useEffect, useCallback } from 'react';
import {
    List, ListItem, ListItemText, ListItemIcon,
    Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled } from '@mui/material/styles';
import { useStore } from 'store'; // Assuming you have a store for state management

const FileSystemContainer = styled('div')({
    padding: '10px',
    overflowY: 'auto',
    height: '100%',
});

const FileSystem = () => {
    const [fileStructure, setFileStructure] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set(['MyProject']));
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [currentPath, setCurrentPath] = useState([]);
    const [error, setError] = useState(null);
    const { state, actions } = useStore();
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        let ws;
        const connectWebSocket = () => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.host;
            ws = new WebSocket(`${protocol}//${host}/ws/file_structure/`);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setError(null);
                ws.send(JSON.stringify({ action: 'get_structure' }));
            };

            ws.onmessage = (event) => {
                console.log('Received message:', event.data);
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'file_structure') {
                        console.log('Received file structure:', data.structure);
                        setFileStructure(data.structure);
                    }
                } catch (e) {
                    console.error('Error parsing WebSocket message:', e);
                    setError('Error parsing data from server');
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket error occurred');
            };

            ws.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                setError('WebSocket disconnected. Retrying in 5 seconds...');
                setTimeout(connectWebSocket, 5000);
            };

            setSocket(ws);
        };

        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = useCallback((message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('Sending message:', message);
            socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. ReadyState:', socket ? socket.readyState : 'No socket');
            setError('Cannot send message: WebSocket is not connected');
        }
    }, [socket]);

    const toggleFolder = (folderPath) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderPath)) {
                newSet.delete(folderPath);
            } else {
                newSet.add(folderPath);
            }
            return newSet;
        });
    };

    const handleFileClick = (filePath, content) => {
        actions.setNewCode(content);
    };

    const handleAdd = (type) => {
        setDialogAction(type);
        setCurrentPath([]);
        setNewItemName('');
        setOpenDialog(true);
    };

    const handleEdit = (path, name) => {
        setDialogAction('rename');
        setCurrentPath(path);
        setNewItemName(name);
        setOpenDialog(true);
    };

    const handleDelete = (path) => {
        sendMessage({
            action: 'delete_item',
            path: path
        });
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewItemName('');
    };

    const handleDialogConfirm = () => {
        if (dialogAction === 'rename') {
            sendMessage({
                action: 'rename_item',
                old_path: [...currentPath, newItemName],
                new_name: newItemName
            });
        } else {
            sendMessage({
                action: 'add_item',
                path: currentPath,
                name: newItemName,
                item_type: dialogAction === 'addFile' ? 'file' : 'directory'
            });
        }
        handleDialogClose();
    };




    const renderFileStructure = (structure, path = []) => {
        return Object.entries(structure).map(([name, item]) => {
            const fullPath = [...path, name];
            const isExpanded = expandedFolders.has(fullPath.join('/'));

            return (
                <div key={fullPath.join('/')}>
                    <ListItem>
                        <ListItemIcon onClick={() => item.type === 'directory' && toggleFolder(fullPath.join('/'))} style={{ cursor: 'pointer' }}>
                            {item.type === 'directory' ? (isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />) : <DescriptionIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={name}
                            onClick={() => item.type === 'directory' ? toggleFolder(fullPath.join('/')) : handleFileClick(fullPath.join('/'), item.content)}
                            style={{ cursor: 'pointer' }}
                        />
                        <IconButton onClick={() => handleEdit(path, name)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(fullPath)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                    {item.type === 'directory' && isExpanded && (
                        <div style={{ marginLeft: 20 }}>
                            {renderFileStructure(item.children, fullPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <p>Connection Status: {connectionStatus}</p>
            </div>
        );
    }

    if (!fileStructure) {
        return (
            <div>
                <p>Loading... (If this persists, there might be a connection issue)</p>
                <p>Connection Status: {connectionStatus}</p>
            </div>
        );
    }


    return (
        <FileSystemContainer>
            <p>Connection Status: {connectionStatus}</p>
            <List>
                {renderFileStructure(fileStructure)}
            </List>
            <Button startIcon={<AddIcon/>} onClick={() => handleAdd('addFile')}>Add File</Button>
            <Button startIcon={<AddIcon/>} onClick={() => handleAdd('directory')}>Add Folder</Button>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{dialogAction === 'rename' ? 'Rename Item' : 'New Item Name'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDialogConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </FileSystemContainer>
    );
};

export default FileSystem;