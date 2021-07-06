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

/* GLOBAL VARs */
let seconds = 0;
let currentTurn = `O`;
statusArea.textContent = `Press start to begin the game!`;
//set up a black array to check for wincons
/* whenever a block is clicked it will add the corresponding symbol to this array */
blockState = [``, ``, ``, ``, ``, ``, ``, ``, ``];
let gameOver = false;
let drawOver = false;
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

//function to check for win
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
    } else if (itemOne === itemTwo && itemTwo === itemThree) {
      gameOver = true;
      return;
    }
/* check for a draw */
    if (!blockState.includes(``) && gameOver === false) {
      drawOver = true;
    }
  });
}
/* function for the game timer */
function gameTime() {
  timeId = setInterval(tick, 1000);

  function tick() {
    seconds++;
    timeStatus.textContent = `${seconds} seconds`;
  }
}

/* event listener for the play button */
playButton.addEventListener(`click`, (evt) => {
  /* when clicked set is disables itself and enables the reset button */
  resetButton.disabled = false;
  playButton.disabled = true;
  /* sets the status area to display the current turn . The first time is hard coded to be X because of how I set up the clickBlock function*/
  statusArea.textContent = `It is Player X's Turn`;
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

/* callback function that is called when a block is clicked. */
function clickBlock(evt) {
  /* first checks if the block has been disabled because the game is over */
  if (evt.target.hasAttribute(`disabled`) === true) {
    return;
  }
  /* then checkes if the block has already been blicked */
  if (evt.target.hasAttribute(`clicked`) === false) {
    evt.target.setAttribute(`clicked`, `true`);
  } else if (evt.target.hasAttribute(`clicked`) === true) {
    /* if it has been clicked inform the player that they need to click somthing else */
    statusArea.textContent = `Please select an empty cell`;
    return;
  }
  /* Updates the status area to display the correct info about which turn it is */
  statusArea.textContent = `It is Player ${currentTurn}'s Turn`;
  /* changes the current turn var to the opposite player. */
  if (currentTurn === `X`) {
    currentTurn = `O`;
  } else if (currentTurn === `O`) {
    currentTurn = `X`;
  }
  /* Puts the value of the current turn into the clicked block. Because of how I set it up the current turn must start on O to have an X come out first */
  let newContent = document.createTextNode(`${currentTurn}`);
  evt.target.appendChild(newContent);
  /* adds the same symbol to the blank array that the result Validation function uses to check if the game is over */
  let blockIndex = parseInt(evt.target.getAttribute(`number`));
  blockState[blockIndex] = `${currentTurn}`;
  /* runs a function to check if the game is over */
  resultValidation();
  /* if the game is over set up a message and disable all the blocks they cant be clicked */
  //if the game is a draw, say so
  if (drawOver === true && gameOver === false) {
    statusArea.textContent = `Its a Draw!`;
    clearInterval(timeId);
    blockArr.forEach((block) => {
      block.setAttribute(`disabled`, `true`);
    });
  } else if (gameOver === true) {
    statusArea.textContent = `Congratulations Player ${currentTurn} wins!`;
    /* clear the timer */
    clearInterval(timeId);
    blockArr.forEach((block) => {
      block.setAttribute(`disabled`, `true`);
    });
  }
}

