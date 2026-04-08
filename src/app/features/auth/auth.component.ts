import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthTab } from './components/auth-tabs/auth-tabs.component';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  activeTab: AuthTab = 'login';
  isLoading = false;
  loginError: string | null = null;
  registerError: string | null = null;
  registerSuccess = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  switchTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.loginError = null;
    this.registerError = null;
    this.registerSuccess = false;
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.loginError = null;
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.isLoading = false;
        this.loginError = 'Email sau parola incorect. Incearca din nou.';
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.registerError = null;
    const { name, email, password } = this.registerForm.value;

    this.auth.register(name, email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.registerSuccess = true;
        this.registerForm.reset();
        setTimeout(() => this.switchTab('login'), 2000);
      },
      error: () => {
        this.isLoading = false;
        this.registerError = 'Nu s-a putut crea contul. Incearca din nou.';
      }
    });
  }
}