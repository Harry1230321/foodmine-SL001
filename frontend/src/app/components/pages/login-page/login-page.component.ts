import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;
  returnUrl ='';
  constructor(private formBuilder:FormBuilder
    , private userService:UserService
  ,private activatedRoute:ActivatedRoute
  , private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.return;//?returnUrl=/checkout
  }

  get fc() {
    return this.loginForm.controls;

  }

  submit() { 
    this.isSubmitted = true;
    if(this.loginForm.invalid) return;
    
    const loginData = {
      email: this.fc.email.value,
      password: this.fc.password.value
    };
    
    console.log('Submitting login data:', loginData);
    
    this.userService.login(loginData).subscribe({
      next: (user) => {
        this.router.navigateByUrl(this.returnUrl || '/');
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
}
}
