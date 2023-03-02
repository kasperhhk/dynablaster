import { LevelDimensions, Position } from './models';

export function samePosition(a?: Position, b?: Position) {
    if (!a || !b) return false;
    return a.row == b.row && a.column == b.column;
}

export function withinBounds(pos: Position, dimensions: LevelDimensions) {
    return pos.row >= 0 && pos.row < dimensions.rows && pos.column >= 0 && pos.column < dimensions.columns;
}