import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  show: boolean; // Controla cuando se ve la sidebar
  mobileQuery: MediaQueryList;

  @ViewChild("sidenav") private sidenav: any;

  private _mobileQueryListener: () => void;

  constructor(private _sidebarServ: SidebarService,
              private _authServ: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) {
    this.show = true;
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this._sidebarServ.show.subscribe((val) => {
        this.show = val;
    });
  }

  public logout(): void {
    this._authServ.logout();
  }
}
