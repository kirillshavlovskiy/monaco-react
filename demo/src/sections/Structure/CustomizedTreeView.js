import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Box } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RemoveIcon from '@material-ui/icons/Remove';

import Collapse from '@material-ui/core/Collapse';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import { TreeView, TreeItem } from '@material-ui/lab';

// ... <MinusSquare />, <PlusSquare /> and <CloseSquare /> components code here ...

function TransitionComponent(props) {
  const style = useSpring({
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const styles = theme => ({
  root: {
    '&.MuiTreeItem-root > .MuiTreeItem-content > .MuiTreeItem-iconContainer .close': {
      opacity: 0.3,
    },
    '&.MuiTreeItem-root .MuiTreeItem-group': {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  }
});

const StyledTreeItem = withStyles(styles)(({ classes, ...others }) => (
  <TreeItem {...others} TransitionComponent={TransitionComponent} className={classes.root} />
));

export default function CustomizedTreeView() {
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
        {/* Other Tree Items */}
      </StyledTreeItem>
    </TreeView>
    </Box>
  );
}