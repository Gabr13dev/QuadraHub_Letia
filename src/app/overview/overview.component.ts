import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking, Court, MonthlyMember } from '../models';

@Component({
  selector: 'app-overview',
  standalone: true,
  templateUrl: './overview.component.html'
})
export class OverviewComponent {
  @Input({ required: true }) courts: Court[] = [];
  @Input({ required: true }) bookings: Booking[] = [];
  @Input() hours: string[] = [];
  @Input() monthlyMembers: MonthlyMember[] = [];
  @Output() newBooking = new EventEmitter<{ court: number; start: number; date: string }>();
  @Output() showBooking = new EventEmitter<Booking>();
  @Output() togglePayment = new EventEmitter<number>();
  selectedDayOffset = 0;

  get selectedDate(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + this.selectedDayOffset);
    return date;
  }

  get selectedDateLabel(): string {
    return this.selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  get selectorDays(): Date[] {
    return [-1, 0, 1, 2, 3].map((offset) => {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + offset);
      return date;
    });
  }

  get compactHours(): Array<{ label: string; index: number }> {
    if (!this.hours.length) {
      return [];
    }

    const currentHour = new Date().getHours();
    const currentIndex = this.hours.findIndex((hour) => Number(hour.slice(0, 2)) === currentHour);
    const centerIndex = currentIndex >= 0 ? currentIndex : 0;
    const start = Math.max(0, centerIndex - 3);
    const end = Math.min(this.hours.length, centerIndex + 4);

    return this.hours.slice(start, end)
      .map((label, offset) => ({
        label,
        index: start + offset
      }))
      .filter((hour) => !this.isPastHour(hour.index) || this.hasBookingInHour(hour.index));
  }

  total(booking: Booking): number {
    return (booking.end - booking.start) * (this.courts[booking.court]?.hourlyRate ?? 0);
  }

  bookingAt(court: number, start: number): Booking | undefined {
    return this.bookings.find((item) => item.court === court && item.start === start && this.bookingDate(item) === this.dateKey(this.selectedDate));
  }

  occupiedBy(court: number, start: number): boolean {
    return !!this.monthlyAt(court, start) || this.bookings.some((item) => item.court === court && this.bookingDate(item) === this.dateKey(this.selectedDate) && start > item.start && start < item.end);
  }

  isPastHour(start: number): boolean {
    if (this.selectedDayOffset !== 0) {
      return false;
    }
    const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    return currentMinutes >= 7 * 60 + (start + 1) * 60;
  }

  hasBookingInHour(start: number): boolean {
    return this.bookings.some((booking) => this.bookingDate(booking) === this.dateKey(this.selectedDate) && booking.start <= start && booking.end > start);
  }

  moveDay(amount: number): void {
    this.selectedDayOffset += amount;
  }

  today(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  selectDay(date: Date): void {
    this.selectedDayOffset = Math.round((date.getTime() - this.today().getTime()) / 86_400_000);
  }

  isSelectedDay(date: Date): boolean {
    return date.getTime() === this.selectedDate.getTime();
  }

  weekdayLabel(date: Date): string {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  }

  dayLabel(date: Date): string {
    return date.getDate().toString();
  }

  dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  bookingDate(booking: Booking): string {
    return booking.date ?? this.dateKey(this.today());
  }

  monthlyAt(court: number, start: number): MonthlyMember | undefined {
    return this.monthlyMembers.find((member) => member.active && member.court === court && member.weekday === this.selectedDate.getDay() && start >= member.start && start < member.end);
  }
}
