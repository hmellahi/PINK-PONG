<template>
  <div id="game" ref="game" class="h-100">
    <div v-if="!isLoading">
      <img :src="player2.avatar_url" alt="" class="player_left" />
      <img :src="player1.avatar_url" alt="" class="player_right" />
      <P5 v-on="{ setup }" />
    </div>
    <div v-else>Loading....</div>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import sound from "../../../../public/assets/sounds/wallHitSound.wav";
import sound2 from "../../../../public/assets/sounds/scoreSound.wav";
import sound3 from "../../../../public/assets/sounds/mario_coin.mp3";
// import sound1 from '../../../../public/assets/sounds/wallHitSound.wav'
import sound4 from "../../../../public/assets/sounds/Clairo.mp3";
=======
// declare module '*.mp3';
// declare module '*.wav';


// import sound from '../../../../public/assets/sounds/wallHitSound.wav'
// import sound2 from '../../../../public/assets/sounds/scoreSound.wav'
// import sound3 from '../../../../public/assets/sounds/mario_coin.mp3'
// // import sound1 from '../../../../public/assets/sounds/wallHitSound.wav'
// import sound4 from '../../../../public/assets/sounds/Clairo.mp3'
// import sound5 from '../../../../public/assets/sounds/ball-bounce.mp3'
// import sound6 from '../../../../public/assets/sounds/golf-ball-hit.wav'


>>>>>>> 35861e6c6b11290e4b251ae774d8694bee99eeba

import { GameConstants } from "../../Game/constants";
import Ball from "../../Game/Objects/Ball";
// import require from "http";
import Net from "../../Game/Objects/Net";
import BackGround from "../../Game/Objects/BackGround";
import { io } from "socket.io-client";

