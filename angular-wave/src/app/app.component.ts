import { Component } from '@angular/core';
import { map, Observable, bufferCount } from 'rxjs';

const ITEM_COUNT = 2000;
const STEP_SIZE = 0.1;
const BAR_SIZE = 0.01;

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
    map(([_, interval]) => Math.round(10000 / interval) / 10),
    bufferCount(10),
    map((buffer) =>
      buffer.reduce((p, c) => {
        if (p === 0) return c;
        return (p + c) / 2;
      }, 0)
    )
  );

  // values$ = this.animationFrame$.pipe(
  //   map(() => {
  //     this.offset += STEP_SIZE;
  //     return Array.from({ length: ITEM_COUNT }, (_, i) =>
  //       Math.floor((Math.sin(this.offset + i * BAR_SIZE) + 1) * 50)
  //     );
  //   })
  // );
}
