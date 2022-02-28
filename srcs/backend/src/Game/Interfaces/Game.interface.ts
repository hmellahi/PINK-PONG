export interface Paddle{
    velocity:number,
    y:number
}
export interface Ball{
    x:number,
    y:number
}

export interface userData{
    socketId:string,
    status:"Online"|"In Queue"|"Offline"|"In Game"
}

export interface Game {
    // id?: number;
    roomId:string;
    player1:number;
    player2:number;
    score1:number;
    score2:number;
    map:number;
    created_at:Date;
    paddles:Paddle[];
    ball:Ball;
    canvas:any;
    ff:number;
}