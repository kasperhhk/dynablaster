export class DynablasterGame {
    private state: GameState;
    private renderer: GameRenderer;

    constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D, private settings: GameSettings) {
        this.state = new GameState();
        this.renderer = new GameRenderer(this.state, canvas, context, settings);
    }

    public init() {
        this.renderer.init();
    }
}

export class GameState {
    public level: Level;
    public dyna: Dyna;

    constructor() {
        this.level = this.generateLevel(10, 10);
        this.dyna = this.generateDyna(7, 0);
    }

    private generateLevel(rows: number, columns: number): Level {
        const level: Level = {
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
    rows: Row[];
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

interface Dyna {
    position: Position;
}

interface Cell {
    position: Position;
}

class GameRenderer {
    private thread?: NodeJS.Timer;

    private readonly pixelWidth: number;
    private readonly pixelHeight: number;

    private readonly pixelRatio = 10;

    constructor(private state: GameState, private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D, private settings: GameSettings) {
        this.pixelWidth = this.settings.dimensions.width;
        this.pixelHeight = this.settings.dimensions.height;
    }

    public init() {
        this.thread = setInterval(() => {
            //const offset = this.calculateOffset();
            this.renderGrid();
        }, 1000/(this.settings.graphics?.fps || 60));
    }

    private renderGrid() {
        for (let row of this.state.level.rows) {
            for (let columns of row.columns) {
                const content = new CellContent(this.state, columns.cell);
                this.renderCell(new RenderCell(this.pixelWidth, this.pixelRatio, columns.cell, content));
            }
        }
    }

    private renderCell(cell: RenderCell) {
        this.context.lineWidth = 1;
        this.context.strokeRect(cell.topLeft.x, cell.topLeft.y, cell.width, cell.height);

        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.font = "15px serif";
        this.context.fillText(cell.content.text, cell.topLeft.x + (cell.width/2), cell.topLeft.y + (cell.height/2));
    }
}

class RenderCell {
    topLeft: PixelPosition;
    width: number;
    height: number;

    constructor(canvasWidth: number, pixelRatio: number, private cell: Cell, public content: CellContent) {
        this.width = canvasWidth / pixelRatio;
        this.height = this.width;
        this.topLeft = {
            x: cell.position.column * this.width,
            y: cell.position.row * this.height
        };
    }
}

class CellContent {
    text: string;

    constructor(private state: GameState, private cell: Cell) {
        this.text = `(${cell.position.row}, ${cell.position.column})`;

        if (samePosition(state.dyna.position, cell.position)) {
            this.text += "*";
        }
    }
}

interface PixelPosition {
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