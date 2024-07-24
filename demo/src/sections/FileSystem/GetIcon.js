import React, { useState } from 'react';
import {
    List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton, Menu, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import JavascriptIcon from '@mui/icons-material/Javascript';
import CodeIcon from '@mui/icons-material/Code';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DataObjectIcon from '@mui/icons-material/DataObject';

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


export default getFileIcon;