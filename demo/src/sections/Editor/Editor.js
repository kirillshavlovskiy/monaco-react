import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import MonacoEditor from '@monaco-editor/react';
import Interface from './Interface/Interface';
import FileSystem from 'sections/FileSystem';
import Console from 'sections/Console';
import { useStore } from 'store';
import examples from 'config/examples';
import config from 'config';
import useStyles from './useStyles';
import Button from "@material-ui/core/Button";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import {MyPaper} from 'theme';
import {styled} from "@mui/material/styles";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Popover, List, ListItem, ListItemText, Breadcrumbs,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Typography, ListItemIcon
} from '@mui/material';



const HOST_URL = '13.60.82.196:8000'


const StateLogger = () => {
    const { newCode, editorTab, openedFile } = useStore(state => ({
        newCode: state.newCode,
        editorTab: state.editorTab,
        openedFile: state.openedFile
    }));

    useEffect(() => {
        console.log('Relevant state updated:', { newCode, editorTab, openedFile });
    }, [newCode, editorTab, openedFile]);

    return null;
};


const Editor = () => {
    const {state, actions} = useStore();
    const classes = useStyles();
    const webSocket = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {
        state: {
            editor: {selectedLanguageId, options},
            monacoTheme,
            themeBackground,
            fontColor,
            newCode,
            editorTab,
            filesInDirectory,
            fileSystem,
            openedFile,
        },
        actions: {setNewCode, setFilesInDirectory}
    } = useStore();
    const interfaceRef = useRef(null);
    const language = config.supportedLanguages.find(({id}) => id === selectedLanguageId).name;
    const editorRef = useRef();
    const [message, setMessage] = useState("");
    const [fontClr, setFontClr] = useState(fontColor);
    const [editorContent, setEditorContent] = useState(() => examples[selectedLanguageId] || '');
    const [currentLanguage, setCurrentLanguage] = useState('javascript');
    const fileSystemSocketRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState('test_component.js');
    const [selectedFilePath, setSelectedFilePath] = useState('Root/test_component.js');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const lastBreadcrumbRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                lastBreadcrumbRef.current && !lastBreadcrumbRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        console.log('openedFile changed in Editor:', state.openedFile);
        if (state.openedFile) {
            setEditorContent(state.openedFile.content || '');
            setSelectedFilePath(state.openedFile.path || `Root/${state.openedFile.name}`);
            console.log('Setting editor content:', state.openedFile.content);
            console.log('Setting selectedFilePath to:', state.openedFile.path || `Root/${state.openedFile.name}`);
        } else {
            setEditorContent('');
            setSelectedFilePath('Root');
        }
    }, [openedFile]);

    useEffect(() => {
        console.log('selectedFilePath updated:', selectedFilePath);
    }, [selectedFilePath]);




    useEffect(() => {
        if (fileSystem) {
            const allFiles = flattenFileStructure(fileSystem);
            setFilesInDirectory(allFiles);
            actions.setFilesInDirectory(allFiles);
            console.log('Files in directory:', allFiles);
        }
    }, [fileSystem, actions]);

    const flattenFileStructure = (structure, prefix = '') => {
        return structure.reduce((acc, item) => {
            const path = `${prefix}${item.name}`;
            if (item.type === 'file') {
                acc.push({...item, path});
            }
            if (item.children) {
                acc.push(...flattenFileStructure(item.children, `${path}/`));
            }
            return acc;
        }, []);
    };

    useEffect(() => {
        console.log('openedFile changed:', openedFile);
        if (openedFile) {
            setCurrentLanguage(getLanguageFromFileName(openedFile.name));
            setEditorContent(openedFile.content || '');
            actions.setNewCode(openedFile.content || '');
            setSelectedFile(openedFile);
            setSelectedFilePath(openedFile.path);
            console.log('Setting selectedFilePath to:', openedFile.path);
            console.log('Current file path:', openedFile.path);
            console.log('Current file name:', openedFile.name);

            // Update filesInDirectory
            const updatedFiles = filesInDirectory.map(file =>
                file.id === openedFile.id ? {...file, content: openedFile.content} : file
            );
            setFilesInDirectory(updatedFiles);
            actions.setFilesInDirectory(updatedFiles);
        }
    }, [openedFile, filesInDirectory, actions]);

    const handleFileChange = (event) => {
        const newFilePath = event.target.value;
        const newFile = filesInDirectory.find(file => file.path === newFilePath);
        if (newFile) {
            setSelectedFilePath(newFilePath);
            console.log("New selected file path:  ", selectedFilePath)
            actions.setOpenedFile(newFile);
            console.log("New opened file:  ", selectedFilePath)
        }
    };

    const getLanguageFromFileName = (fileName) => {
        if (!fileName) return 'javascript';  // Default to javascript (React) if filename is undefined
        const extension = fileName.split('.').pop().toLowerCase();
        const languageMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            // Add more mappings as needed
        };
        return languageMap[extension] || 'javascript';  // Default to javascript if extension is not recognized
    };


    useEffect(() => {
        setNewCode(editorContent);
    }, []);

    useEffect(() => {
        if (interfaceRef.current) {
            interfaceRef.current.setVisibility(editorTab === 1);
        }
    }, [editorTab]);


    const connectFileSystemWebSocket = () => {
        const ws = new WebSocket(`ws://${HOST_URL}/ws/file_structure/`);

        ws.onopen = () => {
            console.log('File System WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'file_content' && data.id === openedFile?.id) {
                setEditorContent(data.content);
                setNewCode(data.content);
            }
            // Handle other message types...
        };

        ws.onerror = (error) => {
            console.error('File System WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('File System WebSocket disconnected');
            // Attempt to reconnect after a delay
            setTimeout(connectFileSystemWebSocket, 3000);
        };

        fileSystemSocketRef.current = ws;
    };

    useEffect(() => {
        connectFileSystemWebSocket();
        return () => {
            if (fileSystemSocketRef.current) {
                fileSystemSocketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        console.log('newCode changed:', newCode);
        if (newCode !== editorContent) {
            setEditorContent(newCode);
        }
    }, [newCode]);


    useEffect(() => {
        if (isEditorReady && editorRef.current) {
            const currentValue = editorRef.current.getValue();
            if (editorContent !== currentValue) {
                editorRef.current.setValue(editorContent);
            }
        }
    }, [editorContent, isEditorReady]);

    useEffect(() => {
        console.log('openedFile changed:', openedFile);
        if (openedFile) {
            setCurrentLanguage(getLanguageFromFileName(openedFile.name));
            if (fileSystemSocketRef.current && fileSystemSocketRef.current.readyState === WebSocket.OPEN) {
                fileSystemSocketRef.current.send(JSON.stringify({
                    action: 'get_file_content',
                    id: openedFile.id
                }));
            }
        } else {
            setCurrentLanguage('react');
            setEditorContent(examples['react'] || '');
            setNewCode(examples['react'] || '');
        }
    }, [openedFile, setNewCode]);

    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    function handleEditorWillMount(monaco) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            module: monaco.languages.typescript.ModuleKind.ES2015,
            allowNonTsExtensions: true,
            lib: ['es2018'],
        });
    }

    function handleEditorDidMount(editor, monaco) {
        console.log('Editor mounted');
        editorRef.current = editor;
        setIsEditorReady(true);
        editor.setValue(editorContent);
        setNewCode(editorContent);
    }

    const debouncedHandleEditorChange = React.useCallback(
        debounce((value) => {
            console.log('Editor content changed:', value.slice(0, 50) + '...');
            setEditorContent(value);
            setNewCode(value);

            if (openedFile) {
                console.log('Updating opened file:', openedFile.name);
                if (fileSystemSocketRef.current && fileSystemSocketRef.current.readyState === WebSocket.OPEN) {
                    const message = JSON.stringify({
                        action: 'update_file_content',
                        id: openedFile.id,
                        content: value
                    });
                    console.log('Sending update message:', message.slice(0, 100) + '...');
                    fileSystemSocketRef.current.send(message);
                } else {
                    console.log('WebSocket is not ready for sending');
                }
            } else {
                console.log('No file is currently opened. Changes will be saved in local state.');
            }
        }, 1000),
        [openedFile, setNewCode]
    );


    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    const StyledTabs = styled((props) => (
        <Tabs
            {...props}
            TabIndicatorProps={{children: <span className="MuiTabs-indicatorSpan"/>}}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 100,
            width: '100%',
            backgroundColor: fontClr,
        },
    });

    const StyledTab = styled((props) => (
        <Tab
            disableRipple
            {...props}
            label={
                <Box p={0}>
                    {props.label}
                </Box>}
        />
    ))(({theme}) => ({
        '&.Mui-selected': {
            color: fontClr,
        },
        '&:not(:last-child)::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            height: '50%',
            top: '25%',
            right: 0,
            borderRight: `1px solid ${fontClr}`,
        }
    }));

    const [messages, setMessages] = useState([]);
    const pythonContentRegex = /(?<=```python\n)[\s\S]+(?=\n```)/gm;
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async (rawMessage) => {
        const message = stripHTMLTags(rawMessage);
        const isPythonCode = message.match(pythonContentRegex) !== null;
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: 'Admin',
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(!message.includes('to: Admin'));
        if (webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({message: newMessage.message}));
            setMessage("");
        }
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    function stripHTMLTags(text) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        const plainText = tempElement.textContent || tempElement.innerText || '';
        return plainText;
    }

    const handleTabChange = (event, newValue) => {
        actions.setEditorTab(newValue);
    };

    async function handleRun() {
        try {
            const code = getEditorValue();
            const inputData = {message: {code: code, input_values: null}};
            const response = await fetch("http://localhost:8000/courses/api/code_execute/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
            const result = await response.json();
            const {completion, image, message, output, prompt_line_n} = result;
            console.log("Execution result:", result);
        } catch (error) {
            console.error("Error in handleRun function: ", error.message);
        }
    }

    async function handleImprove() {
        try {
            const code = getEditorValue();
            const inputData = {message: {code: code, input_values: null}};
            const response = await fetch("http://localhost:8000/courses/api/code_execute/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
            const result = await response.json();
            const {completion, image, message, output, prompt_line_n} = result;
            console.log("Execution result:", result);
            webSocket.current.send(JSON.stringify({message: `Check my code below:\n${code}\n\n***Execution Result***:\n${output}\nPlease suggest improvements to fix errors and improve program's functionality`}));
        } catch (error) {
            console.error("Error in handleImprove function: ", error.message);
        }
    }


    useEffect(() => {
        console.log('selectedFilePath ::', selectedFilePath);
        console.log('filesInDirectory ::', filesInDirectory);
    }, [selectedFilePath, filesInDirectory]);





    const handleFileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFileSelect = (file) => {
        actions.setOpenedFile(file);
        handleFileMenuClose();
    };

    const getCurrentFolderFiles = useCallback(() => {
        if (!state.fileSystem || !state.openedFile) return [];

        const pathParts = state.openedFile.path.split('/');
        pathParts.pop(); // Remove the current file name
        let currentFolder = state.fileSystem;

        for (let part of pathParts) {
            if (part === 'Root') continue;
            currentFolder = currentFolder.children.find(child => child.name === part);
            if (!currentFolder) return [];
        }

        return currentFolder.children.filter(child => child.type === 'file');
    }, [state.fileSystem, state.openedFile]);

    const StyledBreadcrumb = styled(Chip)(({theme, fontColor}) => ({
        maxHeight: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
        color: fontColor,
        '& .MuiChip-label': {
            color: theme.palette.text.primary,
            fontSize: '0.9rem',
            padding: '0 5px',
        },
        '& .MuiChip-icon': {
            color: theme.palette.text.primary,
        },
        '&:hover, &:focus': {
            backgroundColor: '#3C3C3C',
            '& .MuiChip-label': {
                color: fontColor,
            },
            '& .MuiChip-icon': {
                color: fontColor,
            },
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: '#3C3C3C',
            color: fontColor,
        },
    }));



    const DropdownList = styled(List)(({theme}) => ({
        position: 'absolute',
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        padding: 0,
        maxHeight: '200px',
        overflowY: 'auto',
    }));

    const StyledListItem = styled(ListItem)(({theme, fontColor}) => ({
        padding: '4px 8px',
        '& .MuiListItemText-primary': {
            fontSize: '0.9rem',
            color: theme.palette.text.primary,
        },
        '&:hover': {
            backgroundColor: '#3C3C3C',
            '& .MuiListItemText-primary': {
                color: fontColor,
            },
        },
    }));


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                lastBreadcrumbRef.current && !lastBreadcrumbRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleAddFileClick = () => {
        handleClose();
        setIsAddFileDialogOpen(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleAddFileConfirm = () => {
        if (newFileName) {
            // Here you would add the logic to actually create the new file
            console.log(`Creating new file: ${newFileName}`);
            // Update your file system state here
        }
        setIsAddFileDialogOpen(false);
        setNewFileName('');
    };

    const open = Boolean(anchorEl);

    const renderBreadcrumbs = () => {
        if (!selectedFilePath || selectedFilePath === 'Root') {
            return (
                <Breadcrumbs aria-label="file path" separator="/">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Root"
                        onClick={(e) => handleBreadcrumbClick(e, 'Root')}
                    />
                </Breadcrumbs>
            );
        }

        const pathParts = selectedFilePath.split('/').filter(Boolean);

        return (
            <Box position="relative">
                <Breadcrumbs aria-label="file path" separator="/">
                    {pathParts.map((part, index) => {
                        const path = '/' + pathParts.slice(0, index + 1).join('/');
                        const isLastPart = index === pathParts.length - 1;
                        return (
                            <StyledBreadcrumb
                                key={path}
                                component="a"
                                href="#"
                                label={part}
                                ref={isLastPart ? lastBreadcrumbRef : null}
                                onClick={(e) => {
                                    if (isLastPart) {
                                        toggleDropdown();
                                    } else {
                                        handleBreadcrumbClick(e, path);
                                    }
                                }}
                                deleteIcon={isLastPart ? <ExpandMoreIcon /> : undefined}
                                onDelete={isLastPart ? toggleDropdown : undefined}
                            />
                        );
                    })}
                </Breadcrumbs>
                {isDropdownOpen && (
                    <DropdownList ref={dropdownRef}>
                        <StyledListItem button onClick={handleAddFileClick}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="+ Add new file" />
                        </StyledListItem>
                        {getCurrentFolderFiles().map((file) => (
                            <StyledListItem
                                button
                                key={file.id}
                                onClick={() => handleFileSelect(file)}
                            >
                                <ListItemText primary={file.name} />
                            </StyledListItem>
                        ))}
                    </DropdownList>
                )}
            </Box>
        );
    };

// Add this dialog component after your renderBreadcrumbs function
    const renderAddFileDialog = () => (
        <Dialog open={isAddFileDialogOpen} onClose={() => setIsAddFileDialogOpen(false)}>
            <DialogTitle>Add New File</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="File Name"
                    type="text"
                    fullWidth
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsAddFileDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFileConfirm}>Add</Button>
            </DialogActions>
        </Dialog>
    );



    const handleBreadcrumbClick = (event, path) => {
        event.preventDefault();
        console.log(`Navigating to: ${path}`);
        // You can add logic here to update the file system view or open the corresponding folder/file
    };


return (
    <div className={classes.root} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <StateLogger />
        <div className={classes.terminal} style={{ display: 'flex', height: 'calc(100% - 20vh)', overflow: 'hidden' }}>
            <MyPaper
                className={classes.editor}
                monacoTheme={monacoTheme}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    height: '100%',
                    overflow: 'hidden',
                    padding: 0,
                }}
            >
                <StyledTabs
                    value={editorTab}
                    onChange={handleTabChange}
                    aria-label="editor tabs"
                    className={classes.tabsStyled}
                    style={{marginTop: "-20px", marginBottom: "15px", hight: "7.5px"}}
                >
                    <StyledTab className={classes.tab} label="Code"/>
                    <StyledTab className={classes.tab} label="Interface"/>
                    <StyledTab className={classes.tab} label="File System"/>
                    <StyledTab className={classes.tab} label="API"/>
                    <StyledTab className={classes.tab} label="Data"/>
                    <StyledTab className={classes.tab} label="Modules"/>
                </StyledTabs>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    height: 'calc(100% - 22px)' // Subtract tabs and breadcrumbs height
                }}>
                    {/* Code Tab */}
                    {editorTab === 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            <div style={{flexGrow: 1, overflow: 'hidden'}}>
                                <MonacoEditor
                                    value={editorContent}
                                    key="monaco_editor"
                                    theme={monacoTheme}
                                    height="100%"
                                    language={currentLanguage}
                                    options={options}
                                    onMount={handleEditorDidMount}
                                    onChange={debouncedHandleEditorChange}
                                />
                            </div>
                            <Box className={classes.buttonContainer} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                padding: '8px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                                minHeight: '38px',
                                flexShrink: 0
                            }}>
                                <Button className={classes.execute_button}
                                        variant="contained"
                                        disabled={!isEditorReady}
                                        endIcon={<HandymanRoundedIcon/>}
                                        onClick={handleImprove}
                                >
                                    FIX
                                </Button>
                                <Button className={classes.execute_button}
                                        variant="contained"
                                        disabled={!isEditorReady}
                                        endIcon={<PlayArrowIcon/>}
                                        onClick={handleRun}
                                        style={{marginLeft: '10px'}}
                                >
                                    Run
                                </Button>
                            </Box>
                        </div>
                    )}

                    {/* Interface Tab */}
                    <div style={{
                        display: editorTab === 1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <Interface
                            ref={interfaceRef}
                            code={editorContent}
                            language={getLanguageFromFileName(selectedFile?.name)}
                            fileName={selectedFile?.name || 'test_component.js'}
                            filePath={selectedFile?.path || 'Root/'}
                            onFileChange={handleFileChange}
                            filesInDirectory={filesInDirectory}
                        />
                    </div>


                    <div style={{
                        display: editorTab === 2 ? 'flex' : 'none',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <FileSystem/>
                    </div>


                    <div style={{
                        display: editorTab === 3 ? 'flex' : 'none',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <p>API Component (To be implemented)</p>
                    </div>

                    <div style={{
                        display: editorTab === 4 ? 'flex' : 'none',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <p>Data Space Component (To be implemented)</p>
                    </div>

                    <div style={{
                        display: editorTab === 5 ? 'flex' : 'none',
                        flexDirection: 'column',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <p>Service Modules Connection Component (To be implemented)</p>
                    </div>

                    <Box sx={{
                        padding: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        color: fontColor,

                    }}>
                        {renderBreadcrumbs()}
                        {renderAddFileDialog()}
                    </Box>
                </div>
        </MyPaper>
            <div className={classes.console} style={{ height: '100%', overflow: 'auto'}}>
                <Console/>
            </div>
        </div>
        {/*<div style={{ height: '20vh', overflow: 'auto' }}>*/}
        {/*    /!* Any additional content you want below the main area *!/*/}
        {/*</div>*/}
    </div>
);
};

export default Editor;