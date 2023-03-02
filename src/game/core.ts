export class DynablasterGame {
    private state: GameState;
    private renderer: GameRenderer;
    private logic: GameLogic;

    constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D, private settings: GameSettings) {
        this.state = new GameState();
        this.renderer = new GameRenderer(this.state, context, settings);
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

export class GameState {
    public level: Level;
    public dyna: Dyna;

    constructor() {
        this.level = this.generateLevel(12, 12);
        this.dyna = this.generateDyna(0, 4);
    }

    private generateLevel(rows: number, columns: number): Level {
        const level: Level = {
            dimensions: {
                rows,
                columns
            },
            rows: []
        };
        for (let r=0; r<rows; r++) {
            const row: Row = {
                columns: []
            }
            for (let c=0; c<columns; c++) {
                const cellPosition: Position = { row: r, column: c };
                const cell: Cell = {
                    position: cellPosition           
                }

                row.columns.push({cell});
            }
            
            level.rows.push(row);
        }

        return level;
    }

    private generateDyna(row: number, column: number): Dyna {
        return {
            position: {
                row,
                column
            }
        };
    }
}

interface Level {
    dimensions: LevelDimensions;
    rows: Row[];
}

interface LevelDimensions {
    rows: number;
    columns: number;
}

interface Row {
    columns: Column[];
}

interface Column {
    cell: Cell;
}

interface Position {
    row: number;
    column: number;
}

function samePosition(a?: Position, b?: Position) {
    if (!a || !b) return false;
    return a.row == b.row && a.column == b.column;
}

function withinBounds(pos: Position, dimensions: LevelDimensions) {
    return pos.row >= 0 && pos.row < dimensions.rows && pos.column >= 0 && pos.column < dimensions.columns;
}

interface Dyna {
    position: Position;
}

interface Cell {
    position: Position;
}

class GameLogic {
    private keydownHandler?: (this: Window, ev: KeyboardEvent) => any;

    constructor(private state: GameState) {}

    public init() {
        this.keydownHandler = this.handleKeyDownFactory();
        window.addEventListener("keydown", this.keydownHandler);
    }

    public destroy() {
        if (this.keydownHandler) {
            window.removeEventListener("keydown", this.keydownHandler);
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
        let newPosition = Object.assign({}, this.state.dyna.position);
        newPosition.row += drow;
        newPosition.column += dcolumn;

        if (withinBounds(newPosition, this.state.level.dimensions)) {
            this.state.dyna.position = newPosition;
        }
    }
}

class GameRenderer {
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

class Render {
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

interface RenderSettings {
    viewPort: ViewPortSettings;
}

interface ViewPortSettings {
    pixelWidth: number;
    pixelHeight: number;
    cellsPerWidth: number;
}

class CellDimensions {
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

class CellContent {
    text: string;
    textColor: string;
    backgroundColor: string;

    constructor(private state: GameState, private cell: Cell) {
        this.text = `(${cell.position.row}, ${cell.position.column})`;

        if (samePosition(state.dyna.position, cell.position)) {
            this.text += "*";
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

interface PixelPosition {
    x: number;
    y: number;
}

interface PixelOffset {
    x: number;
    y: number;
}

export interface GameSettings {
    dimensions: GameDimensions;
    graphics?: GraphicsSettings;
}

export interface GameDimensions {
    width: number;
    height: number;
}

export interface GraphicsSettings {
    fps?: number;
}