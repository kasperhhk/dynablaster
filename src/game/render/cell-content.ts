import { GameState } from '../gamestate';
import { Cell } from '../models';
import { samePosition } from '../util';

export class CellContent {
    text: string;
    textColor: string;
    backgroundColor: string;

    constructor(private state: GameState, private cell: Cell) {
        this.text = "";

        const dyna = samePosition(state.dyna.position, cell.position);
        const enemy = state.enemies.some(e => samePosition(e.position, cell.position));

        if (dyna && enemy) {
            this.text = ":V D";
        }
        else if (dyna && state.dyna.alive) {
            this.text = "D";
        }
        else if (dyna) {
            this.text = "X_X";
        }
        else if (enemy) {
            this.text = ":O";
        }

        const percWidth = cell.position.column / state.level.dimensions.columns;
        const percHeight = cell.position.row / state.level.dimensions.rows;

        const red = percWidth * 255;
        const green = percHeight * 255;
        const blue = 150;

        this.textColor = "white";
        
        this.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }
}