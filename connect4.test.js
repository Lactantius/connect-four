const fullColBoard = [
  [1, null, null, null, null, null, null],
  [2, null, null, null, null, null, null],
  [1, null, null, null, null, null, null],
  [2, null, null, null, null, null, null],
  [1, null, null, null, null, null, null],
  [2, null, null, null, null, null, null],
];

describe("Board is generated", function () {
  it("should make an arry of arrays, with all elements null", function () {
    const testBoard = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ];
    expect(makeBoard(7, 6)).toEqual(testBoard);
  });
});

describe("handleClick(evt) updates board properly", function () {
  beforeEach(function () {
    gameState.board = makeBoard(7, 6);
    gameState.currentPlayer = 1;
  });
  it("should replace null values with player numbers", function () {
    gameState.board = makeBoard(7, 6);
    const updatedBoard = [
      [1, 2, null, null, null, null, null],
      [1, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ];

    document.getElementById(0).click();
    document.getElementById(1).click();
    document.getElementById(0).click();
    expect(gameState.board).toEqual(updatedBoard);
    // After
    clearHtmlBoard();
    gameState.board = makeBoard(7, 6);
  });

  it("should reject clicks that won't fit on the board", function () {
    gameState.currentPlayer = 1;
    gameState.board = makeBoard(7, 6);

    for (let y = 0; y < 6; y++) {
      document.getElementById(0).click();
      console.log(gameState.board);
    }

    document.getElementById(0).click();
    console.log(gameState.board[0]);
    expect(gameState.currentPlayer).toEqual(1);
    expect(gameState.board).toEqual(fullColBoard);
  });
});

describe("placeInHtmlBoard(y, x, player) changes values on the board", function () {
  it("should add player token", function () {
    const player = 1;
    clearHtmlBoard();
    placeInHtmlBoard(3, 4, player);
    expect(document.getElementById("3-4").children[0].className).toEqual(
      "piece player-1"
    );
  });
});

describe("findSpotForCol(x, boardHeight, gameState) returns first empty space on board", function () {
  it("should return 0 if column is empty", function () {
    gameState.board = makeBoard(7, 6);
    expect(findSpotForCol(2, 6, gameState.board)).toEqual(0);
  });
  it("should return null if column is full", function () {
    gameState.board = fullColBoard;
    expect(findSpotForCol(0, 6, gameState.board)).toEqual(null);
  });
});
