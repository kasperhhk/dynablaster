export interface PixelPosition {
    x: number;
    y: number;
}

export interface PixelOffset {
    x: number;
    y: number;
}

export interface RenderSettings {
    viewPort: ViewPortSettings;
}

export interface ViewPortSettings {
    pixelWidth: number;
    pixelHeight: number;
    cellsPerWidth: number;
}