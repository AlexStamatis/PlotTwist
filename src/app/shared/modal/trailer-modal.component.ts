import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [],
  templateUrl: './trailer-modal.component.html',
  styleUrl: './trailer-modal.component.css'
})
export class TrailerModalComponent {
  @Input() modalTitle!: string;
  @Input() youtubeUrl!: string;
}
