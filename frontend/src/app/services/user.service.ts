import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/user';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          // Make sure the user has a token property
          if (!user.token) {
            console.error('Login response missing token:', user);
          }
          
          // Store user in localStorage
          this.setUserToLocalStorage(user);
          
          // Update the behavior subject with the user
          this.userSubject.next(user);
          
          this.toastrService.success(
            `Welcome to Y&M Foods ${user.name}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          console.error('Login error:', errorResponse);
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          // Make sure the user has a token property
          if (!user.token) {
            console.error('Register response missing token:', user);
          }
          
          // Store user in localStorage
          this.setUserToLocalStorage(user);
          
          // Update the behavior subject with the user
          this.userSubject.next(user);
          
          this.toastrService.success(
            `Welcome to the Y&M Foods ${user.name}`,
            'Register Success!'
          );
        },
        error: (errorResponse) => {
          console.error('Register error:', errorResponse);
          this.toastrService.error(errorResponse.error, 'Registration Failed, Try Again!');
        }
      })
    );
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private getUserFromLocalStorage(): User {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          return user;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem(USER_KEY); // Clear invalid data
        }
      }
    }
    return new User();
  }
}