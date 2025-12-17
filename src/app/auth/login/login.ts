import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  isLoginMode: boolean = true;

  // Loading state
  isLoading: boolean = false;

  // Error message
  error: string | null = null;
  constructor(private router: Router, private api: Api) {

  }
  onSubmit(form: NgForm) {
    console.log(form.valid, '----')
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const fullName = '';

    this.isLoading = true;
    this.error = null;

    if (!form.valid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }
    // 🔑 Login logic
    console.log('Logging in with:', email, password);
    this.api.login({ fullName, email, password }).subscribe((res) => {
      this.api.setUser(res);
      this.router.navigate(['/pro'])
      setTimeout(() => {
        this.isLoading = false;
        form.reset();
      }, 1500);
    },
      err => {
        alert('Invalid credentials');
      }
    )
  }

  goToSignUp() {
    this.router.navigate(['signup'])
  }

}
