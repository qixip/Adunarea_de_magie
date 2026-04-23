import { Component, HostListener, OnDestroy } from '@angular/core';

type GalleryCategory = 'all' | 'turnee' | 'draft' | 'prerelease' | 'commander';
type SpanClass = '' | 'span-wide' | 'span-tall' | 'span-big';

export interface GalleryImage {
  src: string;
  index: number;
  spanClass: SpanClass;
  category: GalleryCategory;
}

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnDestroy {
  activeCategory: GalleryCategory = 'all';
  lightboxIndex: number | null = null;

  readonly categories: GalleryCategory[] = ['all', 'turnee', 'draft', 'prerelease', 'commander'];
  readonly categoryLabels: Record<GalleryCategory, string> = {
    all: 'Toate', turnee: 'Turnee', draft: 'Draft',
    prerelease: 'Prerelease', commander: 'Commander'
  };

  readonly allImages: GalleryImage[] = this.buildImages();

  get filtered(): GalleryImage[] {
    if (this.activeCategory === 'all') return this.allImages;
    return this.allImages.filter(img => img.category === this.activeCategory);
  }

  private buildImages(): GalleryImage[] {
    const imgs: GalleryImage[] = [];
    const spanPattern: SpanClass[] = [
      'span-big', '', '', '', 'span-wide', '', 'span-tall', '', '', ''
    ];
    const catRanges: [number, number, GalleryCategory][] = [
      [1,  28,  'turnee'],
      [29, 55,  'draft'],
      [56, 80,  'prerelease'],
      [81, 100, 'commander'],
    ];
    const getCategory = (n: number): GalleryCategory => {
      for (const [s, e, cat] of catRanges) if (n >= s && n <= e) return cat;
      return 'commander';
    };
    for (let i = 1; i <= 100; i++) {
      imgs.push({
        src: 'assets/images/Foto (' + i + ').jpg',
        index: i - 1,
        spanClass: spanPattern[(i - 1) % spanPattern.length],
        category: getCategory(i),
      });
    }
    imgs.push({
      src: 'assets/images/Winner V3.jpg',
      index: 100,
      spanClass: 'span-big',
      category: 'turnee',
    });
    return imgs;
  }

  setCategory(cat: GalleryCategory): void {
    this.activeCategory = cat;
    this.lightboxIndex = null;
  }

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    document.body.classList.add('modal-open');
  }

  closeLightbox(): void {
    this.lightboxIndex = null;
    document.body.classList.remove('modal-open');
  }

  prev(): void {
    if (this.lightboxIndex === null) return;
    const imgs = this.filtered;
    this.lightboxIndex = (this.lightboxIndex - 1 + imgs.length) % imgs.length;
  }

  next(): void {
    if (this.lightboxIndex === null) return;
    const imgs = this.filtered;
    this.lightboxIndex = (this.lightboxIndex + 1) % imgs.length;
  }

  get lightboxImage(): GalleryImage | null {
    if (this.lightboxIndex === null) return null;
    return this.filtered[this.lightboxIndex] ?? null;
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lightboxIndex === null) return;
    if (e.key === 'Escape')      this.closeLightbox();
    if (e.key === 'ArrowLeft')   this.prev();
    if (e.key === 'ArrowRight')  this.next();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  trackByIndex(_i: number, img: GalleryImage): number { return img.index; }
}
