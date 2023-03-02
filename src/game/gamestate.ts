import { Enemy } from './logic/enemy';
import { Cell, Dyna, Level, Position, Row } from './models';
import { samePosition } from './util';

export class GameState {
    public level: Level;
    public dyna: Dyna;
    public enemies: Enemy[];

    constructor() {
        this.level = this.generateLevel(7, 9);
        this.dyna = this.generateDyna(0, 4);
        this.enemies = this.generateEnemies(5);
    }
    
    private generateEnemies(amount: number) {
        const enemies: Enemy[] = [];
        for (let i=0; i<amount; i++) {
            let enemy = this.generateEnemy();
            if (samePosition(enemy.position, this.dyna.position)) {
                enemy = this.generateEnemy();
            }
            if (!samePosition(enemy.position, this.dyna.position)) {
                enemies.push(enemy);
            }
        }

        return enemies;
    }

    private generateEnemy(): Enemy {
        const enemy = new Enemy(this, {
            row: Math.floor(Math.random() * this.level.dimensions.rows),
            column: Math.floor(Math.random() * this.level.dimensions.columns)
        }, 800);

        return enemy;
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
            alive: true,
            position: {
                row,
                column
            }
        };
    }
}