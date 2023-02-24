import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() modalId = ''

  constructor( public modal: ModalService, private el: ElementRef) {

  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }  

  closeModal() { 
    this.modal.toggleModal(this.modalId)
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement)
  }

}
