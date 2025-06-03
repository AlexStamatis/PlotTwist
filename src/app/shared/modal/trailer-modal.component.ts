import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SafeUrlPipe } from '../directives/safe-url-pipe.pipe';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './trailer-modal.component.html',
  styleUrl: './trailer-modal.component.css'
})
export class TrailerModalComponent {
  @Input() modalTitle!: string;
  @Input() youtubeUrl!: string;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  onClose() {
    this.ngbActiveModal.close()
  }
}
