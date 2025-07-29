import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TrailerModalComponent } from '../../modal/trailer-modal.component';

@Component({
  selector: 'app-trailer-card',
  standalone:true,
  imports: [CommonModule, NgbModalModule],
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
   const modalRef = this.ngbModal.open(TrailerModalComponent, {
    size: 'xl',
    centered: true 
  })
   modalRef.componentInstance.modalTitle = this.trailer.title;
   modalRef.componentInstance.youtubeUrl = this.trailer.key;
  }

  get thumbnailUrl() {
    return `https://img.youtube.com/vi/${this.trailer.key}/hqdefault.jpg`
  }

  get videoUrl() {
    return `https://www.youtube.com/watch?v=${this.trailer.key}`;
  }
}
