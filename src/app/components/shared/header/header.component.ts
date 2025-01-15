import { AuthService } from '@/app/services/auth.service';
import { ThemeService } from '@/app/services/theme.service';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {lucideSun, lucideMoon, lucideLogOut } from '@ng-icons/lucide'

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers:[provideIcons({lucideSun, lucideMoon, lucideLogOut})]
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  constructor(){
    const platformId = inject(PLATFORM_ID)
    if(isPlatformBrowser(platformId)){
      this.setTheme()
    }
  }

  protected toggleTheme(){
    this.themeService.toggleTheme()
    this.setTheme()
  }

  protected setTheme(){
    if(this.themeService.getTheme() === 'dark'){
      document.documentElement.classList.add('dark')
      //document.html.classList.add('dark')
    }else{
      document.documentElement.classList.remove('dark')
    }
  }

  protected get themeIcon(){
    return this.themeService.getTheme() === "dark" ? 'lucideMoon' : 'lucideSun'
  }

  protected isLogged(){
    return this.authService.isLogged
  }

  protected logOut(){
    this.authService.logout().subscribe({
      next:()=>{
        this.router.navigate(['/login'])
      }
    })
  }
}
