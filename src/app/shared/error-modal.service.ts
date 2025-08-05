import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {

  showError(message: string) {
    const modalElement = document.getElementById('errorModal');
    const messageElement = document.getElementById('errorModalMessage');

    if ( modalElement && messageElement) {
      messageElement.textContent = message;

      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  constructor() { }
}
