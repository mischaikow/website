import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.mjs';

interface GameState {
  room: number;
  board: Array<string>;
  weapon: number;
  weapon_chain: Array<number>;
  health: number;
  cards_played: object;
  skipped_last_room: boolean;
  is_victory: boolean;
  is_defeat: boolean;
}

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
  processGameState(JSON.parse(pyodide.globals.get('game_state')));
};

const processGameState = (gameState: GameState) => {
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

const on_gameupdate = (gameState: GameState) => {
  postMessage({ type: 'gamestatus', body: gameState });
};

const on_gamewon = (gameState: GameState) => {
  postMessage({ type: 'gamewon', body: gameState });
};

const on_gamelost = (gameState: GameState) => {
  postMessage({ type: 'gamelost', body: gameState });
};

const relative_url = '../assets/scoundrel_game.py';
async function loadPythonFile(url: string) {
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

on_gameupdate(JSON.parse(pyodide.globals.get('game_state')));
const readJsInput = pyodide.globals.get('read_js_input');
