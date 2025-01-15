import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext'
import { Button } from 'primeng/button'
import { Password } from 'primeng/password'
import { AuthService } from '@/app/services/auth.service';
import { LoginRequest } from '@/app/model/request/loginRequest';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputText, Button, Password],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly messageService = inject(MessageService)
  private readonly router = inject(Router)

  loginForm: FormGroup
  loading = signal(false)

  constructor() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    const data: LoginRequest = this.loginForm.value
    this.authService.login(data).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid credentials',
          sticky: true
        })
      }
    })
  }
}
