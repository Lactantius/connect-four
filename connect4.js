/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

const gameState = {
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
  top.addEventListener("click", function (evt) {
    handleClick(evt, gameState);
  });

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

function findSpotForCol(x, boardHeight, gameState) {
  for (let y = 0; y < boardHeight; y++) {
    if (!gameState.board[y][x]) return y;
  }
  return null;
}

/** placeInHtmlBoard: update DOM to place piece into HTML table of board */

function placeInHtmlBoard(y, x, gameState) {
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  piece.classList.add("piece", `player-${gameState.currentPlayer}`);
  cell.append(piece);
}

function placeInLogicalBoard(y, x, gameState) {
  gameState.board[y][x] = gameState.currentPlayer;
}

/** endGame: announce game end and turn off event listener */

function endGame(msg) {
  document.querySelector("#column-top");
  // .removeEventListener("click", handleClick);
  alert(msg);
  gameState.finished = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt, gameState) {
  if (gameState.finished) return;
  const height = gameState.board.length;

  // get x from ID of clicked cell
  const x = Number(evt.target.id);

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x, height, gameState);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInLogicalBoard(y, x, gameState);
  placeInHtmlBoard(y, x, gameState);

  // check for win
  if (checkForWin(gameState)) {
    updateScore(gameState.currentPlayer);
    return endGame(`Player ${gameState.currentPlayer} won!`);
  }

  // check for tie
  if (checkForTie(gameState)) {
    return endGame(`You tied!`);
  }

  // switch players
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
}

/** checkForTie checks if the board is full */

function checkForTie(gameState) {
  return gameState.board.every((row) => row.every((cell) => cell));
}

/** updateScore(player): add one to winning player's score */

function updateScore(player) {
  wins[`player${player}`]++;
  document.querySelector(
    `#player-${player}-score`
  ).innerText = `Player ${player} Wins: ${wins["player" + player]}`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(gameState) {
  const height = gameState.board.length;
  const width = gameState.board[0].length;

  function _win(cells, gameState) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        gameState.board[y][x] === gameState.currentPlayer
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
        _win(horiz, gameState) ||
        _win(vert, gameState) ||
        _win(diagDR, gameState) ||
        _win(diagDL, gameState)
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
