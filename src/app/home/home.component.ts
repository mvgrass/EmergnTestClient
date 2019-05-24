import { Component, OnInit } from '@angular/core';

import {DatarequestService} from '../datarequest.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {promise} from 'selenium-webdriver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private selfProfile = {login:'', name:'', email:''};

  users: Object;

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
      }
    })
  }

  onEdit(){
  }

  onDelete(){
    const dialogRef = this.dialog.open(DeleteAccountDialog)

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  onLogout() {
    this.datarequestService.logout();
    this.router.navigateByUrl('/login');
  }

  onSearch() {

  }

  ngOnInit() {
    this.datarequestService.getUsers().subscribe(response => {console.log(response); this.users = response}, error1 => {this.datarequestService.logout();})
  }

}

@Component({
  selector: 'delete-account-dialog',
  templateUrl: 'delete.dialog.html',
})
export class DeleteAccountDialog {}
