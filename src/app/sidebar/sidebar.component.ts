import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppView } from '../models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() view: AppView = 'overview';
  @Output() viewChange = new EventEmitter<AppView>();
}
