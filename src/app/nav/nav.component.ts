import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user?: string

  constructor( private modal: ModalService, 
    public auth: AuthService, public authUser: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.authUser.user.subscribe(data => {
      if(!data){
        return
      }
      this.user = data?.displayName as string ?? ''
    })
  }

  

  openModal(event: Event) {
    event.preventDefault();
    this.modal.toggleModal('auth');
  }

  async logout(event: Event) {
    await this.auth.logout(event);
    this.user = ''
  }

}
