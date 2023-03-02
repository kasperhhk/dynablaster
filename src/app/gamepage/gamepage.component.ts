import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DynablasterGame } from '../../game/core';

@Component({
  selector: 'app-gamepage',
  templateUrl: './gamepage.component.html',
  styleUrls: ['./gamepage.component.scss']
})
export class GamepageComponent implements OnInit, AfterViewInit {

    @ViewChild("game")
    canvas?: ElementRef<HTMLCanvasElement>;
    game?: DynablasterGame;

    width = 640;
    height = 480;
    
    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (!this.canvas)
            throw new Error("Canvas missing");

        const canvasContext = this.canvas.nativeElement.getContext("2d");
        if (!canvasContext)
            throw new Error("Could not create 2d graphics for canvas");

        this.game = new DynablasterGame(this.canvas.nativeElement, canvasContext, {
            dimensions: {width: this.width, height: this.height}
        });
        this.game.init();
    }
}
