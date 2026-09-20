import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Court, MonthlyMember } from '../models';

@Component({
  selector: 'app-monthly',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './monthly.component.html'
})
export class MonthlyComponent {
  @Input({ required: true }) courts: Court[] = [];
  @Input({ required: true }) members: MonthlyMember[] = [];
  @Output() addMember = new EventEmitter<MonthlyMember>();
  @Output() toggleMember = new EventEmitter<number>();

  form: MonthlyMember = { name: '', court: 0, weekday: 1, start: 10, end: 12, active: true };
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  get activeCount(): number {
    return this.members.filter((member) => member.active).length;
  }

  submit(): void {
    if (!this.form.name.trim() || this.form.end <= this.form.start) return;
    this.addMember.emit({ ...this.form, name: this.form.name.trim() });
    this.form = { ...this.form, name: '', active: true };
  }

  scheduleLabel(member: MonthlyMember): string {
    return `${this.weekdays[member.weekday]} · ${this.time(member.start)}–${this.time(member.end)}`;
  }

  time(index: number): string {
    return `${String(7 + index).padStart(2, '0')}:00`;
  }
}
