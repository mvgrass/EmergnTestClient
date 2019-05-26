import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatarequestService {

  private domain = "http://localhost:8080";

  authenticated = false;


  constructor(private http: HttpClient) {
    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    if(authenticatedLogin!==null && authenticatedPassword!==null)
      this.authenticated = true;
  }

  authenticate(credentials, positiveCallback, negativeCallback) {

    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    const headers = new HttpHeaders(credentials ? {authorization : 'Basic ' + btoa(credentials.login + ':' + credentials.password)}
      : {authorization : 'Basic ' + btoa(authenticatedLogin + ':' + authenticatedPassword) } );

    this.http.get(this.domain+'/api/users/' + (credentials?credentials.login:authenticatedLogin), {headers : headers}).subscribe(response => {
      if(response['login']){
        this.authenticated = true;
        if(credentials) {
          localStorage.setItem('login', credentials.login);
          localStorage.setItem('password', credentials.password);

        }

        return positiveCallback && positiveCallback();
      }
    }, error => {
      this.authenticated = false;
      localStorage.removeItem('login');
      localStorage.removeItem('password');

      return negativeCallback && negativeCallback();
    });

  }

  register(user, positiveCallback, negativeCallback) {
    this.http.post(this.domain+'/api/users/', user).subscribe(response => {
      if(response['login']){
        return positiveCallback && positiveCallback();
      }
    }, error1 => {
      return negativeCallback && negativeCallback();
    })
  }

  getUsers(login?:string, name?:string, email?:string) {
    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    let params = new HttpParams();
    if(login) {
      params = params.set('login', login);
    }
    if(name) {
      params = params.set('name', name);
    }
    if(email) {
      params = params.set('email', email);
    }

    const headers = new HttpHeaders( {authorization : 'Basic ' + btoa(authenticatedLogin + ':' + authenticatedPassword) } );
    return this.http.get(this.domain+"/api/users/", {headers: headers, params: params});
  }

  getSelfAccount() {
    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    const headers = new HttpHeaders({authorization : 'Basic ' + btoa(authenticatedLogin + ':' + authenticatedPassword) } );
    return this.http.get(this.domain+'/api/users/'+authenticatedLogin, {headers:headers});
  }

  updateUser(user) {
    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    const headers = new HttpHeaders({authorization : 'Basic ' + btoa(authenticatedLogin + ':' + authenticatedPassword) } );
    return this.http.put(this.domain+'/api/users/'+authenticatedLogin, user, {headers:headers});
  }

  deleteUser() {
    const authenticatedLogin = localStorage.getItem('login');
    const authenticatedPassword = localStorage.getItem('password');

    const headers = new HttpHeaders({authorization : 'Basic ' + btoa(authenticatedLogin + ':' + authenticatedPassword) } );

    return this.http.delete(this.domain+'/api/users/'+authenticatedLogin, {headers: headers});
  }

  logout() {
    this.authenticated = false;
    localStorage.removeItem('login');
    localStorage.removeItem('password');
  }

}
