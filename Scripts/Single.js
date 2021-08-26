/* DOM VARIABLES */
let buttonContainer = document.getElementById(`buttons`);
let playButton = document.getElementById(`playButton`);
let resetButton = document.getElementById(`resetButton`);
let statusArea = document.getElementById(`statusArea`);
let timeStatus = document.getElementById(`time`);
/* Turn the block grid into a html collection */
let blockCollection = document.querySelectorAll(`.blocks`);
/* Turn the html collection into an array */
let blockArr = [].slice.call(blockCollection);

/* global variables */
let seconds = 0;

/* whenever a block is clicked it will add the corresponding symbol to this array */
blockState = [``, ``, ``, ``, ``, ``, ``, ``, ``];
let gameOver = false;
let drawOver = false;
let pcWon = false;
/* set up a lookup array with all the possible winning sequences in ti */
let winCons = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [1, 4, 7],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6],
];

function resultValidation() {
  /* use a foreach to itterate over each individual winning sequence */
  winCons.forEach((con) => {
    /* set up 3 vars that look at the blockState array */
    /* each item will be assaigned the value of the coresponding grid block */
    let itemOne = blockState[[con[0]]];
    let itemTwo = blockState[[con[1]]];
    let itemThree = blockState[[con[2]]];
    /* if any of the combonations contains an empty box it returns and goes to the next item in the winCons array */
    if (itemOne === `` || itemTwo === `` || itemThree === ``) {
      return;
      /* if all three items are equal to eachother then a player has won and the global variable used to check the ending of the game is changed to true  */
    } else if (
      //since the player is always X, can specify what to do when they win
      itemOne === `X` &&
      itemTwo === "X" &&
      itemThree === "X"
    ) {
      gameOver = true;
      return
    } else if (
      //since the PC is always player O, do somthing different when they win
      itemOne === `O` &&
      itemOne === `O` &&
      itemTwo === `O`
    ) {
      console.log(`pc wins`)
      pcWon = true;
      return
    } else if (!blockState.includes(``)) {
      drawOver = true;
      return
    }
  });
}

function gameTime() {
  timeId = setInterval(tick, 1000);

  function tick() {
    seconds++;
    timeStatus.textContent = `${seconds} seconds`;
  }
}
//function for the PC's move
function computerMove() {
  //dont let the pc move if the game is over
  if (gameOver === true) {
    return;
  }
 
  let filteredMoves = blockArr.filter(
    (move) => !move.hasAttribute(`clicked`)
  );
  console.log(`The following is filtered moves:`);
  console.log(filteredMoves);
  if (filteredMoves.length === 0) {
    return;
  }
  let pcMove = filteredMoves[Math.floor(Math.random() * filteredMoves.length)];
  pcMove.setAttribute(`clicked`, true);
  console.log(pcMove);
  /* Puts tan O into the clicked block.*/
  let newContent = document.createTextNode(`O`);
  pcMove.appendChild(newContent);
  /* adds the same symbol to the blank array that the result Validation function uses to check if the game is over */
  let blockIndex = parseInt(pcMove.getAttribute(`number`));
  blockState[blockIndex] = `O`;
}

/* event listener for the play button */
playButton.addEventListener(`click`, (evt) => {
  /* when clicked set is disables itself and enables the reset button */
  resetButton.disabled = false;
  playButton.disabled = true;
  statusArea.textContent = `It is Your Turn`;
  /* adds an event listener to each grid block, meaning you cant click them before pressing play  */
  blockArr.forEach((block) => {
    /* gives each block its own event listener that runs the clickBlock function when clicked */
    block.addEventListener(`click`, clickBlock);
  });
  /* start the timer */
  gameTime();
});
/* event listener for the reset button */
resetButton.addEventListener(`click`, (evt) => {
  /* button was staying enabled upon refresh so I added this line to prevent that. Dont exactly know why */
  resetButton.disabled = true;
  /* refreshes the page when the button is clicked, returning everything to a clean slate */
  location.reload();
});

/* REDONE CLICKBLOCK FUNCTION FOR SINGLE PLAYER */

function clickBlock(evt) {
  let playerMove = evt.target;
  /* first checks if the block has been disabled because the game is over */
  if (evt.target.hasAttribute(`disabled`) === true) {
    return;
  }
  if (evt.target.hasAttribute(`clicked`) === false) {
    evt.target.setAttribute(`clicked`, `true`);
  } else if (evt.target.hasAttribute(`clicked`) === true) {
    /* if it has been clicked inform the player that they need to click somthing else */
    statusArea.textContent = `Please select an empty cell`;
    return;
  }
  let newContent = document.createTextNode(`X`);
  evt.target.appendChild(newContent);
  /* adds the same symbol to the blank array that the result Validation function uses to check if the game is over */
  let blockIndex = parseInt(evt.target.getAttribute(`number`));
  blockState[blockIndex] = `X`;

  computerMove();
  resultValidation();
  if (drawOver === true && gameOver === false) {
    statusArea.textContent = `Its a Draw!`;
    clearInterval(timeId);
    blockArr.forEach((block) => {
      block.setAttribute(`disabled`, `true`);
    });
  } else if (gameOver === true && evt.target.textContent === `X`) {
    statusArea.textContent = `Congratulations You Win!`;
    /* clear the timer */
    clearInterval(timeId);
    blockArr.forEach((block) => {
      block.setAttribute(`disabled`, `true`);
    });
  } else if (pcWon === true) {
    statusArea.textContent = `Sorry Player, the PC wins!`;
    clearInterval(timeId);
    blockArr.forEach((block) => {
      block.setAttribute(`disabled`, `true`);
    });
  }
}
