import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
export type PAGE_THEME = "dark" | "light"
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme: PAGE_THEME = "light"
  
  constructor() {
    const platformId = inject(PLATFORM_ID)
    if(isPlatformBrowser(platformId)){
       this.getThemeFromLocal()
    }
  }

  getTheme(): PAGE_THEME{
    return this.theme
  }

  toggleTheme(){
    if(this.theme === 'dark'){
      this.theme = "light"
    }else{
      this.theme = "dark"
    }
    this.saveTheme()
  }

  private saveTheme(){
    localStorage['theme'] = this.theme
  }

  private getThemeFromLocal(){
    const theme = localStorage['theme']
    theme === undefined ? this.theme = "dark": this.theme = theme
  }
}
