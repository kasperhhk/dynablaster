import { GameState } from '../gamestate';
import { withinBounds, samePosition } from '../util';

export class GameLogic {
    private keydownHandler?: (this: Window, ev: KeyboardEvent) => any;
    private thread?: NodeJS.Timer;

    constructor(private state: GameState) {}

    public init() {
        this.keydownHandler = this.handleKeyDownFactory();
        window.addEventListener("keydown", this.keydownHandler);

        this.thread = setInterval(() => {
            this.runEnemies();
            this.checkState();
        }, 1000/200);
    }

    public destroy() {
        if (this.keydownHandler) {
            window.removeEventListener("keydown", this.keydownHandler);
        }
        if (this.thread) {
            clearInterval(this.thread);
        }
    }

    private handleKeyDownFactory(): (this: Window, ev: KeyboardEvent) => any {
        const self = this;
        return (ev) => {
            if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;

            if (ev.key == "ArrowDown") {
                self.move(1, 0);
            }
            else if (ev.key == "ArrowUp") {
                self.move(-1, 0);
            }
            else if (ev.key == "ArrowLeft") {
                self.move(0, -1);
            }
            else if (ev.key == "ArrowRight") {
                self.move(0, 1);
            }
        };
    }

    private move(drow: number, dcolumn: number) {
        if (!this.state.dyna.alive) return;

        let newPosition = Object.assign({}, this.state.dyna.position);
        newPosition.row += drow;
        newPosition.column += dcolumn;

        if (withinBounds(newPosition, this.state.level.dimensions)) {
            this.state.dyna.position = newPosition;
        }
    }

    private runEnemies() {
        for (let enemy of this.state.enemies) {
            enemy.run();
        }
    }

    private checkState() {
        for (let enemy of this.state.enemies) {
            if (samePosition(enemy.position, this.state.dyna.position)) {
                this.state.dyna.alive = false;
            }
        }
    }
}