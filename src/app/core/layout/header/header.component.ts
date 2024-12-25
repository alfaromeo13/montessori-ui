import { Component, HostListener, inject, InjectionToken, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser, NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private platform: InjectionToken<string> = inject(PLATFORM_ID) as InjectionToken<string>;
  isNavbarFixed: WritableSignal<boolean> = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platform)) {
      const scrollY: number = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isNavbarFixed.set(scrollY > 10);
    }
  }
}
