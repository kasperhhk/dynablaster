import { GameState } from '../gamestate';
import { CellContent } from './cell-content';
import { CellDimensions } from './cell-dimensions';
import { PixelOffset, RenderSettings } from './models';

export class Render {
    private offset: PixelOffset;

    constructor(private context: CanvasRenderingContext2D, private renderSettings: RenderSettings, private state: GameState) {
        this.offset = this.calculateOffset();
    }

    private calculateOffset(): PixelOffset {
        const dynaPosition = this.state.dyna.position;
        const dynaCell = this.state.level.rows[dynaPosition.row].columns[dynaPosition.column].cell;
        const topLeft = this.state.level.rows[0].columns[0].cell;
        const bottomRight = this.state.level.rows[this.state.level.dimensions.rows-1].columns[this.state.level.dimensions.columns-1].cell;

        const zeroOffset = { x: 0, y: 0};
        const dynaZeroDimensions = new CellDimensions(this.renderSettings, zeroOffset, dynaCell);
        const bottomRightZeroDimensions = new CellDimensions(this.renderSettings, zeroOffset, bottomRight);

        const centerOffset = { 
            x: this.renderSettings.viewPort.pixelWidth/2 - dynaZeroDimensions.left - dynaZeroDimensions.width/2,
            y: this.renderSettings.viewPort.pixelHeight/2 - dynaZeroDimensions.top - dynaZeroDimensions.height/2
        };
        const topLeftCenterDimensions = new CellDimensions(this.renderSettings, centerOffset, topLeft);
        const bottomRightCenterDimensions = new CellDimensions(this.renderSettings, centerOffset, bottomRight);

        const boundedOffset = Object.assign({}, centerOffset);
        if (topLeftCenterDimensions.left > 0) {
            boundedOffset.x = 0;
        }
        if (topLeftCenterDimensions.top > 0) {
            boundedOffset.y = 0;
        }        
        if (bottomRightCenterDimensions.right < this.renderSettings.viewPort.pixelWidth)  {
            boundedOffset.x = this.renderSettings.viewPort.pixelWidth - bottomRightZeroDimensions.right;
        }
        if (bottomRightCenterDimensions.bottom < this.renderSettings.viewPort.pixelHeight) {
            boundedOffset.y = this.renderSettings.viewPort.pixelHeight - bottomRightZeroDimensions.bottom;
        }

        return boundedOffset;
    }

    render() {
        this.context.clearRect(0, 0, this.renderSettings.viewPort.pixelWidth, this.renderSettings.viewPort.pixelHeight);
        this.renderGrid();
    }

    private renderGrid() {
        for (let row of this.state.level.rows) {
            for (let columns of row.columns) {
                const content = new CellContent(this.state, columns.cell);
                const dimensions = new CellDimensions(this.renderSettings, this.offset, columns.cell);
                this.renderCell(dimensions, content);
            }
        }
    }

    private renderCell(dimensions: CellDimensions, content: CellContent) {
        this.context.fillStyle = content.backgroundColor;
        this.context.fillRect(dimensions.topLeft.x, dimensions.topLeft.y, dimensions.width, dimensions.height);

        this.context.strokeStyle = "black";
        this.context.lineWidth = 1;
        this.context.strokeRect(dimensions.topLeft.x, dimensions.topLeft.y, dimensions.width, dimensions.height);

        this.context.fillStyle = content.textColor;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.font = "15px serif";
        this.context.fillText(content.text, dimensions.topLeft.x + (dimensions.width/2), dimensions.topLeft.y + (dimensions.height/2));
    }
}