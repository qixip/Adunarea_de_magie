import { Component } from '@angular/core';

type GalleryCategory = 'all' | 'turnee' | 'draft' | 'prerelease' | 'commander';

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  activeCategory: GalleryCategory = 'all';
  readonly categories: GalleryCategory[] = ['all', 'turnee', 'draft', 'prerelease', 'commander'];

  setCategory(cat: GalleryCategory): void {
    this.activeCategory = cat;
  }

  getCategoryLabel(cat: GalleryCategory): string {
    const labels: Record<GalleryCategory, string> = {
      all: 'Toate', turnee: 'Turnee', draft: 'Draft',
      prerelease: 'Prerelease', commander: 'Commander'
    };
    return labels[cat];
  }
}