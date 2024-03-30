import React, { useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Editor from '@monaco-editor/react';
import { useStore } from 'store';
import config from 'config';
import { isMobile } from 'utils';
import useStyles from './useStyles';
import {withStyles} from "@material-ui/core/styles";
import { useTheme } from '@mui/material';


const CustomTextField = withStyles((theme) => ({
  root: {
    '& .MuiFilledInput-input': {
      backgroundColor: theme.palette.background.paper
    },
    '& .MuiFilledInput-underline:before': {
      borderBottomColor: theme.palette.background.paper
    },
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: theme.palette.text.primary
    }
  }
}))(TextField);





const Settings = _ => {
  const classes = useStyles({ isMobile });
  const [isEditorReady, setIsEditorReady] = useState(false);
  const {
    state: { editor: { selectedLanguageId, options }, monacoTheme },
    actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification },
    effects: { defineTheme, monacoThemes },
  } = useStore();
  const theme = useTheme();
  const editorRef = useRef();

  function handleLanguageChange(ev) {
    setSelectedLanguageId(ev.target.value);
  }

  function handleThemeChange(ev) {
    const theme = ev.target.value;

    if (config.defaultThemes.includes(theme)) {
      setMonacoTheme(theme);
    } else {
      defineTheme(theme).then(_ => setMonacoTheme(theme));
    }
  }

  function getEditorValue() {
    return editorRef.current?.getValue();
  }

  function handleEditorDidMount(editor, monaco) {
    setIsEditorReady(true);
    editorRef.current = editor;
  }

  function handleApply() {
    const currentValue = getEditorValue();
    let options;
    try {
      options = JSON.parse(currentValue);
      setOptions(options);
    } catch {
      showNotification({
        message: config.messages.invalidOptions,
        variant: "error",
      });
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">Settings</Typography>
      <Divider />
      <div className={classes.languages}
           style={{ color: theme.palette.text.primary }}>
        <Typography className={classes.title} variant="h6">Languages</Typography>
        <CustomTextField
            select
            variant="filled"
            value={selectedLanguageId}
            onChange={handleLanguageChange}
            className="full-width"
            label="Language"
        >
          {config.supportedLanguages.map(language => (
            <MenuItem key={language.id} value={language.id}>
              {language.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>

      <div>
        <Typography className={classes.title} variant="h6">Themes</Typography>
        <CustomTextField
          select
          variant="filled"
          value={monacoTheme}
          onChange={handleThemeChange}
          className="full-width"
          label="Theme"
        >
          {config.defaultThemes.map(theme => (
            <MenuItem key={theme} value={theme}>
              {theme}
            </MenuItem>
          ))}
          <MenuItem disabled><Divider /></MenuItem>
          {Object.entries(monacoThemes).map(([themeId, themeName]) => (
            <MenuItem key={themeId} value={themeId}>
              {themeName}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>

      <div>
        <Typography className={classes.title} variant="h5">Options</Typography>


        <div className={classes.editor}>
          <Editor
            theme={monacoTheme}
            language="json"
            height={400}
            value={JSON.stringify(options, null, 2)}
            onMount={handleEditorDidMount}
          />
        </div>
        <Button variant="outlined" disabled={!isEditorReady} onClick={handleApply}>>Apply</Button>
      </div>
    </div>
  );
};

export default Settings;
