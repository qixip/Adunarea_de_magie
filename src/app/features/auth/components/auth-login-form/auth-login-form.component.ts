import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth-login-form',
  standalone: false,
  templateUrl: './auth-login-form.component.html',
  styleUrls: ['./auth-login-form.component.scss']
})
export class AuthLoginFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Output() submitForm = new EventEmitter<void>();

  get emailControl(): AbstractControl | null {
    return this.form.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitForm.emit();
    }
  }
}
