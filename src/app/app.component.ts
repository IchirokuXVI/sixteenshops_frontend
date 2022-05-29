import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sixteenshops_frontend';

  constructor(private _themeService: ThemeService,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2
  ) { }

  ngOnInit(): void {
      let prevTheme: string;
      this._themeService.theme.subscribe((theme) => {
        if (prevTheme)
          this.renderer.removeClass(this.document.body, prevTheme + '-theme');

        this.renderer.addClass(this.document.body, theme + '-theme');
        prevTheme = theme;
      });
  }
}
