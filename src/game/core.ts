import { GameState } from './gamestate';
import { GameLogic } from './logic/logic';
import { GameSettings } from './models';
import { GameRenderManager } from './render/game-render-manager';

export class DynablasterGame {
    private state: GameState;
    private renderer: GameRenderManager;
    private logic: GameLogic;

    constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D, private settings: GameSettings) {
        this.state = new GameState();
        this.renderer = new GameRenderManager(this.state, context, settings);
        this.logic = new GameLogic(this.state);
    }

    public init() {
        this.renderer.init();
        this.logic.init();
    }

    public destroy() {
        this.renderer.destroy();
        this.logic.destroy();
    }
}