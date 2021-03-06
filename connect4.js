/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let gameState = {
  board: makeBoard(WIDTH, HEIGHT),
  currentPlayer: 1,
  finished: false,
};

const wins = {
  player1: 0,
  player2: 0,
};

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(width, height) {
  return [...Array(height)].map((row) => [...Array(width)].map((cell) => null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard(width, height) {
  const htmlBoard = document.querySelector("#board");

  // Make top row of the game board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // top.addEventListener("click", handleClick.bind(null, gameState));
  top.addEventListener("click", (evt) => handleClick(evt));

  // Make cells for the top row
  for (let x = 0; x < width; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // Make other rows
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.prepend(row);
  }

  htmlBoard.prepend(top);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x, boardHeight, boardState) {
  for (let y = 0; y < boardHeight; y++) {
    if (!boardState[y][x]) return y;
  }
  return null;
}

/** placeInHtmlBoard: update DOM to place piece into HTML table of board */

function placeInHtmlBoard(y, x, player) {
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  piece.classList.add("piece", `player-${player}`);
  cell.append(piece);
}

function placeInLogicalBoard(y, x, board, player) {
  board[y][x] = player;
}

/** endGame: announce game end and turn off event listener */

const overlay = document.getElementById("end-game-overlay");
overlay.addEventListener("click", function () {
  overlay.style.display = "none";
});

function endGame(msg) {
  overlay.style.display = "grid";
  overlay.style.justifyContent = "center";
  overlay.style.alignContent = "center";
  overlay.querySelector("span").innerText = msg;
  // alert(msg);
  gameState.finished = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameState.finished) return;
  const boardState = gameState.board.map((row) => row.slice());
  const currentPlayer = gameState.currentPlayer;
  const height = boardState.length;

  // get x from ID of clicked cell
  const x = Number(evt.target.id);

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x, height, boardState);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInLogicalBoard(y, x, boardState, currentPlayer);
  placeInHtmlBoard(y, x, currentPlayer);

  // check for win
  if (checkForWin(boardState, currentPlayer)) {
    updateScore(currentPlayer);
    return endGame(`Player ${currentPlayer} won!`);
  }

  // check for tie
  if (checkForTie(boardState)) {
    return endGame(`You tied!`);
  }

  // Update state
  gameState = {
    board: boardState.map((row) => row.slice()),
    currentPlayer: currentPlayer === 1 ? 2 : 1,
    finished: false,
  };
}

/** checkForTie checks if the board is full */

function checkForTie(board) {
  return board.every((row) => row.every((cell) => cell));
}

/** updateScore(player): add one to winning player's score */

function updateScore(player) {
  wins[`player${player}`]++;
  document.querySelector(
    `#player-${player}-score`
  ).innerText = `Player ${player} Wins: ${wins["player" + player]}`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(board, player) {
  const height = board.length;
  const width = board[0].length;

  function _win(cells, board) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 && y < height && x >= 0 && x < width && board[y][x] === player
    );
  }

  // For every coordinate, make four arrays of four coordinates
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Original coordinate + 3 to the right
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // Original coordinate + 3 below
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // Original coordinate + diagonal up right
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // Original coordinate + diagonal up left
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (
        _win(horiz, board, player) ||
        _win(vert, board, player) ||
        _win(diagDR, board, player) ||
        _win(diagDL, board, player)
      ) {
        return true;
      }
    }
  }
}

// New Game button
document.querySelector("button").addEventListener("click", function () {
  clearHtmlBoard();
  gameState.board = makeBoard(WIDTH, HEIGHT);
  gameState.currentPlayer = 1;
  gameState.finished = false;
});

function clearHtmlBoard() {
  document.querySelector("#board").replaceChildren("");
  makeHtmlBoard(WIDTH, HEIGHT);
}

makeHtmlBoard(WIDTH, HEIGHT);
