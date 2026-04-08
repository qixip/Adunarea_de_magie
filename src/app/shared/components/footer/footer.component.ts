import { Component } from '@angular/core';
import { SocialLink } from '../../models/social-link.model';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly socialLinks: SocialLink[] = [
    { name: 'Instagram', icon: 'fab fa-instagram',  url: 'https://www.instagram.com/adunareademagie?igsh=cjRuOXAyNnR0czM2', label: '@adunareademagie', color: '#E1306C' },
    { name: 'Facebook',  icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/share/1CiapimiNj/',   label: 'Adunarea de Magie', color: '#1877F2' },
    { name: 'YouTube',   icon: 'fab fa-youtube',    url: 'https://youtube.com/@adunareademagie?si=lmcdmswLb4LGvd3B', label: '@adunareademagie', color: '#FF0000' },
    { name: 'WhatsApp',  icon: 'fab fa-whatsapp',   url: 'https://chat.whatsapp.com/HOwTQ5cA6mt3OgtiaEFt3j', label: 'Join Group Chat', color: '#25D366' },
    { name: 'Discord',   icon: 'fab fa-discord',    url: 'https://discord.gg/ZnXaK2EH', label: 'Discord Server', color: '#5865F2' }
  ];
}