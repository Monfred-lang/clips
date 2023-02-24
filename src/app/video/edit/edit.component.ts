import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Your clip is being updated'

  title = new FormControl('', [Validators.required, Validators.minLength(3)])
  clipID = new FormControl('', {nonNullable: true})

  editForm = new FormGroup({
    title : this.title,
    id : this.clipID
  })

  @Input() activeClip : IClip | null = null
  @Output() update = new EventEmitter()

  constructor(private modal: ModalService, private clipService: ClipService) {

  }

  ngOnInit(): void {
    this.modal.register('editModal')
  }
  
  ngOnDestroy(): void {
    this.modal.unregister('editModal')
  }

  ngOnChanges() {
    if(!this.activeClip){ return }
    this.showAlert = false
    this.inSubmission = false
    this.title.setValue(this.activeClip.title)
    this.clipID.setValue(this.activeClip.docId as string)
  }

  async submit(){
    if(!this.activeClip){
      return
    }
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Your clip is being updated'
    
    try {      
      await this.clipService.updateClip(this.clipID.value, this.title.value as string)
    } catch (error) {
      this.inSubmission = false
      this.showAlert = true
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong! Please try again later.'
      return
    }
    this.activeClip.title = this.title.value as string
    this.update.emit(this.activeClip)
    this.inSubmission = false
    this.showAlert = true
    this.alertColor = 'green'
    this.alertMsg = 'Success'
  }

  

}
