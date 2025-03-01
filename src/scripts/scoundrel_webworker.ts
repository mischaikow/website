import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';

const pyodide = await loadPyodide();

onmessage = async (event) => {
  const data = event.data;
  if (data['type'] == 'push') {
    console.log('push');
    readJsInput(data.value);
  } else if (data['type'] == 'reset') {
    console.log('reset');
    readJsInput('reset');
  }

  console.log(data);
  processGameState(pyodide.globals.get('game_state'));
};

const processGameState = (gameState) => {
  if (gameState.is_victory) {
    on_gamewon(gameState);
  } else if (gameState.is_defeat) {
    on_gamelost(gameState);
  } else {
    on_gameupdate(gameState);
  }
  console.log('message sent');
  console.log(pyodide.globals.get('game_state'));
};

const on_gameupdate = (gameState) => {
  postMessage({ type: 'gamestatus', body: JSON.parse(gameState) });
};

const on_gamewon = (str) => {
  postMessage({ type: 'gamewon', body: str });
};

const on_gamelost = (str) => {
  postMessage({ type: 'gamelost', body: str });
};

const on_error = (str) => {
  postMessage({ type: 'error', body: str });
};

const relative_url = '../assets/scoundrel_game.py';
async function loadPythonFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(error.message);
  }
}

const pythonCode = await loadPythonFile(relative_url);
pyodide.runPython(pythonCode);

on_gameupdate(pyodide.globals.get('game_state'));
const readJsInput = pyodide.globals.get('read_js_input');
