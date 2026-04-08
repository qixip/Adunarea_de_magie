import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth-register-form',
  standalone: false,
  templateUrl: './auth-register-form.component.html',
  styleUrls: ['./auth-register-form.component.scss']
})
export class AuthRegisterFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Input() success = false;
  @Output() submitForm = new EventEmitter<void>();

  get nameControl(): AbstractControl | null {
    return this.form.get('name');
  }

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
