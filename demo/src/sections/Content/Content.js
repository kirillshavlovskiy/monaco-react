import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Editor from 'sections/Editor';
import Settings from 'sections/Settings'; // don't forget to import Settings
import { useStore } from 'store';
import classNames from 'classnames';
import useStyles from './useStyles';

const Content = _ => {
  const classes = useStyles();
  const { state: { editorMode,isSettingsVisible } } = useStore();

  console.log('Is Settings Visible:', isSettingsVisible);
  return (
    <Paper elevation={0} square={true} className={classNames('full-size', classes.root)}>
      <Editor />

    </Paper>
  );
}

export default Content;