import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Editor from 'sections/Editor';
import Settings from 'sections/Settings'; // don't forget to import Settings
import { useStore } from 'store';
import classNames from 'classnames';
import useStyles from './useStyles';
import {styled, useTheme} from "@mui/material/styles";

const Content = _ => {
const classes = useStyles();
const theme = useTheme();
const MainPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    button: {
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
    },
    fields: {
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
    },
}));

  return (
    <MainPaper
        elevation={0}
        square={true}
        className={classNames('full-size', classes.root)}
    >
      <Editor />
    </MainPaper>
  );
}

export default Content;