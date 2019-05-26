import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {DatarequestService} from '../datarequest.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.css']
})
export class UpdateDialogComponent implements OnInit {

  triedUpdate = false;

  updateForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, passwordValidator
  );

  constructor(private datarequestService: DatarequestService, private router: Router, public dialogRef: MatDialogRef<UpdateDialogComponent>) {
  }

  ngOnInit() {

    this.datarequestService.getSelfAccount().subscribe((response) => {
      this.updateForm.get('login').setValue(response['login']);
      this.updateForm.get('name').setValue(response['name']);
      this.updateForm.get('email').setValue(response['email']);
    }, error1 => {
      if (error1.status === 401) {
        this.router.navigateByUrl("/login");
      }
    });
  }

  onSubmit() {
    if (!this.updateForm.valid) {
      return;
    }

    this.datarequestService.updateUser({
        login: this.updateForm.value.login,
        password: this.updateForm.value.password,
        name: this.updateForm.value.name,
        email: this.updateForm.value.email
      }).subscribe(
      () => { this.datarequestService.authenticate({
        login: this.updateForm.value.login,
        password: this.updateForm.value.password},
        () => {this.dialogRef.close(); this.router.navigateByUrl('/login'); }, undefined); },
      (error) => {
        if (error.status === 401) {
          this.router.navigateByUrl('/login');
        } else {
          this.triedUpdate = true;
        }
      } );
  }
}

const passwordValidator: ValidatorFn = (fg: FormControl) => {
  const password = fg.get('password');
  const confirmPassword = fg.get('confirmPassword');

  return password.value !== null && confirmPassword.value !== null && password.value === confirmPassword.value
    ? null : {password: true};
};
