import {
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import { GameConstants } from "../constants";
import Paddle from "@/common/Game/Objects/Paddle";

export default class {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: number;
  speed: number;
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;
  initialSpeed: number;

  // Constructor method
  constructor(
    tempX: number,
    tempY: number,
    tempRadius: number,
    tempColor: number
  ) {
    this.x = tempX;
    this.y = tempY;
    // this.y =  Math.floor(Math.random() * GameConstants.canvas.height - 200) + 200;
    // this.y = Math.floor(Math.random() * ((GameConstants.canvas.height / 10)*8 - (GameConstants.canvas.height / 10)*2 + (GameConstants.canvas.height / 10)*2));
    //USE this code above for randomnes
    this.radius = tempRadius;
    // this.velocityX = Math.floor(Math.random() * 10) + 1;;
    // this.velocityY = Math.floor(Math.random() * 10) + 1;;
    this.velocityX = 1;
    this.velocityY = 1;
    this.initialSpeed = GameConstants.canvas.width / 100;
    this.speed = this.initialSpeed;
    // this.speed = 1;
    this.color = tempColor;
  }

  // draw
  draw(sketch: P5Sketch): void {
    // let x1 = GameConstants.;
    //

    let { x, y, radius } = this;
    sketch.fill(255, 255, 255);
    // sketch.fill("red");
    sketch.noStroke();
    // sketch.ellipse(x + radius, y - radius, radius * 2, radius * 2);
    sketch.ellipse(x, y, radius * 2, radius * 2);
    // console.log(`from  ball ${this.x}, ${this.y}`);
  }

  update(): void {
    let { velocityY, velocityX, x, y, radius, speed } = this;
    let { canvas } = GameConstants;
    let { width, height } = canvas;
    let ratio = width / 80;
    if (x < radius / 2 || x > width - radius / 2) {
      this.velocityX *= -1;
    }
    if (y < ratio + radius || y > height - ratio - radius) {
      this.velocityY *= -1;
    }

    this.x += this.velocityX * speed; // * (Math.random() * 10);
    this.y += this.velocityY * speed;
    // console.log(this.x, this.y);
  }

  hits(player: Paddle): boolean {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    this.top = this.y - this.radius;
    this.right = this.x + this.radius;
    this.bottom = this.y + this.radius;
    this.left = this.x - this.radius;
    return (
      this.left < player.right &&
      this.top < player.bottom &&
      this.right > player.left &&
      this.bottom > player.top
    );
  }

  reverse(player: Paddle, isFirstPlayer: boolean): void {
    // play hitSound
    // hitSound.play(); todo
    // var tmp = loadsound('../firework.mp3');
    // tmp();
    // default angle is 0deg in Radian
    // console.log(`ball speed ${this.speed}`);
    // console.log(`ball VeloX ${this.velocityX} and VeloY ${this.velocityY}`);

    // console.log("I am hitted");
    console.log(`player ${player.x}, ${player.y}`);
    console.log(`bll ${this.x}, ${this.y}`);

    let collidePoint = this.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = isFirstPlayer ? -1 : 1;
    // if ball hit the top of paddle
    // if (this.y < player.y + player.height / 2) {
    //   // then -1 * Math.PI / 4 = -45deg
    //   angle = (-1 * Math.PI) / 4;

    // }
    //  // if it hit the bottom of paddle
    //   else if (this.y > player.y + player.height / 2) {
    //   // then angle will be Math.PI / 4 = 45deg
    //   angle = Math.PI / 4;
    // }

    /* change velocity of according to on which paddle the hitted */
    // this.velocityX = (isFirstPlayer ? 1 : -1) * this.speed * Math.cos(angle);
    // this.velocityY = this.speed * Math.sin(angle);
    this.velocityX = direction * Math.cos(angleRad);
    this.velocityY = Math.sin(angleRad);
    this.speed += 1
    // increase speed
    // this.speed += 0.05; TODO CHange
    // console.log(`ball speed ${this.speed}`);
    // console.log(`ball VeloX ${this.velocityX} and VeloY ${this.velocityY}`);
  }

  reset() {
    let { canvas, borderWidth } = GameConstants;
    let { height: windowsHeight, width: windowsWidth } = canvas;
    // let {borderWidth} = GameConstants
    // this.y = windowsHeight / 2; // TODO
    // // this.y =  Math.floor(Math.random() * (windowsHeight- borderWidth) + borderWidth);
    // this.x = windowsWidth / 2;
    this.y = canvas.height / 2; // TODO
    this.x = canvas.width / 2;
    this.speed = this.initialSpeed;
    this.velocityX = 1;
    this.velocityY = 1; 
  }

  checkBorders(): number {
    let borderWidth = Math.floor(GameConstants.canvas.width / 80);
    if (this.x - this.radius / 2 - borderWidth <= 0) return 2;
    if (this.x + this.radius / 2 + borderWidth >= GameConstants.canvas.width)
      return 1;
    return 0;
  }
}
// load sounds
// => musics

// keyreleased => stop
// scoring functions
// check if someone scored
// => increase player score
// if score reaches max
// => stop the game
// => reset

// types of tests:
// Unit Testing
// Component Testing
// End-To-End (E2E) Testing
//
