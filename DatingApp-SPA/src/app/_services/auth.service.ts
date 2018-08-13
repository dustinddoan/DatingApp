import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  // photoUrl with initial value
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  // update photoUrl with the next value
  changeMemberPhoto(newPhotoUrl: string) {
    this.photoUrl.next(newPhotoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const loginUser = response;

          if (loginUser) {
            localStorage.setItem('token', loginUser.token);
            localStorage.setItem('user', JSON.stringify(loginUser.user));
            this.decodedToken = this.jwtHelper.decodeToken(loginUser.token);
            this.currentUser = loginUser.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
            console.log(this.decodedToken);
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register',  model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');

    return !this.jwtHelper.isTokenExpired(token);
  }
}
