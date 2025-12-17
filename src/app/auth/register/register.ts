import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private router: Router, private api: Api) { }
  onSubmit(form: NgForm) {
    console.log(form, '---')
    console.log('res---')
    if (!form.valid) {
      console.log(form.valid, '--===-=')
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const fullName = form.value.fullName;

    this.isLoading = true;
    this.error = null;

    if (!form.valid) {
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    this.api.signup({ fullName, email, password }).subscribe((res: any) => {
      if (res.status === '200') {
        this.router.navigate(['/login'])
      }
    }
    )


    setTimeout(() => {
      this.isLoading = false;
      form.reset();
    }, 1500);
  }
  goToLogin() {
    this.router.navigate(['login'])
  }
}
