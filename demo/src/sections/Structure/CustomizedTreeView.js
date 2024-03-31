import React, { useState } from 'react';
import { Box } from '@mui/material';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RemoveIcon from '@mui/icons-material/Remove';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
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




    return (

            <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
                    <TreeView
                        aria-label="customized"
                        defaultExpanded={['1']}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultEndIcon={<RemoveIcon />}
                        style={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
                    >
                        <StyledTreeItem nodeId="1" label="Main">
                            <StyledTreeItem nodeId="2" label="Child of Main">
                                <StyledTreeItem nodeId="3" label="Grandchild of Main">
                                    <StyledTreeItem nodeId="4" label="Great Grandchild of Main" />
                                </StyledTreeItem>
                            </StyledTreeItem>
                        </StyledTreeItem>
                    </TreeView>

            </Box>

    );
}