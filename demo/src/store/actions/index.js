const setIsSettingsVisible = ({ state }, value) => {
      state.isSettingsVisible = value;
};


const setThemeMode = ({ state }, themeMode) => {
  state.themeMode = themeMode;
  localStorage.setItem('themeMode', themeMode); // Current solution is temporary
  // TODO: Design proper solution
  // to sync state (or a field of state) with localStorage
};

const setEditorMode = ({ state }, editorMode) => {
  state.editorMode = editorMode;
};

const showNotification = ({ state }, { message, variant = 'info', opt = {} }) => {
  console.log("Showing notification:", { message, variant, opt }); // Add this line
  state.notifications = {
    isActive: true,
    message,
    variant,
    opt,
  };
};

const hideNotification = ({ state }) => {
  state.notifications.isActive = false;
};

const setSelectedLanguageId = type => ({ state }, id) => {
  state[type].selectedLanguageId = id;
};

const editor = {
  setSelectedLanguageId: setSelectedLanguageId('editor'),
  setOptions({ state }, options) {
    state.editor.options = options;
  },
  setMonacoTheme({ state }, theme) {
    state.monacoTheme = theme;
  },
};

const diffEditor = {
  setSelectedLanguageId: setSelectedLanguageId('diffEditor'),
};

export const defineAndSetThemeBackground = async ({ state, actions, effects }, theme) => {
  const themeData = await effects.defineTheme(theme);
  actions.setThemeBackground(themeData.colors['editor.background']);
};

const setThemeBackground = ({ state }, color) => {
  state.themeBackground = color;
};

const setFontColor = ({ state }, color) => {
  state.fontColor = color;
};

function executeCode (code) {
 // we are provided with code value
  const inputData = { message: { code: code, input_values: null } }; // Prepare the request payload

  fetch("http://localhost:8000/courses/api/message/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputData),
  })
      .then(response => response.json())
      .then(data => console.log(data.message)); // Log the response message from Django
}

const setIsEditorReady = ({ state }, isReady) => {
  state.isEditorReady = isReady;
};

// ... (other actions remain the same)

const setEditorTab = ({ state }, tabIndex) => {
  console.log('setEditorTab action called with:', tabIndex);
  state.editorTab = tabIndex;
};

const setOpenedFile = ({ state }, file) => {
  console.log('setOpenedFile action called with:', file);
  state.openedFile = file;
};

const setNewCode = ({state}, code) => {
  state.newCode = code;
};

const setUiContext = ({state}, uiContext) => {
  state.uiContext = uiContext;  // This should be uiContext, not newCode
};

const setUser = ({ state }, user) => {
  state.user = user;
};

export {
  executeCode,
  hideNotification,
  setNewCode,
  setUiContext,
  setThemeMode,
  setEditorMode,
  setIsEditorReady,
  showNotification,
  setIsSettingsVisible,
  setFontColor,
  setThemeBackground,
  editor,
  diffEditor,
  setUser,
  setEditorTab,
  setOpenedFile  // Add this new action to the exports
};