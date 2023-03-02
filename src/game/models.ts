export interface Level {
    dimensions: LevelDimensions;
    rows: Row[];
}

export interface LevelDimensions {
    rows: number;
    columns: number;
}

export interface Row {
    columns: Column[];
}

export interface Column {
    cell: Cell;
}

export interface Position {
    row: number;
    column: number;
}

export interface Dyna {
    alive: boolean;
    position: Position;
}

export interface DeltaPosition {
    drow: number;
    dcolumn: number;
}

export interface Cell {
    position: Position;
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