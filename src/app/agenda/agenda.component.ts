import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Booking, Court, MonthlyMember } from '../models';

type AgendaMode = 'day' | 'week';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agenda.component.html'
})
export class AgendaComponent implements OnInit, OnDestroy {
  @Input({ required: true }) courts: Court[] = [];
  @Input({ required: true }) bookings: Booking[] = [];
  @Input() hours: string[] = [];
  @Input() monthlyMembers: MonthlyMember[] = [];
  @Output() newBooking = new EventEmitter<{ court: number; start: number }>();
  @Output() showBooking = new EventEmitter<Booking>();
  @Output() togglePayment = new EventEmitter<number>();

  mode: AgendaMode = 'day';
  periodOffset = 0;
  courtFilter = -1;
  currentMinutes = 0;
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateCurrentTime();
    this.clockTimer = setInterval(() => this.updateCurrentTime(), 60_000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  private updateCurrentTime(): void {
    const now = new Date();
    this.currentMinutes = now.getHours() * 60 + now.getMinutes();
  }

  isCurrentHour(index: number): boolean {
    const start = 7 * 60 + index * 60;
    return this.currentMinutes >= start && this.currentMinutes < start + 60;
  }

  isPastHour(index: number, day = 0): boolean {
    return this.periodOffset === 0 && day === 0 && this.currentMinutes >= 7 * 60 + (index + 1) * 60;
  }

  currentLineTop(): string {
    const start = 7 * 60;
    const minutesIntoHour = (this.currentMinutes - start) % 60;
    return `${Math.max(0, Math.min(100, (minutesIntoHour / 60) * 100))}%`;
  }

  get visibleCourts(): Court[] {
    return this.courtFilter < 0 ? this.courts : this.courts.filter((_, index) => index === this.courtFilter);
  }

  get periodDate(): Date {
    const date = new Date();
    const days = this.mode === 'week' ? 7 : 1;
    date.setDate(date.getDate() + this.periodOffset * days);
    return date;
  }

  get periodLabel(): string {
    const date = this.periodDate;
    if (this.mode === 'week') {
      const end = new Date(date);
      end.setDate(end.getDate() + 6);
      return `${date.getDate()}–${end.getDate()} ${end.toLocaleDateString('pt-BR', { month: 'short' })} ${end.getFullYear()}`;
    }
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  total(booking: Booking): number {
    return (booking.end - booking.start) * (this.courts[booking.court]?.hourlyRate ?? 0);
  }

  bookingAt(court: number, start: number): Booking | undefined {
    return this.bookings.find((item) => item.court === court && item.start === start);
  }

  occupiedBy(court: number, start: number): boolean {
    return !!this.monthlyAt(court, start) || this.bookings.some((item) => item.court === court && start > item.start && start < item.end);
  }

  setMode(mode: AgendaMode): void {
    this.mode = mode;
    this.periodOffset = 0;
  }

  movePeriod(amount: number): void {
    this.periodOffset += amount;
  }

  isToday(): boolean {
    return this.periodOffset === 0;
  }

  goToday(): void {
    this.periodOffset = 0;
  }

  dateForDay(day: number): Date {
    const date = new Date(this.periodDate);
    date.setDate(date.getDate() + day);
    return date;
  }

  dayLabel(day: number): string {
    return this.dateForDay(day).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
  }

  bookingsForCourt(index: number): Booking[] {
    return this.bookings.filter((booking) => booking.court === index);
  }

  weekBookingsAt(day: number, start: number): Booking[] {
    return day === 0
      ? this.bookings.filter((booking) => booking.start === start && (this.courtFilter < 0 || booking.court === this.courtFilter))
      : [];
  }

  weekBookingAt(day: number, court: number, start: number): Booking | undefined {
    return day === 0
      ? this.bookings.find((booking) => booking.court === court && booking.start === start)
      : undefined;
  }

  monthlyAt(court: number, start: number, day = 0): MonthlyMember | undefined {
    return this.monthlyMembers.find((member) => member.active && member.court === court && member.weekday === this.dateForDay(day).getDay() && start >= member.start && start < member.end);
  }

  weekCourtIndexes(): number[] {
    return this.courtFilter >= 0
      ? [this.courtFilter]
      : this.courts.map((_, index) => index);
  }
}
