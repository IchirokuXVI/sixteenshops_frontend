import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _show: BehaviorSubject<boolean>;

  // The service won't use cookies and the sidebar
  // will hide or open when reaching certain breakpoint
  private _smallScreen: boolean;

  constructor(private _cookieServ: CookieService,
              private breakpointObserver: BreakpointObserver) {
    this._show = new BehaviorSubject<boolean>(this.isSidebarShownCookie());

    this._smallScreen = breakpointObserver.isMatched([Breakpoints.Small, Breakpoints.XSmall]);

    // Keeps updated the smallScreen variable
    // Hide the sidebar when the screen is too small
    // And restores it (either open or close) when
    // going back to a bigger width
    this.breakpointObserver.observe("(max-width: 960px)")
    .subscribe(result => {
      if (result.matches) {
        this._smallScreen = true;
        this.setState(false);
      } else if (!result.matches) {
        this._smallScreen = false;
        this.restoreState();
      }
    });
  }

  public toggle(): void {
    let shown = this._show.value;
    this._show.next(!shown);
    // Cookies aren't saved on small devices
    // because it would be weird to start
    // the app with the sidebar open
    if (!this._smallScreen)
      localStorage.setItem("showSidebar", String(!shown));
  }

  public setState(state: boolean): void {
    this._show.next(state);
    // Cookies aren't saved on small devices
    // because it would be weird to start
    // the app with the sidebar open
    if (!this._smallScreen)
      localStorage.setItem("showSidebar", String(state));
  }

  public restoreState() {
    this._show.next(this.isSidebarShownCookie());
  }

  public get show(): Observable<boolean> {
    return this._show;
  }

  public get smallScreen(): boolean {
    return this._smallScreen;
  }

  private isSidebarShownCookie(): boolean {
    return localStorage.getItem("showSidebar") === 'false' ? false : true;
  }
}
