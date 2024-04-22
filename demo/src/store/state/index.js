import config from 'config';

const initalTheme = 'dark';

const initialState = {
  themeMode: initalTheme,
  isSettingsVisible: false,
  isSideBarVisible: true,
  isEditorReady: false,

  notifications: config.notifications.defaultState,

  editor: {
    selectedLanguageId: 37, // 19 is the id of javasctipt
    options: {
      inlayHintsOptions: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      accessibilitySupport: 'auto',
      autoIndent: false,
      automaticLayout: true,
      codeLens: true,
      colorDecorators: true,
      contextmenu: true,
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: false,
      cursorStyle: 'line',
      disableLayerHinting: false,
      disableMonospaceOptimizations: false,
      dragAndDrop: false,
      fixedOverflowWidgets: false,
      folding: true,
      foldingStrategy: 'auto',
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      fontLigatures: false,
      formatOnPaste: false,
      formatOnType: false,
      hideCursorInOverviewRuler: false,
      highlightActiveIndentGuide: true,
      lineHeight: 24,
      links: true,
      minimap: {
        enabled: true,
      },
      scrollbar: {
        useShadows: true,
        horizontalSliderSize: 1,
        verticalSliderSize: 1,
      },
      mouseWheelZoom: true,
      multiCursorMergeOverlapping: true,
      multiCursorModifier: 'alt',
      overviewRulerBorder: true,
      overviewRulerLanes: 2,
      provideInlayHints: true,
      quickSuggestions: true,
      quickSuggestionsDelay: 100,
      readOnly: false,
      renderControlCharacters: false,
      renderFinalNewline: true,
      renderIndentGuides: false,
      renderLineHighlight: 'none',
      renderWhitespace: 'none',
      revealHorizontalRightPadding: 30,
      roundedSelection: true,
      rulers: [],
      scrollBeyondLastColumn: 5,
      scrollBeyondLastLine: true,
      selectOnLineNumbers: true,
      selectionClipboard: true,
      selectionHighlight: true,
      showFoldingControls: 'mouseover',
      smoothScrolling: true,
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
      // eslint-disable-next-line
      wordSeparators: `~!@#$%^&*()-=+[{]}\|;:'",.<>/?`,
      wordWrap: 'off',
      wordWrapBreakAfterCharacters: '\t})]?|&,;',
      wordWrapBreakBeforeCharacters: '{([+',
      wordWrapBreakObtrusiveCharacters: '.',
      wordWrapColumn: 80,
      wordWrapMinified: true,
      wrappingIndent: 'none',
    },
  },

  editorMode: 'editor',
  themeBackground: '#1E1E1E',
  fontColor: '#EDECE4',
  newCode: '',
  ai_editorValue: '',
  monacoTheme: initalTheme === 'dark' ? 'vs-dark' : initalTheme,

  diffEditor: {
    selectedLanguageId: 24, // 24 is the id of markdown
  },
};

export { initialState };
