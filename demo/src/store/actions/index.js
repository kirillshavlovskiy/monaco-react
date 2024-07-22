const setIsEditorReady = ({ state }, isReady) => {
  state.isEditorReady = isReady;
};

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
  state.notifications = {
    isActive: true,
    message,
    variant,
    opt,
  }; // now designed for only one message
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
const setNewCode = ({state}, code) => {  // <-- Add setNewCode action for updating newCode in state
  state.newCode = code;
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

export {
  executeCode,
  hideNotification,
  setNewCode,
  setThemeMode,
  setEditorMode,
  setIsEditorReady,
  showNotification,
  setIsSettingsVisible,
  setFontColor,
  setThemeBackground,
  editor,
  diffEditor,
};
