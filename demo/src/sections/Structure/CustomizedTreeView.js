import React, { useState } from 'react';
import { Box, Drawer, IconButton, withStyles } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuIcon from '@mui/icons-material/Menu';
import { TreeView, TreeItem } from '@mui/lab';
import { alpha } from '@mui/system';

const styles = theme => ({
    root: {
        '&.MuiTreeItem-root > .MuiTreeItem-content > .MuiTreeItem-iconContainer .close': {
            opacity: 0.3,
        },
        '&.MuiTreeItem-root .MuiTreeItem-group': {
            marginLeft: 15,
            paddingLeft: 18,
            borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
        },
    }
});

const StyledTreeItem = withStyles(styles)(({ classes, ...others }) => (
    <TreeItem {...others} className={classes.root} />
));

export default function CustomizedTreeView() {
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerOpen = () => {
        setIsOpen(true);
    };

    const handleDrawerClose = () => {
        setIsOpen(false);
    };

    return (
        <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
            <IconButton edge="start" color="inherit" onClick={handleDrawerOpen}>
                <MenuIcon />
            </IconButton>

            <Drawer anchor="left" open={isOpen} onClose={handleDrawerClose}>
                <TreeView
                    aria-label="customized"
                    defaultExpanded={['1']}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    defaultEndIcon={<RemoveIcon />}
                    style={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
                >
                    <StyledTreeItem nodeId="1" label="Main">
                        {/* Other Tree Items */}
                    </StyledTreeItem>
                </TreeView>
            </Drawer>
        </Box>
    );
}