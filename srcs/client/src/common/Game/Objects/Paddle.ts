import {
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import { GameConstants } from "../constants";

export default class Ball {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  speed: number;
  velocity: number;
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;

  // Constructor method
  constructor(
    tempX: number,
    tempY: number,
    tempWidth: number,
    tempHeight: number,
    tempColor: number = 0
  ) {
    this.x = tempX;
    this.y = tempY;
    this.width = tempWidth;
    this.height = tempHeight;
    this.color = tempColor;
    this.speed = GameConstants.canvas.height / 50;
    this.velocity = 0;
  }

  // draw
  draw(sketch: P5Sketch) {
    let { x, y, width, height } = this;

    sketch.fill(255, 255, 255);
    sketch.noStroke();
    sketch.rect(x, y, width, height);
  }

  update() {
    let windowHeight = GameConstants.canvas.height;
    let nexPos = this.y + this.velocity * this.speed;
    if (nexPos + this.height > windowHeight || nexPos < 0) return;
    this.y = nexPos;
    // console.log(`from  player ${this.x}, ${this.y}`);
  }
  handleKeyPressed(e: any): Boolean {
    // console.log(keyCode== LEFT_ARROW);
    if (e.code === "ArrowUp") {
      this.velocity = -1;
      return true;
    } else if (e.code === "ArrowDown") {
      this.velocity = 1;
      return true;
    }
    return false;
  }

  handleKeyReleased(e: any): Boolean {
    if (e.code === "ArrowUp") {
      this.velocity = 0;
      return true;
    } else if (e.code === "ArrowDown") {
      this.velocity = 0;
      return true;
    }
    return false;
  }
  reset() {
    let { canvas, borderWidth } = GameConstants;
    let { height: windowsHeight, width: windowsWidth } = canvas;
    // let {borderWidth} = GameConstants
    // // this.y =  Math.floor(Math.random() * (windowsHeight- borderWidth) + borderWidth);
    // this.x = windowsWidth / 2;
    this.y = GameConstants.paddle.y;
    this.speed = GameConstants.canvas.height / 50;
    this.velocity = 0;
  }
  // handleKeyPressed(sketch: P5Sketch): Boolean {
  //   let { UP_ARROW, DOWN_ARROW, keyCode } = sketch;
  //   // console.log(keyCode== LEFT_ARROW);
  //   if (keyCode === UP_ARROW) {
  //     this.velocity = -1;
  //     return true;
  //   } else if (keyCode === DOWN_ARROW) {
  //     this.velocity = 1;
  //     return true;
  //   }
  //   return false;
  // }

  // handleKeyReleased(sketch: P5Sketch): Boolean {
  //   let { UP_ARROW, DOWN_ARROW, keyCode } = sketch;
  //   if (keyCode === UP_ARROW) {
  //     this.velocity = 0;
  //     return true;
  //   } else if (keyCode === DOWN_ARROW) {
  //     this.velocity = 0;
  //     return true;
  //   }
  //   return false;
  // }
}
