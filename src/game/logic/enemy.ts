import { GameState } from '../gamestate';
import { DeltaPosition, Position } from '../models';
import { withinBounds } from '../util';

export class Enemy {
    private lastMove: number = 0;
    private static readonly possibleMoves: DeltaPosition[] = [{drow:-1, dcolumn:0}, {drow:1,dcolumn:0}, {drow:0, dcolumn:-1}, {drow:0, dcolumn:1}];

    constructor(private state: GameState, public position: Position, public speed: number) {}

    public run() {
        const now = performance.now();
        if (now - this.lastMove > this.speed) {
            this.lastMove = now;
            this.move();
        }
    }

    private move() {
        const choice = Math.floor(Math.random() * Enemy.possibleMoves.length);
        const delta = Enemy.possibleMoves[choice];
        
        let newPosition = Object.assign({}, this.position);        
        newPosition.row += delta.drow;
        newPosition.column += delta.dcolumn;

        if (!withinBounds(newPosition, this.state.level.dimensions)) {            
            newPosition = Object.assign({}, this.position);
            newPosition.row -= delta.drow;
            newPosition.column -= delta.dcolumn;
        }

        this.position = newPosition;
    }
}