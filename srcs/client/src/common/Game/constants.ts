var game = document.getElementById('game');
//console.log(game);
let canvas;


if (game){
  canvas = { width: game.offsetWidth, height: 400 };
}
else{
canvas = { width: 600, height: 400 };
}
let paddle = {    width: 4,height: 60}
let gridSize = 80;
export const GameConstants = {
  // canvas: { width: 600, height: 400 },
  canvas: canvas,
  /* some extra variables */
  netWidth: 4,
  backColor: 0,
  //   netHeight : canvas.height,
  borderWidth:canvas.width/60,
  paddleWidth: 10,
  paddleHeight: 100,
  upArrowPressed: false,
  downArrowPressed: false,

  /* some extra variables ends */

  /* objects */
  // net
  paddle: {
    // x: canvas.width / 2 - netWidth / 2,
    width: paddle.width,
    height: paddle.height,
    x: canvas.width - paddle.width,
    y: canvas.height / 2 - paddle.height/2,
    color: "#FFF",
  },

  // user paddle
  user: {
    x: 10,
    // y: canvas.height / 2 - paddleHeight / 2,
    // width: paddleWidth,
    // height: paddleHeight,
    color: "#FFF",
    score: 0,
  },

  //   ai :{
  //     x: canvas.width - (paddleWidth + 10),
  //     y: canvas.height / 2 - paddleHeight / 2,
  //     width: paddleWidth,
  //     height: paddleHeight,
  //     color: "#FFF",
  //     score: 0,
  //   },

  // ball
  ball: {
    // x: 400 / 2, // todo
    x: canvas.width / 2,
    y: canvas.height / 2,
    // y: 400 / 2,
    radius: canvas.width/gridSize,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: "#05EDFF",
  },

  /* objects declaration ends */

  /* drawing functions */
  /* drawing functions end */
};

// console.log(Constants.netWidth)
// export class constants;
