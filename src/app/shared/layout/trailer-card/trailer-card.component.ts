import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trailer-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './trailer-card.component.html',
  styleUrl: './trailer-card.component.css'
})
export class TrailerCardComponent {
  @Input() trailer!: {
    key: string;
    title: string;
    poster: string;
  }

  constructor(private ngbModal: NgbModal) {

  }

  openTrailerModal() {

  }

  get thumbnailUrl() {
    return `https://img.youtube.com/vi/${this.trailer.key}/hqdefault.jpg`
  }

  get videoUrl() {
    return `https://www.youtube.com/watch?v=${this.trailer.key}`;
  }
}
