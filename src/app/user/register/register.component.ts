import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  show = false

  constructor(private auth: AuthService) {

  }

  inSubmission = false

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]);
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required, Validators.maxLength(14)])

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.'
  alertColor = 'blue'
  registerForm = new FormGroup({
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirm_password: this.confirm_password,
      phoneNumber: this.phoneNumber
  })

  async register(){
    if(this.password.value != this.confirm_password.value){
      this.showAlert = true;
      this.alertMsg = 'Incorrect Confirm_Password'
      this.alertColor = 'red'
      this.inSubmission = false
    return
    } 
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'
    this.inSubmission = true
    
    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.log(e)

      this.alertMsg = ' An unexpected error ocurred. Please try again later'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green'
  }

}
