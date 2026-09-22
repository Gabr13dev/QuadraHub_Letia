import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Booking, Court, ModalType } from '../models';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reservation-modal.component.html'
})
export class ReservationModalComponent {
  @Input() modal: ModalType = null;
  @Input({ required: true }) courts: Court[] = [];
  @Input({ required: true }) hours: string[] = [];
  @Input() courtHourlyRate = 80;
  @Input() selectedCourt = 0;
  @Input() selectedStart = 0;
  @Input() selectedBooking: Booking | null = null;
  @Input() clientName = '';
  @Input() duration = 1;
  @Input() recurring = false;
  @Input() paid = false;
  @Input() editingCourt = -1;
  @Input() courtName = '';
  @Input() courtType = '';
  @Input() courtOpen = '08:00';
  @Input() courtClose = '22:00';
  @Output() clientNameChange = new EventEmitter<string>();
  @Output() durationChange = new EventEmitter<number>();
  @Output() recurringChange = new EventEmitter<boolean>();
  @Output() paidChange = new EventEmitter<boolean>();
  @Output() courtNameChange = new EventEmitter<string>();
  @Output() courtTypeChange = new EventEmitter<string>();
  @Output() courtOpenChange = new EventEmitter<string>();
  @Output() courtCloseChange = new EventEmitter<string>();
  @Output() courtHourlyRateChange = new EventEmitter<number>();
  @Output() saveBooking = new EventEmitter<void>();
  @Output() saveDetails = new EventEmitter<void>();
  @Output() saveCourt = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  total(booking: Booking): number {
    return (booking.end - booking.start) * (this.courts[booking.court]?.hourlyRate ?? 0);
  }
}
