import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;

  // You might store authentication token or user information here

  login() {
    // Perform authentication and set isAuthenticated to true
    this.isAuthenticated = true;
  }

  logout() {
    // Perform logout and set isAuthenticated to false
    this.isAuthenticated = false;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