import { Component, Vue } from "vue-property-decorator";
import P5, {
  P5Element,
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import Paddle from "@/common/Game/Objects/Paddle";
import Score from "@/common/Game/Objects/Score";

const MAX_SCORE = 2;
const COUNTDOWN = 3;

@Component<Game>({
  components: { P5 },
  async beforeRouteLeave(to, from, next) {
    // prompt("hey")

    // console.log("beforeRouteLeave", to.path, from.path);
    // this.isMusicOn = false;
    // this.isSoundOn = false;
    this.Clairo.pause();
    await this.leaveGame();
    next();
  },
})
export default class Game extends Vue {
  intervals: Array<any> = [];
  frames = 0;
  player1: any = [];
  player2: any = [];
  // ({ canvas, backColor } = GameConstants)
  // canvasWidth:
  backColor: number = GameConstants.backColor;
  // xBall: number = Math.floor(Math.random() * 300) + GameConstants.ball.x;
  xBall: number = GameConstants.canvas.width / 2;
  yBall: number = GameConstants.canvas.height / 2; //TODO add randomness
  radius: number = 10;
  sounds: Array<any> = [];
  ball: Ball = new Ball(this.xBall, this.yBall, this.radius, 0);
  isGameOver: boolean = false;
  xPaddle = GameConstants.paddle.x;
  yPaddle = GameConstants.paddle.y;
  sketch: P5Sketch = null;
  paddleWidth = GameConstants.paddle.width;
  paddleHeight = GameConstants.paddle.height;
  paddle: Paddle = new Paddle(
    GameConstants.canvas.width - this.paddleWidth - 20,
    this.yPaddle,
    this.paddleWidth,
    this.paddleHeight
  );
  paddle2: Paddle = new Paddle(
    20,
    this.yPaddle,
    this.paddleWidth,
    this.paddleHeight
  );
  map: number = 0;
  net: Net = new Net(
    GameConstants.canvas.width,
    GameConstants.canvas.height,
    this.map
  );
  isMusicOn = false;
  isSoundOn = false;
  worker: any;
  background: BackGround = new BackGround();

  score: Score = new Score(GameConstants.canvas.width / 4 - 60, 30, 0);
  score2: Score = new Score(
    GameConstants.canvas.width - GameConstants.canvas.width / 4,
    30,
    0
  );
  countdown: Score = new Score(
    GameConstants.canvas.width / 2 - 15,
    GameConstants.canvas.height / 2 - 25
  );
  scores: Score[] = [this.score, this.score2];
  roomId: any = "";
  gameData: any = {};
  isLoading: boolean = true;
  hitSound: any;
  wallHitSound: any;
  scoreSound: any;
  marioCoin: any;
  Clairo: any;
  ballBounce: any;
  ballHit: any;

  init() {
    // console.log("setup");
    // var game = document.getElementById("game");
    var game: any = this.$refs.game;

    if (game) {
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
      // console.log(game.offsetWidth, game.offsetHeight);
      // GameConstants.canvas.width = 400;
      // GameConstants.canvas.height = 400;
    }
    this.backColor = GameConstants.backColor;
    this.xBall = GameConstants.canvas.width / 2;
    this.yBall = GameConstants.canvas.height / 2;
    this.radius = 10;
    this.sounds = [];
    this.ball = new Ball(this.xBall, this.yBall, this.radius, 0);
    this.isGameOver = false;
    this.xPaddle = GameConstants.paddle.x;
    this.yPaddle = GameConstants.paddle.y;
    this.paddleWidth = GameConstants.paddle.width;
    this.paddleHeight = GameConstants.paddle.height;
    this.paddle = new Paddle(
      GameConstants.canvas.width - this.paddleWidth - 20,
      this.yPaddle,
      this.paddleWidth,
      this.paddleHeight
    );
    this.paddle2 = new Paddle(
      20,
      this.yPaddle,
      this.paddleWidth,
      this.paddleHeight
    );

    this.net = new Net(
      GameConstants.canvas.width,
      GameConstants.canvas.height,
      this.map
    );
    this.background = new BackGround();

    this.score = new Score(GameConstants.canvas.width / 4 - 60, 30);
    this.score2 = new Score(
      GameConstants.canvas.width - GameConstants.canvas.width / 4,
      30,
      0
    );
    this.countdown = new Score(
      GameConstants.canvas.width / 2 - 15,
      GameConstants.canvas.height / 2 - 25
    );
    this.scores = [this.score, this.score2];
    this.roomId = "";
  }
  resizeObjects() {
    // console.log("setup");

    // console.log(`before ball speed ${this.ball.speed}`);
    // console.log(`before ball VeloX ${this.ball.velocityX} and VeloY ${this.ball.velocityY}`);
    // console.log(`before ball X ${this.ball.x} and Y ${this.ball.y}`);

    var xF = this.ball.x / GameConstants.canvas.width;
    var yF = this.ball.y / GameConstants.canvas.height;
    console.log(`ball factors X ${xF} and Y ${yF}`);

    var game: any = this.$refs.game;
    var rx = GameConstants.canvas.width / 10;
    var ry = GameConstants.canvas.height / 10;

    // var ratiox:boolean = Math.abs(game.offsetWidth - GameConstants.canvas.width) > rx;
    // var ratioy:boolean = Math.abs(game.offsetHeight - GameConstants.canvas.height) > ry;

    if (game) {
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
      // console.log(`the id height>> ${game.offsetHeight}`);
      // console.log(`the id width>> ${game.offsetWidth}`);
    }
    this.radius = 10;
    this.ball = new Ball(
      xF * GameConstants.canvas.width,
      yF * GameConstants.canvas.height,
      this.radius,
      0
    );
    // this.ball = new Ball(GameConstants.canvas.width/2, GameConstants.canvas.height/2, this.radius, 0);

    // console.log(`after ball speed ${this.ball.speed}`);
    // console.log(`after ball VeloX ${this.ball.velocityX} and VeloY ${this.ball.velocityY}`);
    // console.log(`after ball X ${this.ball.x} and Y ${this.ball.y}`);
    this.isGameOver = false;
    this.paddleWidth = GameConstants.paddle.width;
    this.paddleHeight = GameConstants.paddle.height;
    this.paddle = new Paddle(
      GameConstants.canvas.width - this.paddleWidth - 20,
      this.paddle.y,
      this.paddleWidth,
      this.paddleHeight
    );
    this.paddle2 = new Paddle(
      20,
      this.paddle2.y,
      this.paddleWidth,
      this.paddleHeight
    );

    this.net = new Net(
      GameConstants.canvas.width,
      GameConstants.canvas.height,
      this.net.map
    );
    this.background = new BackGround();

    this.score = new Score(
      GameConstants.canvas.width / 4 - 60,
      30,
      this.score.value
    );
    this.score2 = new Score(
      GameConstants.canvas.width - GameConstants.canvas.width / 4,
      30,
      this.score2.value
    );
    this.countdown = new Score(
      GameConstants.canvas.width / 2 - 15,
      GameConstants.canvas.height / 2 - 25,
      this.countdown.value
    );
    this.scores = [this.score, this.score2];
  }

  resizeObjectsOpt() {
    var xF = this.ball.x / GameConstants.canvas.width;
    var yF = this.ball.y / GameConstants.canvas.height;
    var game: any = this.$refs.game;
    var rx = GameConstants.canvas.width / 10;
    var ry = GameConstants.canvas.height / 10;
    if (game) {
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
    }
    this.radius = 10;
    this.ball.x = xF * GameConstants.canvas.width;
    this.ball.y = yF * GameConstants.canvas.height;
    this.isGameOver = false;
    this.paddleWidth = GameConstants.paddle.width;
    this.paddleHeight = GameConstants.paddle.height;
    this.paddle.x = GameConstants.canvas.width - this.paddleWidth - 20;
    this.paddle.y = this.paddle.y;
    this.paddle2.x = 20;
    this.paddle2.y = this.paddle2.y;
    this.net.width = GameConstants.canvas.width;
    this.net.height = GameConstants.canvas.height;

    this.score.x = GameConstants.canvas.width / 4 - 60;
    this.score.y = 30;
    this.score2.x = GameConstants.canvas.width - GameConstants.canvas.width / 4;
    this.score2.y = 30;
    this.scores = [this.score, this.score2];
  }

  async mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("resize", this.resize);
    this.init();
    this.roomId = this.$route.query.id;
<<<<<<< HEAD
    // this.hitSound = new Audio("sounds/hitSound.wav");
    // this.wallHitSound = new Audio("sounds/wallHitSound.wav");
    this.wallHitSound = new Audio(sound);

    this.scoreSound = new Audio(sound2);
    this.marioCoin = new Audio(sound3);
    this.Clairo = new Audio(sound4);
    // this.Clairo.play();
=======
var sound = '/assets/sounds/wallHitSound.wav';
var sound2 = '/assets/sounds/scoreSound.wav';
var sound3 = '/assets/sounds/mario_coin.mp3';
var sound4 = '/assets/sounds/Clairo.mp3';
var sound5 = 'assets/sounds/ball-bounce.mp3';
var sound6 = 'assets/sounds/golf-ball-hit.wav';
var sound7 = 'assets/sounds/TunePocket-Ping-Pong-Ball-Bouce-Hit-Preview.mp3';
var sound8 = 'assets/sounds/alex-productions-epic-cinematic-gaming-cyberpunk-reset.mp3';

    this.wallHitSound = await new Audio(sound);
    this.scoreSound = await new Audio(sound2);
    this.marioCoin = await new Audio(sound3);
    this.Clairo = await new Audio(sound8);
    this.ballBounce = await new Audio(sound5);
    this.ballHit = await new Audio(sound7);


// this.Clairo.play();
>>>>>>> 35861e6c6b11290e4b251ae774d8694bee99eeba
    // this.Clairo = new Audio("sounds/Clairo - Sofia-L9l8zCOwEII.mp3");
    // this.marioCoin.play();
    this.listenToGameEvents();
    //  if(typeof(Worker) !== "undefined") {
    if (localStorage[this.currentUser.id + "#settings#0"]) {
      this.isMusicOn = localStorage[this.currentUser.id + "#settings#0"] === "true";
    }
    if (localStorage[this.currentUser.id + "#settings#1"]) {
      this.isSoundOn = localStorage[this.currentUser.id + "#settings#1"] === "true";
    }
    console.log({ isSoundOn: this.isSoundOn, isMusicOn: this.isMusicOn });
    // here do ur shit...
<<<<<<< HEAD
    if (this.isMusicOn) {
      this.marioCoin.play();
=======
    if (this.isMusicOn){
      // this.marioCoin.play();
      this.Clairo.play();
>>>>>>> 35861e6c6b11290e4b251ae774d8694bee99eeba
    }
  }
  async fetchUser(id: Number) {
    try {
      const player = await this.$http.get(`users?id=${id}`);
      return player;
    } catch (error) {
      return;
    }
  }
  get socket() {
    return this.$store.state.User.gameSocket;
  }
  async listenToGameEvents() {
    this.socket.on("connect", function () {
      // console.log("yes sir")
    });

    this.socket.on("paddleMoves", (data: any) => {
      // console.table({"recieved": data});
      let { paddle: enemyPaddle, isPlayer1, canvas } = data;
      enemyPaddle.y =
        (enemyPaddle.y / canvas.height) * GameConstants.canvas.height;
      if (isPlayer1) {
        this.paddle.y = enemyPaddle.y;
        this.paddle.velocity = enemyPaddle.velocity;
      } else {
        this.paddle2.y = enemyPaddle.y;
        this.paddle2.velocity = enemyPaddle.velocity;
      }
    });

    this.socket.on("disconnect", function () {
      console.log("Connection Failed");
    });

    this.socket.on("gameOver", (ff: any) => {
      // this.scores[ballHitsBorder - 1].value++;
      this.isGameOver = true;
      this.intervals.map((interval) => {
        clearInterval(interval);
      });
      // if (ff != 0){

      // }
      this.over(ff);
    });

    this.socket.on("hehe", () => {
      this.socket.emit(
        "joinGame",
        { roomId: this.roomId },
        async ({ err }: any) => {
          // console.log("msg", { msg });

          if (err) {
            this.$notify({
              duration: -1,
              type: "danger",
              title: err,
            });
            this.$router.push({ path: "/" });
            return;
          }
          let { gameData, currentGameState } = msg;
          this.gameData = gameData;
          this.net.map = this.gameData.map;
          console.log({ isplayer1: this.gameData });

          // if (!this.gameData.isPlayer1) {
          //   let tmp: Paddle = this.paddle;
          //   this.paddle = this.paddle2;
          //   this.paddle2 = tmp;
          //   console.log("player1");
          // }

          const player1 = (await this.fetchUser(gameData.player1)) as
            | any
            | undefined;
          const player2 = (await this.fetchUser(gameData.player2)) as
            | any
            | undefined;
          this.player1 = player1.data;
          this.player2 = player2.data;
          if (!this.gameData.isSpectator) {
            this.isLoading = false;
            return;
          }
          // score
          this.scores[0].value = currentGameState.score1;
          this.scores[1].value = currentGameState.score2;
          // ball
          let { ball, canvas, paddles } = currentGameState;
          this.ball.x = (ball.x / canvas.width) * GameConstants.canvas.width;
          this.ball.y = (ball.y / canvas.height) * GameConstants.canvas.height;
          // paddles
          this.paddle2.y =
            (paddles[1].y / canvas.height) * GameConstants.canvas.height;
          this.paddle2.velocity = paddles[1].velocity;
          this.paddle.y =
            (paddles[0].y / canvas.height) * GameConstants.canvas.height;
          this.paddle.velocity = paddles[0].velocity;

          this.isLoading = false;
        }
      );
    });

    this.socket.on("ballMoves", (data: any) => {
      if (this.gameData.isPlayer1) return;
      let { ball, canvas } = data;
      this.ball.x = (ball.x / canvas.width) * GameConstants.canvas.width;
      this.ball.y = (ball.y / canvas.height) * GameConstants.canvas.height;
    });

    this.socket.on("incrementScore", (ballHitsBorder: number) => {
      this.scores[ballHitsBorder - 1].value++;
      // console.log(this.scores[ballHitsBorder - 1].value);
    });
  }
  over(ff: number) {
    this.showGameOver(this.sketch);
    // TODO show to the player the he won because the other player quits
    if (this.gameData.isSpectator) return;
    console.log({ score1: this.scores[0].value });
    console.log({ score2: this.scores[1].value });
    if (
      ff ||
      (this.scores[1].value > this.scores[0].value &&
        this.gameData.isPlayer1) ||
      (this.scores[1].value < this.scores[0].value && !this.gameData.isPlayer1)
    )
      this.playerLost(this.sketch, "you Have Won");
    else {
      this.playerLost(this.sketch, "you Have lost");
    }
  }
  async leaveGame() {
    await this.socket.emit("leaveGame", {
      roomId: this.roomId,
    });
  }

  resize() {
    // if (game) {
    //   GameConstants.canvas.width = 400;
    //   GameConstants.canvas.height = 400;
    // }
    // this.init();
    // this.resizeObjects();
    this.resizeObjectsOpt(); //optimzed version

    if (!this.sketch) return;
    this.sketch.resizeCanvas(
      GameConstants.canvas.width,
      GameConstants.canvas.height
    );
  }
  drawGameObjects(sketch: P5Sketch) {
    sketch.background(this.backColor);
    this.net.draw(sketch);
    this.background.draw(sketch);
    this.ball.draw(sketch);
    this.paddle.draw(sketch);
    this.scores.map((score) => score.draw(sketch));
    this.paddle2.draw(sketch);
    this.drawOerlay(sketch);
    this.countdown.draw(sketch);
  }
  drawOerlay(sketch: P5Sketch) {
    if (!sketch) return;
    sketch.fill(83, 19, 126, 127);
    sketch.noStroke();
    sketch.rect(0, 0, GameConstants.canvas.width, GameConstants.canvas.height);
  }
  showGameOver(sketch: P5Sketch) {
    this.drawOerlay(sketch);
    sketch.textSize(GameConstants.canvas.width / 8);
    sketch.textAlign(sketch.CENTER);
    sketch.fill(255, 255, 255);
    sketch.text(
      "Game Over",
      GameConstants.canvas.width / 2,
      GameConstants.canvas.height / 2
    );
    // this.$router.push('/')
  }
  playerLost(sketch: P5Sketch, won: string) {
    sketch.textSize(GameConstants.canvas.width / 12);
    sketch.textAlign(sketch.CENTER);
    sketch.fill(255, 255, 255);
    sketch.text(
      won,
      GameConstants.canvas.width / 2,
      (GameConstants.canvas.height * 3) / 4
    );
    // this.$router.push('/')
  }
  countDown(sketch: P5Sketch) {
    this.drawGameObjects(sketch);
    this.countdown.value = COUNTDOWN;
    let countDownInterval = setInterval(() => {
      if (this.countdown.value <= 0) {
        this.countdown.value = COUNTDOWN;
        this.isGameOver = false;
        clearInterval(countDownInterval);
        return;
      }
      this.drawGameObjects(sketch);
      this.countdown.value--;
    }, 1000);
    this.intervals.push(countDownInterval);
  }

  setup(sketch: P5Sketch) {
    this.frames = 0;
    this.sketch = sketch;
    var font = sketch.loadFont("assets/fonts/BeatWorddemo.ttf");
    sketch.textFont(font);
    sketch.createCanvas(
      GameConstants.canvas.width,
      GameConstants.canvas.height
    );
    // this.isGameOver = true;
    // this.countdown.value = COUNTDOWN;
    // this.countDown(sketch);
    //online problem
    //uncomnet this to get coundown back each round
    this.worker = new Worker("game_worker.js");
    this.worker.onmessage = () => {
      this.draw(this.sketch);
    };
    this.draw(this.sketch);
  }

  draw(sketch: P5Sketch) {
    if (this.isGameOver) return;

    this.sendNewBallPostion();
    if (this.map != 3){
    sketch.background(this.backColor);
    }
    else{
    sketch.clear();
    sketch.background(220, 30); //=> the third map
    }
    if (this.gameData.map != 1) this.drawOerlay(sketch);
    this.net.draw(sketch);

    this.background.draw(sketch);
    this.paddle.draw(sketch);
    this.paddle.update();
    this.paddle2.draw(sketch);
    this.paddle2.update();
    if (
      this.scores[0].value >= MAX_SCORE ||
      this.scores[1].value >= MAX_SCORE
    ) {
      this.isGameOver = true;
      this.scores.map((score) => score.draw(sketch));
      // this.showGameOver(sketch);
      this.over(0);
      return;
    }
    let player: Paddle =
      this.ball.x < GameConstants.canvas.width / 2 ? this.paddle2 : this.paddle;
    if (this.ball.hits(player)) {
      this.ball.reverse(player, player == this.paddle);
      // send
      if (this.isSoundOn )
      {
      console.log("play sound");
      // this.wallHitSound.play();
      // this.marioCoin.play();
      // this.wallHitSound.play();
    this.ballBounce.play();
    // this.ballHit.play();
      }
    }
    let ballHitsBorder = this.ball.checkBorders();
    if (ballHitsBorder) {
         if (this.isSoundOn )
      {
      this.scoreSound.play();
      console.log("play2 sound");
      }
      this.ball.reset();
      this.paddle.reset();
      if (this.gameData.isPlayer1) this.sendNewPaddleVelocity(this.paddle);
      else this.sendNewPaddleVelocity(this.paddle2);
      if (
        this.scores[0].value >= MAX_SCORE ||
        this.scores[1].value >= MAX_SCORE
      ) {
        this.Clairo.pause();
        this.isGameOver = true;
        this.scores.map((score) => score.draw(sketch));
        // this.showGameOver(sketch);
        this.over(0);
        console.log("GAME OVER", this.scores);
        
        return;
      }
      // this.isGameOver = true; // change to true
      // this.countDown(sketch);
      //uncomnet this to get coundown back each round
    } else {
      if (!this.isGameOver && this.gameData.isPlayer1) this.ball.update();
      this.ball.draw(sketch);
      this.scores.map((score) => score.draw(sketch));
    }
    if (this.gameData.isPlayer1) this.sendNewPaddleVelocity(this.paddle);
    else this.sendNewPaddleVelocity(this.paddle2);
  }
  keydown(e: any) {
    if (this.gameData.isSpectator) return;
    if (this.isGameOver) return;
    if (this.gameData.isPlayer1) {
      if (this.paddle.handleKeyPressed(e))
        this.sendNewPaddleVelocity(this.paddle);
    } else {
      if (this.paddle2.handleKeyPressed(e))
        this.sendNewPaddleVelocity(this.paddle2);
    }
  }
  keyup(e: any) {
    if (this.gameData.isSpectator) return;
    if (this.isGameOver) return;
    if (this.gameData.isPlayer1) {
      if (this.paddle.handleKeyReleased(e))
        this.sendNewPaddleVelocity(this.paddle);
    } else {
      if (this.paddle2.handleKeyReleased(e))
        this.sendNewPaddleVelocity(this.paddle2);
    }
  }

  sendNewPaddleVelocity(paddle: Paddle) {
    if (this.gameData.isSpectator || !this.socket) return;
    this.socket.emit("paddleMoves", {
      roomId: this.roomId,
      paddle: {
        y: paddle.y,
        velocity: paddle.velocity,
      },
    });
  }
  sendNewBallPostion() {
    if (!this.gameData.isPlayer1 || !this.socket) return;
    this.socket.emit("ballMoves", {
      roomId: this.roomId,
      ball: {
        y: this.ball.y,
        x: this.ball.x,
        radius: this.ball.radius,
      },
      canvas: {
        width: GameConstants.canvas.width,
        height: GameConstants.canvas.height,
      },
    });
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }

  reset() {
    this.ball.reset();
    // this.paddle.reset();
    // this.paddle2.reset();
  }

  // async preload(sketch: P5Sketch) {}

  async playMusic(music: any) {
    try {
      // await music.play();
      // console.log("Playing...");
    } catch (err) {
      // console.log("Failed to play..." + err);
    }
  }
}
</script>

<style>
#game {
  filter: drop-shadow(8px 10px 20px rgba(0, 0, 0, 0.5));
}
/* #defaultCanvas0 { 
  width: 100%; 
  min-width: 100%; 
 
  min-height: 100%; 
  height: 100%; 
}  */
</style>
