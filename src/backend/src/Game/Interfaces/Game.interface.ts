export interface Game {
    // id?: number;
    roomId:string;
    player1:number;
    player2:number;
    score1:number;
    score2:number;
    map:number;
    created_at:Date;
    paddles:any[];
    balls:any[];
    ff:number;
}