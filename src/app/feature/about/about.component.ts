import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  styleUrls: [ './about.component.scss' ]
})
export class AboutComponent implements OnInit, OnDestroy {
  counter: number = 0;
  targetValue: number = 55;
  intervalId: any;
  hideAnimation: boolean = false;

  ngOnInit(): void {
    this.startCounter();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCounter(): void {
    const totalDuration = 5000;
    const initialIncrementTime = totalDuration / this.targetValue;

    const adjustSpeed = (): number => {
      const remainingSteps = this.targetValue - this.counter;
      return Math.max(10, (initialIncrementTime * remainingSteps) / this.targetValue);
    };

    const updateCounter = (): void => {
      if (this.counter < this.targetValue) {
        this.counter++;
        clearInterval(this.intervalId);
        this.intervalId = setInterval(updateCounter, adjustSpeed());
      } else {
        clearInterval(this.intervalId);
      }
    };

    this.intervalId = setInterval(updateCounter, adjustSpeed());
    setTimeout((): void => {
      this.hideAnimation = true;
    }, 4000);
  }
}
