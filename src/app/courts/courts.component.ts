import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Court } from '../models';

@Component({
  selector: 'app-courts',
  standalone: true,
  templateUrl: './courts.component.html'
})
export class CourtsComponent {
  @Input({ required: true }) courts: Court[] = [];
  @Input() reservationsForCourt: (index: number) => number = () => 0;
  @Output() editCourt = new EventEmitter<number>();
  @Output() addCourt = new EventEmitter<void>();
  @Output() toggleCourt = new EventEmitter<number>();
}
