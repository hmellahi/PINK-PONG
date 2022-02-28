import {
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import { GameConstants } from "../constants";

export default class Net {
  //   x: number;
  //   y: number;
  width: number;
  height: number;
  map: number;
  //   color: number;
  //   speed: number;

  // Constructor method
  constructor(width: number, height: number, map: number) {
    //   tempColor: number = 0 //   tempHeight: number, //   tempWidth: number, //   tempY: number, //   tempX: number,
    //   this.x = tempX;
    //   this.y = tempY;
    this.width = width;
    this.height = height;
    this.map = map;
    //   this.color = tempColor;
    //   this.speed = 10;
  }
  drawOverlay(sketch: P5Sketch) {
    if (!sketch) return;
    sketch.fill(83, 19, 126, 127);
    sketch.noStroke();
    sketch.rect(0, 0, GameConstants.canvas.width, GameConstants.canvas.height);
  }
  // draw
  map1(sketch: P5Sketch) {
    let ratio = Math.floor(this.width / 120);
    let x = this.width / 2;
    sketch.stroke(255);
    sketch.strokeWeight(ratio);
    sketch.noFill();
    sketch.rect(x - ratio / 2, 0, ratio / 2, this.height);
  }  
  map3(sketch: P5Sketch) {

  }

  map2(sketch: P5Sketch) {
    this.drawOverlay(sketch); //add overlay
    let ratio = Math.floor(this.width / 80);
    let x = this.width / 2;
    let y = this.height / 2;
    let size = this.width / 8;

    sketch.stroke(255);
    sketch.strokeWeight(ratio);
    sketch.noFill();
    sketch.ellipse(x, y, size, size);
    sketch.fill(255, 255, 255);
    sketch.noStroke();
    for (let i = 0; i < y - size / 2; i += ratio * 2) {
      sketch.rect(x - ratio / 2, i, ratio, ratio);
    }
    for (let i = y + size / 2; i < this.height; i += ratio * 2) {
      sketch.rect(x - ratio / 2, i, ratio, ratio);
    }
  }

  draw(sketch: P5Sketch) {
    if (this.map == 1) {
      this.map1(sketch);
    } else if (this.map == 2) {
      this.map2(sketch);
    }
    else{
      this.map3(sketch);
    }
  }
}
