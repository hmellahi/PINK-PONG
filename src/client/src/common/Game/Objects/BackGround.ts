import {
  P5Sketch, // this are the type definitions
} from "vue-p5-component";
import { GameConstants } from "../constants";

export default class BackGround {
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
  glow(sketch: P5Sketch,glowColor:number, Burriness:number){
    let { canvas } = GameConstants;
    let { width, height } = canvas;
    let ratio = Math.floor(width / 80);
    let tmp1 = sketch.drawingContext.shadowBlur;
    let tmp2 = sketch.drawingContext.shadowColor;

    sketch.drawingContext.shadowBlur = Burriness;
    sketch.drawingContext.shadowColor = glowColor;
    // let offsetX = map(mouse)

    sketch.rect(0, 0, ratio, height);
    sketch.rect(width- ratio,0, ratio, height);
    sketch.rect(0, 0, width, ratio);
    sketch.rect(0, height - ratio, width, ratio);
    sketch.drawingContext.shadowBlur = tmp1;
    sketch.drawingContext.shadowColor = tmp2;
  }
  // draw
  draw(sketch: P5Sketch) {
    // let { x, y } = this;

 

    // let ratio = Math.floor(width / 60);
    // sketch.fill(255, 255, 255);
    // console.log(sketch)
    sketch.noStroke();
    let round = 10;
    let color = sketch.color(207, 7, 99);
    this.glow(sketch,color,400);
    this.glow(sketch,color,80);
    this.glow(sketch,color,12);

    // drawingContext.shadowBlur = 12;
    // drawingContext.shadowColor = color(207, 7, 99);
    // let tmp1 = sketch.drawingContext.shadowBlur;
    // let tmp2 = sketch.drawingContext.shadowColor;

    // sketch.drawingContext.shadowBlur = 12;
    // sketch.drawingContext.shadowColor = sketch.color(207, 7, 99);
    // // let offsetX = map(mouse)
    // sketch.rect(0, 0, width, ratio);
    // sketch.rect(0, height - ratio, width, ratio);
    // sketch.rect(0, 0, ratio, height);
    // // sketch.rect(width - ratio, 0, ratio, height);
    // sketch.rect(width- ratio,0, ratio, height);

    // sketch.drawingContext.shadowBlur = tmp1;
    // sketch.drawingContext.shadowColor = tmp2;
    // for (let i = 0; i < height; i += ratio*2) {
    // sketch.rect(x-1, i, 8, ratio);
    // }
    // sketch.rect(x - 3, 0, 6, height);
    // console.log("ratio " + ratio + " " + height);
  }
}
