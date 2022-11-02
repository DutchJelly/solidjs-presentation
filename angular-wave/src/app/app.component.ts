import { Component } from '@angular/core';
import { map, Observable, bufferCount, throttleTime } from 'rxjs';

const ITEM_COUNT = 3000;
const STEP_SIZE = 0.1;
const BAR_SIZE = 0.01;
const FPS_COUNT_BUFFER_SIZE = 10;
const FPS_COUNT_INTERVAL = 100;

const getFrameEmitter: () => Observable<[number, number]> = () => {
  return new Observable((subscriber) => {
    let i = 0;
    let id = NaN;

    let previousFrame = Date.now();

    const step = () => {
      const currentFrame = Date.now();
      subscriber.next([i++, currentFrame - previousFrame]);
      previousFrame = currentFrame;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(id);
    };
  });
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  frames$ = getFrameEmitter();

  values$ = this.frames$.pipe(
    map(([index]) => index * STEP_SIZE),
    map((offset) => {
      return Array.from({ length: ITEM_COUNT }, (_, i) =>
        Math.floor((Math.sin(offset + i * BAR_SIZE) + 1) * 50)
      );
    })
  );

  fps$ = this.frames$.pipe(
    map(([_, interval]) => 1000 / interval),
    bufferCount(FPS_COUNT_BUFFER_SIZE),
    throttleTime(FPS_COUNT_INTERVAL),
    map((buffer) =>
      Math.round(
        buffer.reduce((p, c) => {
          return p + c;
        }, 0) / buffer.length
      )
    )
  );
}
