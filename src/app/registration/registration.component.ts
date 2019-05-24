import { Component, OnInit } from '@angular/core';
import {DatarequestService} from '../datarequest.service';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

// @ts-ignore
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  triedLogin = false;

  registerForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, passwordValidator
  );

  constructor(private datarequestService: DatarequestService, private router: Router) {
    if (datarequestService.authenticated) {
      router.navigateByUrl("/");
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    this.datarequestService.register({
      login: this.registerForm.value.login,
      password: this.registerForm.value.password,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email
      }, () => { this.datarequestService.authenticate({
          login: this.registerForm.value.login,
          password: this.registerForm.value.password}, () => {this.router.navigateByUrl('/')}, undefined) },
      () => {this.registerForm.reset(); this.triedLogin = true; } );
  }

  onCancel() {
    this.router.navigateByUrl("/");
  }

}

const passwordValidator: ValidatorFn = (fg: FormControl) => {
  const password = fg.get('password');
  const confirmPassword = fg.get('confirmPassword');

  return password.value !== null && confirmPassword.value !== null && password.value === confirmPassword.value
    ? null : {password: true};
}
