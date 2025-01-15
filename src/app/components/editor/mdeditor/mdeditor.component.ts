import { ThemeService } from '@/app/services/theme.service';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, schema, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-mdeditor',
  imports: [NgxEditorModule, ReactiveFormsModule],
  templateUrl: './mdeditor.component.html',
  styleUrl: './mdeditor.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MdeditorComponent implements OnInit, OnDestroy, AfterContentChecked{
  private readonly themeService =inject(ThemeService)
  private readonly el =inject(ElementRef)
  private readonly renderer =inject(Renderer2)
  readonly control = input.required<FormControl>();
  //readonly control = input.required<string>()
  editor!: Editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // ['link', 'image'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  ngOnInit(): void {
    this.editor = new Editor({
      content: '',
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
      plugins: [],
      schema, 
      nodeViews: {},
      attributes: {},
      linkValidationPattern: '',
      parseOptions: {},
    })
  }

  ngAfterContentChecked(): void {
    if(this.themeService.getTheme() === 'dark'){
      this.renderer.addClass(this.el.nativeElement, 'dark')
    }else{
      this.renderer.removeClass(this.el.nativeElement, 'dark')
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy()
  }
}
