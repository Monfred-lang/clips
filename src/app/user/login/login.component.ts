import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showAlert = false
  alertMsg = 'Please wait! We are logging you in.'
  alertColor = 'blue'
  inSubmission = false

  email = new FormControl('', [Validators.required, Validators.email])
  password = new FormControl('', Validators.required)

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  })

  constructor(private auth: AngularFireAuth){

  }

ngOnInit(): void {
  
}

async login(){
  console.log(this.loginForm.value)
  this.showAlert = true
  this.alertColor = 'blue'
  this.alertMsg = 'Please wait! We are logging you in.'
  this.inSubmission = true

  try {    
    await this.auth.signInWithEmailAndPassword(
      this.loginForm.value.email as string, this.loginForm.value.password as string
    )
  } catch (error) {
    this.inSubmission = false
    this.alertMsg = 'An unexpected error occured. Please try again later.'
    this.alertColor = 'red'

    console.log(error)

    return
  }
  this.alertMsg = 'Success! You are now logged in.'
  this.alertColor = 'green'
}

}
