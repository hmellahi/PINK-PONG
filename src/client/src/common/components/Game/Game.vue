<template>
  <div id="game" class="h-100">
    <P5 v-on="{ setup, draw }" />
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

@Component<Game>({
  components: { P5 },
  // props:{
  //   roomId:{
  //     type: String,
  //     required: true
  //   }
  // }
  // watch: {
  //   $route(to, from) {
  //     console.log("route switched");
  //     this.leaveGame();
  //   },
  // },
  async beforeRouteLeave(to, from, next) {
    console.log("beforeRouteLeave", to.path, from.path);
    await this.leaveGame();
    next();
  },
})
export default class Game extends Vue {
  socket: any = null;
  // ({ canvas, backColor } = GameConstants)
  // canvasWidth:
  backColor: number = GameConstants.backColor; //todo change
  // xBall: number = Math.floor(Math.random() * 300) + GameConstants.ball.x;
  xBall: number = GameConstants.ball.x;
  yBall: number = GameConstants.ball.y;
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
  map: string = "map1";
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
  init() {
    console.log("setup");
    var game = document.getElementById("game");

    if (game) {
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
    }
    this.socket = null;
    this.backColor = GameConstants.backColor; //todo change
    this.xBall = GameConstants.ball.x;
    this.yBall = GameConstants.ball.y;
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
  mounted() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("resize", this.resize);
    console.log("mounted");
    this.init();
    this.roomId = this.$route.query.id;
    console.log("here The id is: " + this.$route.query.id);

    this.listenToGameEvents();
  }

  listenToGameEvents() {
    this.socket = io("http://localhost:3000/game");
    this.socket.on("paddleMoves", (data: any) => {
      // console.log("recieved: " + velocity);
      let { paddle: enemyPaddle } = data;
      this.paddle2.y = enemyPaddle.y;
      this.paddle2.velocity = enemyPaddle.velocity;
    });
    this.socket.on("connect_failed", function () {
      console.log("Connection Failed");
    });
    // this.socket.on("roomNotFound", () => {
    //   // console.log("Connection Failed");
    //   this.$router.push({ path: "/" });
    // });
    this.socket.on("gameOver", () => {
      this.isGameOver = true;
      this.showGameOver(this.sketch);
      // TODO show to the player the he won because the other player quits
      // TODO clear all running intervals...
    });
    this.socket.emit("joinGame", { userId: 2, roomId: this.roomId });
  }

  async leaveGame() {
    await this.socket.emit("leaveGame", { userId: 2, roomId: this.roomId });
  }

  resize() {
    var game = document.getElementById("game");

    if (game) {
      GameConstants.canvas.width = game.offsetWidth;
      GameConstants.canvas.height = game.offsetHeight;
    }
    this.init();
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
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.fill(255, 0, 0);
    sketch.text(
      "Game Over",
      GameConstants.canvas.width / 2,
      GameConstants.canvas.height / 2
    );
    // this.$router.push('/')
  }
  countDown(sketch: P5Sketch) {
    this.drawGameObjects(sketch);
    this.countdown.value = 3;
    const countDownInterval = setInterval(() => {
      if (this.countdown.value <= 0) {
        this.countdown.value = 3;
        this.isGameOver = false;
        clearInterval(countDownInterval);
        return;
      }
      this.drawGameObjects(sketch);
      this.countdown.value--;
    }, 1000);
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

      this.scores[ballHitsBorder - 1].value++;
      if (this.scores[ballHitsBorder - 1].value > 9) {
        this.isGameOver = true;
        this.scores.map((score) => score.draw(sketch));
        this.showGameOver(sketch);
        return;
      }
      this.isGameOver = true; // change to true
      this.countDown(sketch);
    } else {
      if (!this.isGameOver) this.ball.update();
      this.ball.draw(sketch);
      this.scores.map((score) => score.draw(sketch));
    }
  }

  keydown(e: any) {
    console.log(e);
    if (this.isGameOver) return;
    if (this.paddle.handleKeyPressed(e)) this.sendNewPaddleVelocity();
  }
  keyup(e: any) {
    console.log(e);
    if (this.isGameOver) return;
    if (this.paddle.handleKeyReleased(e)) this.sendNewPaddleVelocity();
  }

  sendNewPaddleVelocity() {
    console.log("sending", this.roomId);
    this.socket.emit("paddleMoves", {
      roomId: this.roomId,
      paddle: {
        y: this.paddle.y,
        velocity: this.paddle.velocity,
      },
      userId: 2, // TODO CHANGE
    });
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
