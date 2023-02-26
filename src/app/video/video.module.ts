import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafeURLPipe } from './pipes/safe-url.pipe';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';


@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent,
    EditComponent,
    SafeURLPipe,
    DeleteModalComponent
  ],
  imports: [
    CommonModule,
    VideoRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class VideoModule { }
