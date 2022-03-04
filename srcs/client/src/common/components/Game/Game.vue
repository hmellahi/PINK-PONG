<template>
  <div id="game" ref="game" class="h-100">
    <div v-if="!isLoading">
      <img :src="player2.image_url" alt="" class="player_left" />
      <img :src="player1.image_url" alt="" class="player_right" />
      <P5 v-on="{ setup }" />
    </div>
    <div v-else>Loading....</div>
  </div>
</template>

<script lang="ts">
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

let MAX_WIDTH = 600;
let MAX_HEIGHT = 400;
const MAX_SCORE = 5;
const COUNTDOWN = 3;
let RAD = 80;
let gameEvents = ["paddleMoves", "gameOver", "ballMoves", "incrementScore"];
@Component<Game>({
  components: { P5 },
  async beforeRouteLeave(to, from, next) {
   // console.log("before leave");
    // if (to.name == "game") {
    //   this.isLoading = true;
    //   try {
    //     await this.leaveGame();
    //     gameEvents.map((event) => {
    //       this.socket.removeListener(event);
    //     });
    //     this.Clairo.pause();
    //     await this.updatedGame();
    //   } catch (e) {}
    //   console.log("to game");
    //   return next();
    // }
    try {
      await this.leaveGame();
      //console.log({ name: to.name });
      this.worker.terminate();
      gameEvents.map((event) => {
        this.socket.removeListener(event);
      });
      this.Clairo.pause();
    } catch (e) {}
    next();
  },
  watch: {
    $route(to, from) {
      this.leaveGame();
      this.worker.terminate();
      this.isLoading = true;
      gameEvents.map((event) => {
        this.socket.removeListener(event);
      });
      this.Clairo.pause();
      //console.log("Update hhhhd");
      this.updatedGame();
    },
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
  yBall: number = GameConstants.canvas.height / 2;
  radius: number = GameConstants.canvas.width / RAD;
  sounds: Array<any> = [];
  ball: Ball;
  isGameOver: boolean = false; 
  isResize: boolean = false;
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
      if (game.offsetWidth < MAX_WIDTH || game.offsetHeight < MAX_HEIGHT) {
        this.isResize = true;
        //console.log("below size",game.offsetWidth, game.offsetHeight);
        // alert("Please augment window size to play");
      } else {
        this.isResize = false;
        //console.log("above size",game.offsetWidth, game.offsetHeight);
      }
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
      // console.log(game.offsetWidth, game.offsetHeight);
      // GameConstants.canvas.width = 400;
      // GameConstants.canvas.height = 400;
    }
    //console.log(GameConstants.canvas.width, GameConstants.canvas.height);
    this.backColor = GameConstants.backColor;
    this.xBall = GameConstants.canvas.width / 2;
    this.yBall = GameConstants.canvas.height / 2;
    // this.radius = 10;
    this.sounds = [];
    //console.log({ rad: this.radius });
    this.ball = new Ball(this.xBall, this.yBall, this.radius, 0);
    this.isGameOver = false;
    this.xPaddle = GameConstants.paddle.x;
    this.yPaddle = GameConstants.paddle.y;
    this.paddleWidth = GameConstants.canvas.width / 60;
    this.paddleHeight = GameConstants.canvas.height / 9;
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

  resizeObjectsOpt() {
    var xF = this.ball.x / GameConstants.canvas.width;
    var yF = this.ball.y / GameConstants.canvas.height;
    var game: any = this.$refs.game;
    var rx = GameConstants.canvas.width / 10;
    var ry = GameConstants.canvas.height / 10;
    if (game) {
      if (game.offsetWidth < MAX_WIDTH || game.offsetHeight < MAX_HEIGHT) {
        this.isResize = true;
        //console.log("below size",game.offsetWidth, game.offsetHeight);
        // alert("Please augment window size to play");
      } else {
        this.isResize = false;
        //console.log("above size",game.offsetWidth, game.offsetHeight);
      }
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
    }
    this.radius = GameConstants.canvas.width / RAD;
    this.ball.x = xF * GameConstants.canvas.width;
    this.ball.y = yF * GameConstants.canvas.height;
    this.isGameOver = false;
    this.paddleWidth = GameConstants.canvas.width / 120;
    this.paddleHeight = GameConstants.canvas.height / 80;
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
    await this.updatedGame();
  }
  async updatedGame() {
   // console.log("Updated");
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("resize", this.resize);
    this.init();
    //console.log({ paddle: this.paddle, paddle2: this.paddle2 });
    this.roomId = this.$route.query.id;
    var sound = "/assets/sounds/wallHitSound.wav";
    var sound2 = "/assets/sounds/scoreSound.wav";
    var sound3 = "/assets/sounds/mario_coin.mp3";
    var sound4 = "/assets/sounds/Clairo.mp3";
    var sound5 = "assets/sounds/ball-bounce.mp3";
    var sound6 = "assets/sounds/golf-ball-hit.wav";
    var sound7 =
      "assets/sounds/TunePocket-Ping-Pong-Ball-Bouce-Hit-Preview.mp3";
    var sound8 =
      "assets/sounds/alex-productions-epic-cinematic-gaming-cyberpunk-reset.mp3";
    this.listenToGameEvents();
    //  if(typeof(Worker) !== "undefined") {
    if (localStorage[this.currentUser.id + "#settings#0"]) {
      this.isMusicOn =
        localStorage[this.currentUser.id + "#settings#0"] === "true";
    }
    if (localStorage[this.currentUser.id + "#settings#1"]) {
      this.isSoundOn =
        localStorage[this.currentUser.id + "#settings#1"] === "true";
    }
    try {
      this.Clairo = await new Audio(sound8);
    } catch (error) {
      this.isMusicOn = false;
    }
    try {
      this.wallHitSound = await new Audio(sound);
      this.scoreSound = await new Audio(sound2);
      this.marioCoin = await new Audio(sound3);
      this.ballBounce = await new Audio(sound5);
      this.ballHit = await new Audio(sound7);
    } catch (error) {
      this.isSoundOn = false;
    }
    //console.log({ isSoundOn: this.isSoundOn, isMusicOn: this.isMusicOn });
    // here do ur shit...
    if (this.isMusicOn) {
      this.playMusic(this.Clairo);
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

    this.socket.on("gameOver", (ff: any) => {
      // this.scores[ballHitsBorder - 1].value++;
      this.isGameOver = true;
      this.intervals.map((interval) => {
        clearInterval(interval);
      });
      this.over(ff);
    });

    this.socket.emit(
      "joinGame",
      { roomId: this.roomId },
      async ({ msg, err }: any) => {
        if (err) {
          this.$notify({
            duration: 1000,
            type: "danger",
            title: err,
          });
          this.$router.push({ path: "/" });
          return;
        }
        let { gameData, currentGameState } = msg;
        this.gameData = gameData;
        if (this.gameData.map) this.net.map = this.gameData.map;

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
          //console.log({ gamdata: this.gameData });
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
        //console.log("aa", { msg });
      }
    );

    this.socket.on("ballMoves", (data: any) => {
      // if (this.gameData.isPlayer1) return;
      let { ball, canvas } = data;
      this.ball.x = (ball.x / canvas.width) * GameConstants.canvas.width;
      this.ball.y = (ball.y / canvas.height) * GameConstants.canvas.height;
      // if (this.gameData.isPlayer1)
      //   console.log(`ballx ${this.ball.x},bally ${this.ball.y}`);
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
    //console.log({ score1: this.scores[0].value });
    //console.log({ score2: this.scores[1].value });
    if (
      ff ||
      (this.scores[1].value > this.scores[0].value &&
        this.gameData.isPlayer1) ||
      (this.scores[1].value < this.scores[0].value && !this.gameData.isPlayer1)
    )
      //ff is disconnet
      this.playerLost(this.sketch, "you Have Won");
    else {
      this.playerLost(this.sketch, "you Have lost");
    }
    this.isGameOver = true;
    // this.worker.terminate();
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
    //console.log({ rad: this.radius });

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

  showResize(sketch: P5Sketch) {
    this.drawOerlay(sketch);
    //  sketch.background(220);
    //this.background.draw(sketch);
    sketch.textSize(GameConstants.canvas.width / 18);
    sketch.textAlign(sketch.CENTER);
    sketch.fill(255, 255, 255);
    sketch.text(
      "Augment window size to resume controlle",
      GameConstants.canvas.width / 2,
      GameConstants.canvas.height / 2
    );
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
  }

  draw(sketch: P5Sketch) {
    if (this.isGameOver) return;

    // this.sendNewBallPostion();
    if (this.map != 3) {
      sketch.background(this.backColor);
    } else {
      sketch.clear();
      sketch.background(220, 30); //=> the third map
    }
    if (this.gameData.map != 1) this.drawOerlay(sketch);
    this.net.draw(sketch);

    this.background.draw(sketch);

    this.paddle.draw(sketch);
    if (!this.isResize) this.paddle.update();
    this.paddle2.draw(sketch);
    if (!this.isResize) this.paddle2.update();
    if (
      this.scores[0].value >= MAX_SCORE ||
      this.scores[1].value >= MAX_SCORE
    ) {
      this.isGameOver = true;
      this.scores.map((score) => score.draw(sketch));
      // this.showGameOver(sketch);
      // try {
      //   this.Clairo.pause();
      // } catch (e) {}
      this.pauseMusic(this.Clairo);
      this.over(0);
      return;
    }
    let player: Paddle =
      this.ball.x < GameConstants.canvas.width / 2 ? this.paddle2 : this.paddle;
    if (this.ball.hits(player)) {
      this.ball.reverse(player, player == this.paddle);
      // this.sendNewBallPostion();
      //   this.ball.draw(sketch);

      //      if (this.gameData.isPlayer1) this.sendNewPaddleVelocity(this.paddle);
      // else this.sendNewPaddleVelocity(this.paddle2);
      // send
      if (this.isSoundOn) {
        // console.log("play sound");
        // this.wallHitSound.play();
        // this.marioCoin.play();
        // this.wallHitSound.play();
        // this.ballBounce.play();
        // this.ballHit.play();
        this.playMusic(this.ballBounce);
      }
    }
    let ballHitsBorder = this.ball.checkBorders();
    if (ballHitsBorder) {
      if (this.isSoundOn) {
        this.playMusic(this.scoreSound);
        // this.scoreSound.play();
      }
      this.ball.reset();
      this.paddle.reset();
      if (this.gameData.isPlayer1) this.sendNewPaddleVelocity(this.paddle);
      else this.sendNewPaddleVelocity(this.paddle2);
      if (
        this.scores[0].value >= MAX_SCORE ||
        this.scores[1].value >= MAX_SCORE
      ) {
        // this.Clairo.pause();
        this.pauseMusic(this.Clairo);
        this.isGameOver = true;
        this.scores.map((score) => score.draw(sketch));
        // this.showGameOver(sketch);
        this.over(0);
        //console.log("GAME OVER", this.scores);

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
    this.sendNewBallPostion();
    if (this.isResize) {
      //overlay
      this.showResize(sketch);
      // return;
    }
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
      await music.play();
      //console.log("Playing...");
    } catch (err) {
      //console.log("Failed to play..." + err);
    }
  }
  async pauseMusic(music: any) {
    try {
      await music.pause();
      //console.log("Playing...");
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
