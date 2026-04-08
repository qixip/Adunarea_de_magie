import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SocialLink } from '../../../../shared/models/social-link.model';

@Component({
  selector: 'app-home-contact-section',
  standalone: false,
  templateUrl: './home-contact-section.component.html',
  styleUrls: ['./home-contact-section.component.scss']
})
export class HomeContactSectionComponent {
  @Input({ required: true }) contactForm!: FormGroup;
  @Input() isSubmitting = false;
  @Input() submitSuccess = false;
  @Input() submitError: string | null = null;
  @Input() socialLinks: SocialLink[] = [];

  @Output() submitForm = new EventEmitter<void>();

  onSubmit(): void {
    this.submitForm.emit();
  }
}
