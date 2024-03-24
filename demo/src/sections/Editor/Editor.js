import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Paper from '@material-ui/core/Paper';
import Settings from 'sections/Settings';
import { useStore } from 'store';
import { isMobile } from 'utils';
import examples from 'config/examples';
import config from 'config';

import useStyles from './useStyles';

const Editor = _ => {
  const editorRef = useRef();
  const classes = useStyles();
  const [editorWidth, setEditorWidth] = useState('100%');
  const { state: { editor: { selectedLanguageId, options }, monacoTheme, isSettingsVisible } } = useStore();

  const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;

  function handleEditorWillMount(monaco) {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      module: monaco.languages.typescript.ModuleKind.ES2015,
      allowNonTsExtensions: true,
      lib: ['es2018'],
    });
  }
  function handleEditorDidMount(editor, monaco) {
  editorRef.current = editor; // Assign editor instance
  editorRef.current.layout(); // Force editor's layout adjust
}

    React.useEffect(() => {
        if (isSettingsVisible) {
            // if settings are visible, we reduce the width of the editor
            setEditorWidth('66%');
        } else {
            setEditorWidth('100%');
        }
    }, [isSettingsVisible]);

return <div className={classes.root}>
    {
      !isMobile && ( <MonacoEditor
          key={editorWidth}
          theme={monacoTheme}
          height="100vh"
          fontSize="16"
          fontFamily="monospace"
          path={language}
          defaultValue={examples[selectedLanguageId] || ''}
          defaultLanguage={language}
          options={options}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />

      )
    }

    { isSettingsVisible && <Settings /> }
</div>

}

export default Editor;