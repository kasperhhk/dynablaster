import { Cell } from '../models';
import { PixelPosition, RenderSettings, PixelOffset } from './models';

export class CellDimensions {
    topLeft: PixelPosition;
    width: number;
    height: number;
    
    bottomLeft: PixelPosition;
    bottomRight: PixelPosition;
    topRight: PixelPosition;

    right: number;
    left: number;
    top: number;
    bottom: number;

    constructor(private renderSettings: RenderSettings, private offset: PixelOffset, private cell: Cell) {
        this.width = this.renderSettings.viewPort.pixelWidth / this.renderSettings.viewPort.cellsPerWidth;
        this.height = this.width;
        this.topLeft = {
            x: cell.position.column * this.width + this.offset.x,
            y: cell.position.row * this.height + this.offset.y
        };
        this.bottomLeft = {
            x: this.topLeft.x,
            y: this.topLeft.y + this.height
        };
        this.bottomRight = {
            x: this.topLeft.x + this.width,
            y: this.topLeft.y + this.height
        };
        this.topRight = {
            x: this.topLeft.x + this.width,
            y: this.topLeft.y
        };

        this.right = this.topRight.x;
        this.left = this.topLeft.x;
        this.top = this.topLeft.y;
        this.bottom = this.bottomLeft.y;
    }
}