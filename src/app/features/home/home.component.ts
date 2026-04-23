import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialLink } from '../../shared/models/social-link.model';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;


  readonly socialLinks: SocialLink[] = [
    { name: 'Instagram', icon: 'fab fa-instagram',  url: 'https://www.instagram.com/adunareademagie?igsh=cjRuOXAyNnR0czM2', label: '@adunareademagie', color: '#E1306C' },
    { name: 'Facebook',  icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/share/1CiapimiNj/',   label: 'Adunarea de Magie', color: '#1877F2' },
    { name: 'YouTube',   icon: 'fab fa-youtube',    url: 'https://youtube.com/@adunareademagie?si=lmcdmswLb4LGvd3B', label: '@adunareademagie', color: '#FF0000' },
    { name: 'WhatsApp',  icon: 'fab fa-whatsapp',   url: 'https://chat.whatsapp.com/HOwTQ5cA6mt3OgtiaEFt3j', label: 'Join Group Chat', color: '#25D366' },
    { name: 'Discord',   icon: 'fab fa-discord',    url: 'https://discord.gg/ZnXaK2EH', label: 'Discord Server', color: '#5865F2' }
  ];

  constructor(private fb: FormBuilder, private contactSvc: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      phone:   [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitError = null;

    const { name, email, message } = this.contactForm.value;
    this.contactSvc.send({ name, email, message }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        setTimeout(() => { this.submitSuccess = false; }, 5000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.error ?? 'Eroare la trimitere. Încearcă din nou.';
      }
    });
  }
}