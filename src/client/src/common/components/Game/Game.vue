<template>
  <div id="game" class="h-100">
    <P5 v-if="!isLoading" v-on="{ setup, draw }" />
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

let MAX_SCORE = 5;

@Component<Game>({
  components: { P5 },
  async beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave", to.path, from.path);
    await this.leaveGame();
    next();
  },
})
export default class Game extends Vue {
  intervals: Array<any> = [];
  socket: any = null;
  // ({ canvas, backColor } = GameConstants)
  // canvasWidth:
  backColor: number = GameConstants.backColor; //todo change
  // xBall: number = Math.floor(Math.random() * 300) + GameConstants.ball.x;
  xBall: number = GameConstants.canvas.width / 2;
  yBall: number = GameConstants.canvas.height / 2;
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
  background: BackGround = new BackGround();

  score: Score = new Score(GameConstants.canvas.width / 4 - 60, 30);
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
  init() {
    // console.log("setup");
    var game = document.getElementById("game");

    if (game) {
      // GameConstants.canvas.width = game.offsetWidth;
      // GameConstants.canvas.height = game.offsetHeight;
      // console.log(game.offsetWidth, game.offsetHeight);
      GameConstants.canvas.width = 400;
      GameConstants.canvas.height = 400;
    }
    this.socket = null;
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

    var game = document.getElementById("game");
    if (game) {
      // GameConstants.canvas.width = game.offsetWidth;
      // GameConstants.canvas.height = game.offsetHeight;
      GameConstants.canvas.width = 400;
      GameConstants.canvas.height = 400;
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
      this.map
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
  mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("resize", this.resize);
    this.init();
    this.roomId = this.$route.query.id;
    console.log("here The id is: ", this.currentUser.id);

    this.listenToGameEvents();
  }

  listenToGameEvents() {
    const Authentication = this.$cookies.get("Authentication")
    this.socket = io("http://localhost:3000/game", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authentication
          },
        },
      },
    });
    this.socket.on("paddleMoves", (data: any) => {
      // console.log("recieved: " + velocity);
      let { paddle: enemyPaddle } = data;
      this.paddle2.y = enemyPaddle.y;
      this.paddle2.velocity = enemyPaddle.velocity;
    });

    this.socket.on("disconnect", function () {
      console.log("Connection Failed");
    });

    this.socket.on("gameOver", (ballHitsBorder:any) => {
      // this.scores[ballHitsBorder - 1].value++;
      this.isGameOver = true;
      this.intervals.map((interval) => {
        clearInterval(interval);
      });
      this.showGameOver(this.sketch);
      // TODO show to the player the he won because the other player quits
      this.playerLost(this.sketch);
      // TODO clear all running intervals...
      // clearInterval(this.countInter);
    });

    this.socket.emit(
      "joinGame",
      { userId: this.currentUser.id, roomId: this.roomId },
      (msg: any) => {
        console.log("msg", { msg });
        if (msg === "roomNotFound") {
          // this.$router.push({ path: "/" });
          return;
        }
        this.gameData = msg;
        this.net.map = msg.map;
        if (!this.gameData.isPlayer1) {
          let tmp: Paddle = this.paddle;
          this.paddle = this.paddle2;
          this.paddle2 = tmp;
          console.log("swapped");
        }
        this.isLoading = false;
      }
    );

    this.socket.on("ballMoves", (data: any) => {
      if (this.gameData.isPlayer1) return;
      let { ball, canvas } = data;
      this.ball.x = (ball.x / canvas.width) * GameConstants.canvas.width;
      this.ball.y = (ball.y / canvas.height) * GameConstants.canvas.height;
    });

    this.socket.on("incrementScore", (ballHitsBorder: number) => {
      this.scores[ballHitsBorder - 1].value++;
      console.log(this.scores[ballHitsBorder - 1].value);
    });

    this.socket.emit(
      "joinGame",
      { userId: this.currentUser.id, roomId: this.roomId },
      (data: any) => {
        console.log({ data });
        this.gameData = data;
        this.map = data.map;
      }
    );
  }

  async leaveGame() {
    await this.socket.emit("leaveGame", {
      userId: this.currentUser.id,
      roomId: this.roomId,
    });
  }

  resize() {
    // var game = document.getElementById("game");

    // // if (game) {
    // //   GameConstants.canvas.width = game.offsetWidth;
    // //   GameConstants.canvas.height = game.offsetHeight;
    // // }
    // if (game) {
    //   GameConstants.canvas.width = 400;
    //   GameConstants.canvas.height = 400;
    // }
    // this.init();
    this.resizeObjects();

    this.sketch.resizeCanvas(
      GameConstants.canvas.width,
      GameConstants.canvas.height
    );
  }
  drawGameObjects(sketch: P5Sketch) {
    sketch.background(this.backColor);
    this.background.draw(sketch);
    this.net.draw(sketch);
    this.ball.draw(sketch);
    this.paddle.draw(sketch);
    this.scores.map((score) => score.draw(sketch));
    this.paddle2.draw(sketch);
    // TODO draw overlay
    this.drawOerlay(sketch);
    this.countdown.draw(sketch);
  }
  drawOerlay(sketch: P5Sketch) {
    sketch.fill(83, 19, 126, 127);
    sketch.noStroke();
    sketch.rect(0, 0, GameConstants.canvas.width, GameConstants.canvas.height);
  }
  showGameOver(sketch: P5Sketch) {
    this.drawOerlay(sketch);
    sketch.textSize(GameConstants.canvas.width / 8);
    sketch.textAlign(sketch.CENTER);
    sketch.fill(255, 0, 0);
    sketch.text(
      "Game Over",
      GameConstants.canvas.width / 2,
      GameConstants.canvas.height / 2
    );
    // this.$router.push('/')
  }
  playerLost(sketch: P5Sketch) {
    sketch.textSize(GameConstants.canvas.width / 12);
    sketch.textAlign(sketch.CENTER);
    sketch.fill(255, 0, 0);
    sketch.text(
      "you Have Lost",
      GameConstants.canvas.width / 2,
      (GameConstants.canvas.height * 3) / 4
    );
    // this.$router.push('/')
  }
  countDown(sketch: P5Sketch) {
    this.drawGameObjects(sketch);
    this.countdown.value = 3;
    let countDownInterval = setInterval(() => {
      if (this.countdown.value <= 0) {
        this.countdown.value = 3;
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
    // window.onresize = this.resize;
    this.sketch = sketch;
    var font = sketch.loadFont("assets/fonts/BeatWorddemo.ttf");
    sketch.textFont(font);
    sketch.createCanvas(
      GameConstants.canvas.width,
      GameConstants.canvas.height
    );
    this.isGameOver = true;
    this.countDown(sketch);
  }

  draw(sketch: P5Sketch) {
    if (this.isGameOver) return;
    sketch.background(this.backColor);
    this.background.draw(sketch);
    this.net.draw(sketch);
    this.paddle.draw(sketch);
    this.paddle.update();
    this.paddle2.draw(sketch);
    this.paddle2.update();
    let player: Paddle =
      this.ball.x < GameConstants.canvas.width / 2 ? this.paddle2 : this.paddle;
    if (this.ball.hits(player)) {
      this.ball.reverse(player, player == this.paddle);
      // send
    }
    let ballHitsBorder = this.ball.checkBorders();
    if (ballHitsBorder) {
      this.ball.reset();
      // send

      // this.scores[ballHitsBorder - 1].value++;
      if (this.scores[ballHitsBorder - 1].value >= MAX_SCORE) {
        this.isGameOver = true;
        this.scores.map((score) => score.draw(sketch));
        // this.showGameOver(sketch);
        return;
      }
      this.isGameOver = true; // change to true
      this.countDown(sketch);
    } else {
      // if (!this.isGameOver && this.gameData.isPlayer1) this.ball.update();
      this.ball.draw(sketch);
      this.scores.map((score) => score.draw(sketch));
    }
    this.sendNewBallPostion();
  }

  keydown(e: any) {
    if (this.gameData.isSpectator) return;
    if (this.isGameOver) return;
    if (this.paddle.handleKeyPressed(e)) this.sendNewPaddleVelocity();
  }
  keyup(e: any) {
    if (this.gameData.isSpectator) return;
    if (this.isGameOver) return;
    if (this.paddle.handleKeyReleased(e)) this.sendNewPaddleVelocity();
  }

  sendNewPaddleVelocity() {
    console.log("emitting");
    this.socket.emit("paddleMoves", {
      roomId: this.roomId,
      paddle: {
        y: this.paddle.y,
        velocity: this.paddle.velocity,
      },
      userId: this.currentUser.id, // TODO CHANGE
    });
  }
  sendNewBallPostion() {
    if (!this.gameData.isPlayer1) return;
    console.log("sending", this.roomId);
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
      userId: this.currentUser.id, // TODO CHANGE
    });
  }
  get currentUser() {
    return this.$store.getters["User/getCurrentUser"];
  }
  // socket.emit("paddleMoves", { userId: 2, velocity: this.velocity, this.roomId});

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
