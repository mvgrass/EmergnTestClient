import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DatarequestService} from '../datarequest.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  triedLogin = false;

  constructor(private datarequestService: DatarequestService, private router: Router) {
    if(datarequestService.authenticated)
      router.navigateByUrl("/");

    this.loginForm = this.createFormGroup();
  }

  onLogin() {
    if(!this.loginForm.valid)
      return;

    this.datarequestService.authenticate(this.loginForm.value,
      () => this.router.navigateByUrl("/"),
      () => {this.loginForm.reset(); this.triedLogin = true;});
  }

  onRegister() {
    this.router.navigateByUrl("/register");
  }

  createFormGroup(){
    return new FormGroup({
      login: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }

  ngOnInit() {
  }

}
