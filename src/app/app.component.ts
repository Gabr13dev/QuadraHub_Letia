import { Component } from '@angular/core';
import { AgendaComponent } from './agenda/agenda.component';
import { CourtsComponent } from './courts/courts.component';
import { Booking, Court, AppView, ModalType, MonthlyMember } from './models';
import { OverviewComponent } from './overview/overview.component';
import { ReservationModalComponent } from './reservation-modal/reservation-modal.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MonthlyComponent } from './monthly/monthly.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, OverviewComponent, AgendaComponent, CourtsComponent, ReservationModalComponent, MonthlyComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly defaultHourlyRate = 80;
  readonly hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  courts: Court[] = [
    { name: 'Arena 01', sports: ['Beach tennis', 'Futevôlei', 'Vôlei de praia'], hourlyRate: 80, color: '#ffb45c', active: true, open: '08:00', close: '22:00' },
    { name: 'Arena 02', sports: ['Tênis'], hourlyRate: 90, color: '#90c8ff', active: true, open: '08:00', close: '22:00' },
    { name: 'Arena 03', sports: ['Futebol society'], hourlyRate: 180, color: '#c7e85f', active: true, open: '07:00', close: '23:00' }
  ];
  bookings: Booking[] = [
    { court: 0, start: 10, end: 12, name: 'João Pedro', paid: false, recurring: true },
    { court: 1, start: 11, end: 13, name: 'Rafael Lima', paid: true, recurring: false },
    { court: 2, start: 12, end: 13, name: 'Carla Mendes', paid: false, recurring: true }
  ];
  monthlyMembers: MonthlyMember[] = [
    { name: 'João Pedro', court: 0, weekday: 6, start: 10, end: 12, active: true }
  ];
  modal: ModalType = null;
  view: AppView = 'overview';
  selectedCourt = 0;
  selectedStart = 0;
  selectedDate = '';
  selectedBooking: Booking | null = null;
  clientName = '';
  duration = 1;
  recurring = false;
  paid = false;
  editingCourt = -1;
  courtName = '';
  courtType = '';
  courtOpen = '08:00';
  courtClose = '22:00';
  courtHourlyRate = this.defaultHourlyRate;

  navigate(view: AppView): void { this.view = view; }
  openNewBooking(): void {
    const availableCourt = this.courts.findIndex((court, courtIndex) =>
      court.active && this.hours.some((_, hourIndex) =>
        this.isCourtOpen(courtIndex, hourIndex) &&
        !this.bookings.some((booking) => booking.court === courtIndex && hourIndex >= booking.start && hourIndex < booking.end)
      )
    );
    const courtIndex = availableCourt >= 0 ? availableCourt : 0;
    const hourIndex = this.hours.findIndex((_, index) =>
      this.isCourtOpen(courtIndex, index) &&
      !this.bookings.some((booking) => booking.court === courtIndex && index >= booking.start && index < booking.end)
    );
    this.openBooking(courtIndex, hourIndex >= 0 ? hourIndex : 0);
  }
  openCourtForm(index = -1): void {
    this.editingCourt = index;
    const court = index >= 0 ? this.courts[index] : null;
    this.courtName = court?.name ?? ''; this.courtType = court?.sports.join(', ') ?? '';
    this.courtOpen = court?.open ?? '08:00'; this.courtClose = court?.close ?? '22:00';
    this.courtHourlyRate = court?.hourlyRate ?? this.defaultHourlyRate; this.modal = 'court';
  }
  saveCourt(): void {
    if (!this.courtName.trim() || !this.courtType.trim()) return;
    const current = this.editingCourt >= 0 ? this.courts[this.editingCourt] : null;
    const sports = this.courtType.split(',').map((sport) => sport.trim()).filter(Boolean);
    if (!sports.length) return;
    const data: Court = { name: this.courtName.trim(), sports, hourlyRate: Math.max(0, Number(this.courtHourlyRate) || this.defaultHourlyRate), color: current?.color ?? '#c9f25a', active: current?.active ?? true, open: this.courtOpen, close: this.courtClose };
    this.courts = this.editingCourt >= 0 ? this.courts.map((court, i) => i === this.editingCourt ? data : court) : [...this.courts, data];
    this.modal = null;
  }
  toggleCourt(index: number): void { this.courts[index].active = !this.courts[index].active; }
  reservationsForCourt(index: number): number { return this.bookings.filter((booking) => booking.court === index).length; }
  openBooking(court: number, start: number, date = this.todayKey()): void {
    if (!this.isCourtOpen(court, start)) return;
    if (this.bookings.some((item) => (item.date ?? this.todayKey()) === date && item.court === court && start >= item.start && start < item.end)) return;
    this.selectedCourt = court; this.selectedStart = start; this.selectedDate = date; this.clientName = ''; this.duration = 1; this.recurring = false; this.paid = false; this.modal = 'booking';
  }
  openDetails(booking: Booking): void { this.selectedBooking = booking; this.modal = 'details'; }
  saveBooking(): void {
    if (!this.clientName.trim()) return;
    const closeIndex = Math.max(0, Number(this.courts[this.selectedCourt].close.slice(0, 2)) - 7);
    const end = Math.min(this.selectedStart + Math.max(1, this.duration), closeIndex, this.hours.length);
    if (end <= this.selectedStart) return;
    this.bookings = [...this.bookings, { court: this.selectedCourt, date: this.selectedDate, start: this.selectedStart, end, name: this.clientName.trim(), paid: this.paid, recurring: this.recurring }];
    this.modal = null;
  }
  saveDetails(): void { this.modal = null; this.selectedBooking = null; }
  toggleQuickPayment(index: number): void { if (this.bookings[index]) this.bookings[index].paid = !this.bookings[index].paid; }
  closeModal(): void { this.modal = null; this.selectedBooking = null; }
  addMonthlyMember(member: MonthlyMember): void { this.monthlyMembers = [...this.monthlyMembers, member]; }
  toggleMonthlyMember(index: number): void { this.monthlyMembers = this.monthlyMembers.map((member, i) => i === index ? { ...member, active: !member.active } : member); }
  private todayKey(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  private isCourtOpen(court: number, start: number): boolean {
    const item = this.courts[court];
    if (!item) return false;
    const hour = 7 + start;
    return hour >= Number(item.open.slice(0, 2)) && hour < Number(item.close.slice(0, 2));
  }
}
