import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';

const pyodide = await loadPyodide();

onmessage = async (event) => {
  const data = event.data;
  if (data['type'] == 'push') {
    console.log('push');
    console.log(data);
    readJsInput(data.value);
    on_gameupdate(pyodide.globals.get('game_state'));
    console.log('message sent');
    console.log(pyodide.globals.get('game_state'));
  } else if (data['type'] == 'reset') {
    console.log('reset');
    console.log(data);
  }
};

function on_gameupdate(gameState) {
  postMessage({ type: 'gamestatus', body: JSON.parse(gameState) });
}

function on_gameover(str) {
  postMessage({ type: 'gameover', body: str });
}

function on_error(str) {
  postMessage({ type: 'error', body: str });
}

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
