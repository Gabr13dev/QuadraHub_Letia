import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @Output() signIn = new EventEmitter<void>();

  username = '';
  password = '';
  readonly year = new Date().getFullYear();
  passwordVisible = false;
  submit(): void {
    if (!this.username.trim() || !this.password) return;
    this.signIn.emit();
  }
}
