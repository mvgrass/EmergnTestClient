import { Component, OnInit } from '@angular/core';

import {DatarequestService} from '../datarequest.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {error, promise} from 'selenium-webdriver';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UpdateDialogComponent} from '../update-dialog/update-dialog.component';

// @ts-ignore
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public selfProfile = {login:'', name:'', email:''};

  users: Object;

  searchForm = new FormGroup({
    login: new FormControl(''),
    name: new FormControl('',),
    email: new FormControl('')
  });

  constructor(private datarequestService: DatarequestService, private router: Router, public dialog: MatDialog) {
    if(!datarequestService.authenticated) {
      router.navigateByUrl("/login");
    }

    this.datarequestService.getSelfAccount().subscribe(response => {
      if(response['login']){
        this.selfProfile.login = response['login'];
        this.selfProfile.name = response['name'];
        this.selfProfile.email = response['email'];
      }else{
        this.datarequestService.logout();
        this.router.navigateByUrl('/login')
      }
    })
  }

  onEdit(){
    const dialogRef = this.dialog.open(UpdateDialogComponent);
  }

  onDelete(){
    const dialogRef = this.dialog.open(DeleteAccountDialog);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.datarequestService.deleteUser().subscribe(response => {
          this.datarequestService.logout();
          this.router.navigateByUrl('/login');
          }, error1 => {
          if(error1.status == 401){
            this.datarequestService.logout();
            this.router.navigateByUrl('/login');
          }
        });
      }
    });
  }

  onLogout() {
    this.datarequestService.logout();
    this.router.navigateByUrl('/login');
  }

  onSearch() {
    if(!this.searchForm.valid)
      return;
    else{
      this.datarequestService.getUsers(this.searchForm.value['login'],
          this.searchForm.value['name'],
          this.searchForm.value['email']).subscribe(response => {this.users = response},
        error1 => {
            if(error1.status == 401) {
              this.datarequestService.logout();
              this.router.navigateByUrl('/login');
            }
          });
    }
  }

  ngOnInit() {
    this.datarequestService.getUsers().subscribe(response => {this.users = response},
        error1 => {this.datarequestService.logout();this.router.navigateByUrl('/login');});
  }

}

@Component({
  selector: 'delete-account-dialog',
  templateUrl: 'delete.dialog.html',
})
export class DeleteAccountDialog {}
