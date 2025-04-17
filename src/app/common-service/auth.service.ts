import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}


  register(user:any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find((u: any) => u.email === user.email);
    if (userExists) {
      return { success: false, message: 'User already exists' };
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'User registered successfully' };
  }


  login(credentials:any) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );

    if (matchedUser) {
      const fakeToken = btoa(JSON.stringify({ email: matchedUser.email, time: new Date() }));
      localStorage.setItem('token', fakeToken);
      return { success: true };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const token = this.getToken();
    if (token) {
      return JSON.parse(atob(token));
    }
    return null;
  }
}
