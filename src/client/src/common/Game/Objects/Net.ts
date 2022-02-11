import {
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import { GameConstants } from "../constants";

export default class Net {
  //   x: number;
  //   y: number;
  //   width: number;
  //   height: number;
  //   color: number;
  //   speed: number;

  // Constructor method
  constructor() {
    //   tempColor: number = 0 //   tempHeight: number, //   tempWidth: number, //   tempY: number, //   tempX: number,
    //   this.x = tempX;
    //   this.y = tempY;
    //   this.width = tempWidth;
    //   this.height = tempHeight;
    //   this.color = tempColor;
    //   this.speed = 10;
  }

  // draw
  draw(sketch: P5Sketch) {
    // let { x, y } = this;
    let sketchTmp = sketch;
    let { canvas } = GameConstants;
    let { width, height } = canvas;

    let ratio = Math.floor(width / 80);
    let x = width / 2;
    let y = height /2;
    let size = width / 8;

    sketch.stroke(255);
    sketch.strokeWeight(ratio);
    sketch.noFill();
    // sketch.ellipse(x,y,size,size)
    // sketch.fill(255, 255, 255);
    // sketch.noStroke();
    for (let i = 0; i < height; i += ratio*2) {
    sketch.rect(x - ratio/2, i, ratio, ratio);
    }
    // for (let i = 0; i < y - size/2; i += ratio*2) {
    //   sketch.rect(x - ratio/2, i, ratio, ratio);
    //   }
    //   for (let i = y + size/2; i < height; i += ratio*2) {
    //     sketch.rect(x - ratio/2, i, ratio, ratio);
    //   }
    sketch = sketchTmp;
    // sketch.rect(x - 3, 0, 6, height);
    // console.log("ratio " + ratio + " " + height);
  }
}
