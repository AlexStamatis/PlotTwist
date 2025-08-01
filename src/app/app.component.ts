import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from "./shared/layout/footer/footer.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PlotTwist';
}
