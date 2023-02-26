import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit, OnDestroy {

  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being deleted'
  title = ''

  @Input() activeClip : IClip | null = null
  @Output() deleteClipFn = new EventEmitter()

  constructor(private modal: ModalService, private clipService: ClipService) {

  }

  ngOnInit(): void {
    this.modal.register('deleteModal')
  }
  
  ngOnDestroy(): void {
    this.modal.unregister('deleteModal')
  }

  ngOnChanges() {
    if(!this.activeClip){ return }
    this.showAlert = false
    this.inSubmission = false
    this.title = this.activeClip.title
  }

  async deleteClip(clip: IClip | null){
    if(!this.activeClip){
      return
    }
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Your clip is being deleted'
    if(!clip) { return }
    try {
      await this.clipService.deleteClip(clip)      
    } catch (error) {
      return
    }
    this.inSubmission = false
    this.showAlert = true
    this.alertColor = 'green'
    this.alertMsg = 'Success'
    this.deleteClipFn.emit(clip)
  }

  onNoClick() {
    this.modal.toggleModal('deleteModal')
  }


}
