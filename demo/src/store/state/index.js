import config from 'config';

const initalTheme = 'dark';

const initialState = {

  themeMode: initalTheme,
  isSettingsVisible: false,
  isSideBarVisible: true,
  isEditorReady: false,

  notifications: config.notifications.defaultState,

  editor: {
    selectedLanguageId: 19, // 19 is the id of javasctipt
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
      stickyScroll: { enabled: false },
      mouseWheelZoom: true,
      multiCursorMergeOverlapping: true,
      multiCursorModifier: 'alt',
      overviewRulerBorder: true,
      overviewRulerLanes: 2,
      provideInlayHints: true,
      quickSuggestions: true,
      quickSuggestionsDelay: 200,
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
      scrollBeyondLastLine: false,
      selectOnLineNumbers: true,
      selectionClipboard: true,
      selectionHighlight: true,
      showFoldingControls: 'mouseover',
      smoothScrolling: false,
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: false,
      // eslint-disable-next-line
      wordSeparators: `~!@#$%^&*()-=+[{]}\|;:'",.<>/?`,
      wordWrap: 'on',
      wordWrapBreakAfterCharacters: '\t})]?|&,;',
      wordWrapBreakBeforeCharacters: '{([+',
      wordWrapBreakObtrusiveCharacters: '.',
      wordWrapColumn: 80,
      wordWrapMinified: true,
      wrappingIndent: 'none',
    },
  },

  editorMode: 'editor',
  editorTab: 0,
  themeBackground: '#1E1E1E',
  fontColor: '#EDECE4',
  newCode: '',
  uiContext: {
    screenshot: null
  },
  ai_editorValue: '',
  monacoTheme: initalTheme === 'dark' ? 'vs-dark' : initalTheme,

  user: null,

  diffEditor: {
    selectedLanguageId: 24, // 24 is the id of markdown
  },
};


export { initialState };
