import { GameState } from '../gamestate';
import { GameSettings } from '../models';
import { RenderSettings } from './models';
import { Render } from './render';

export class GameRenderManager {
    private thread?: NodeJS.Timer;

    private readonly renderSettings: RenderSettings;

    constructor(private state: GameState, private context: CanvasRenderingContext2D, private settings: GameSettings) {
        this.renderSettings = {
            viewPort: {
                cellsPerWidth: 9,
                pixelWidth: this.settings.dimensions.width,
                pixelHeight: this.settings.dimensions.height
            }            
        }
    }

    public init() {
        this.thread = setInterval(() => {
            const render = new Render(this.context, this.renderSettings, this.state);
            render.render();
        }, 1000/(this.settings.graphics?.fps || 60));
    }

    public destroy() {
        clearInterval(this.thread);
    }
}