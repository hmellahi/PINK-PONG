<template>
  <div id="game">
    <P5 v-on="{ setup, draw, keyreleased, keypressed, preload }" />
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

@Component({
  components: { P5 },
  // props:{
  //   roomId:{
  //     type: String,
  //     required: true
  //   }
  // }
})
export default class Game extends Vue {
  socket: any = null;

  // ({ canvas, backColor } = GameConstants)
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
  paddleWidth = GameConstants.paddle.width;
  paddleHeight = GameConstants.paddle.height;
  paddle: Paddle = new Paddle(
    this.xPaddle - 20,
    this.yPaddle,
    this.paddleWidth,
    this.paddleHeight
  );

  // xPaddle2=GameConstants.paddle.firstPLayer
  // yPaddle2=GameConstants.paddle.y
  // paddleWidth=GameConstants.paddle.width
  // paddleHeight=GameConstants.paddle.height;
  paddle2: Paddle = new Paddle(
    20,
    this.yPaddle,
    this.paddleWidth,
    this.paddleHeight
  );

  net: Net = new Net();
  background: BackGround = new BackGround();

  score: Score = new Score(GameConstants.canvas.width / 3 - 60, 30);
  score2: Score = new Score(
    GameConstants.canvas.width - GameConstants.canvas.width / 3,
    30,
    0
  );
  countdown: Score = new Score(
    GameConstants.canvas.width / 2,
    GameConstants.canvas.height / 2
  );
  scores: Score[] = [this.score, this.score2];
  roomId: any = "";

  mounted() {
    // const hitSound = new Audio(require("@/../../../../public/assets/sounds/mario_coin.mp3"));
    // this.sounds.push(hitSound);
    // const hitSound = new Audio(require("@/assets/sounds/mario_coin.mp3"));
    // const hitSound = new Audio(require("@/assets/sounds/mario_coin.mp3"));
    // console.log({ roomId: this.roomId }) ;
    this.roomId = this.$route.query.id;
    console.log("here The id is: " + this.$route.query.id);
    this.socket = io("http://localhost:3000/game");
    this.socket.on("paddleMoves", (velocity: any) => {
      this.paddle2.velocity = velocity;
      console.log("paddle2: " + velocity);
    });
    this.socket.on("connect_failed", function () {
      console.log("Connection Failed");
    });
    this.socket.on("roomNotFound", () => {
      // console.log("Connection Failed");
      this.$router.push({ path: "/" });
    });
    this.socket.emit("joinGame", { userId: 2, roomId: this.roomId });
    // this.socket.emit("paddleMoves", { userId: 2 }, (data: any) => {
    //   console.log({ data });
    // });
  }
  countDown(sketch: P5Sketch) {
    setInterval((sketch) => {
      // const element = array[index];
      if (this.countdown.value < 0) return;
      this.countdown.draw(sketch);
      this.countdown.value--;
    }, 1000);
  }
  setup(sketch: P5Sketch) {
    sketch.createCanvas(
      GameConstants.canvas.width,
      GameConstants.canvas.height
    );
    this.countdown.value = 5;
    this.countDown(sketch);
    this.isGameOver = false;
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
    // this.sleep(10000000000000);
    if (this.ball.hits(player)) {
      // this.playMusic(this.sounds[0]);
      // console.log(this.sounds[0]);
      // return;
      this.ball.reverse(player, player == this.paddle);
    }
    let ballHitsBorder = this.ball.checkBorders();
    if (ballHitsBorder) {
      this.ball.reset();
      this.scores[ballHitsBorder - 1].value++;
      if (this.scores[ballHitsBorder - 1].value > 2) {
        this.isGameOver = true;
        this.ball.y = GameConstants.canvas.height / 2;
      }
    }
    // if (!this.isGameOver) this.ball.update();
    this.ball.draw(sketch);

    // this.score.setScore((this.score.value+1/1e)%10)
    // this.score.draw(sketch);
    // this.score2.draw(sketch);
    // this.scores.map((score) => score.draw);
    this.scores.map((score) => score.draw(sketch));
  }

  keypressed(sketch: P5Sketch) {
    console.log("key pressed");
    if (this.paddle.handleKeyPressed(sketch)) this.sendNewPaddleVelocity();
  }

  keyreleased(sketch: P5Sketch) {
    if (this.paddle.handleKeyReleased(sketch)) this.sendNewPaddleVelocity();
  }

  sendNewPaddleVelocity() {
    console.log("sending", this.roomId);
    this.socket.emit("paddleMoves", {
      roomId: this.roomId,
      velocity: this.paddle.velocity,
      userId: 2, // TODO CHANGE
    });
  }

  // socket.emit("paddleMoves", { userId: 2, velocity: this.velocity, this.roomId});

  reset() {
    this.ball.reset();
    // this.paddle.reset();
    // this.paddle2.reset();
  }

  async preload(sketch: P5Sketch) {
    // sketch.soundFormats("mp3");
    // sketch.soundFormats("ogg", "mp3");
    // sketch.loadSound("../assets/sounds/mario_coin.mp3");
    // this.sounds.push(hitSound);
    // this.sounds.push(sketch.loadSound("@/assets/sounds/scoreSound.js"));
    // this.sounds.push(sketch.loadSound("@/assets/sounds/wallHitSound.js"));
    // some sounds
    // /assets/sounds/hitSound.wav");
    // this.sounds.push(hitSound);
    // new Audio("../assets/sounds/Clairo - Sofia-L9l8zCOwEII.mp3")
    // );
    // this.sounds[0].type = "audio/wav";
    // const wallHitSound = new Audio("wallHitSound.wav");
  }

  async playMusic(music: any) {
    //  music = await new Audio(
    //     "../assets/sounds/Clairo - Sofia-L9l8zCOwEII.mp3"
    //   );
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
</style>
