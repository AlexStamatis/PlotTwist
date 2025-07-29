import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating-modal',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './star-rating-modal.component.html',
  styleUrl: './star-rating-modal.component.css'
})
export class StarRatingModalComponent {
 @Input() item: any;
 @Output() rate = new EventEmitter<number>();
 @Output() close = new EventEmitter<void>();

  selectedRating = 0;

 setRating(value:number) {
  this.selectedRating = value;
 }

 submitRating() {
  if(this.selectedRating > 0) {
    this.rate.emit(this.selectedRating);
    this.close.emit();
  }
 }

 cancel() {
  this.close.emit()
 }
 
}
