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
    expect(makeBoard()).toEqual(testBoard);
  });
});

describe("handleClick(evt) updates board properly", function () {
  beforeEach(function () {
    board = makeBoard();
    currPlayer = 1;
  });
  it("should replace null values with player numbers", function () {
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
    expect(board).toEqual(updatedBoard);
  });

  it("should reject clicks that won't fit on the board", function () {
    const fullColBoard = [
      [1, null, null, null, null, null, null],
      [2, null, null, null, null, null, null],
      [1, null, null, null, null, null, null],
      [2, null, null, null, null, null, null],
      [1, null, null, null, null, null, null],
      [2, null, null, null, null, null, null],
    ];

    for (let y = 0; y < HEIGHT; y++) {
      document.getElementById(0).click();
    }

    const player = currPlayer;
    document.getElementById(0).click();
    expect(currPlayer).toEqual(player);
    expect(board).toEqual(fullColBoard);
  });
  afterEach(function () {
    board = makeBoard();
    currPlayer = 1;
    clearHtmlBoard();
  });
});
