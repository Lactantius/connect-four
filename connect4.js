/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

const wins = {
  player1: 0,
  player2: 0,
};

let board = makeBoard();

let currPlayer = 1; // active player: 1 or 2
// const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  return [...Array(HEIGHT)].map((row) => [...Array(WIDTH)].map((cell) => null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");

  // Make top row of the game board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Make cells for the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // Make other rows
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.prepend(row);
  }

  htmlBoard.prepend(top);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = 0; y < HEIGHT; y++) {
    if (!board[y][x]) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  piece.classList.add("piece", `player-${currPlayer}`);
  cell.append(piece);
}

/** endGame: announce game end and turn off event listener */

function endGame(msg) {
  document
    .querySelector("#column-top")
    .removeEventListener("click", handleClick);
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  console.log(y);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    updateScore(currPlayer);
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  freeColumns = [];
  for (let c = 0; c < WIDTH; c++) {
    freeColumns.push(findSpotForCol(c));
  }
  freeColumns.forEach((column) => {
    if (column) return true;
  });

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
}

/** updateScore(player): add one to winning player's score */

function updateScore(player) {
  wins[`player${player}`]++;
  document.querySelector(
    `#player-${player}-score`
  ).innerText = `Player ${player} Wins: ${wins["player" + player]}`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // For every coordinate, make four arrays of four coordinates
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
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

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// New Game button
document.querySelector("button").addEventListener("click", function () {
  clearHtmlBoard();
  board = makeBoard();
  currPlayer = 1;
});

function clearHtmlBoard() {
  document.querySelector("#board").replaceChildren("");
  makeHtmlBoard();
}

makeHtmlBoard();
