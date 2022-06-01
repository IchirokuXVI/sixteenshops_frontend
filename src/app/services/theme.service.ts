import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public theme: BehaviorSubject<string>;
  public $theme: Observable<string>;

  constructor(private _cookieServ: CookieService) {
    this.theme = new BehaviorSubject<string>(this.getCurrentTheme() || 'dark');
    this.$theme = this.theme.asObservable();
  }

  public setTheme(theme: string): void {
    this.theme.next(theme);
    localStorage.setItem("currentTheme", theme);

    // Cannot re-assign PrimeNG css so the page needs to reload
    // location.reload();
  }

  private getCurrentTheme(): string | null {
    return localStorage.getItem("currentTheme");
  }
}
