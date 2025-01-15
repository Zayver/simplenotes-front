import { NoteResponse } from '@/app/model/response/noteResponse';
import { AfterViewInit, Component, ElementRef, inject, input, OnInit, SecurityContext, signal, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArchive, lucideArchiveRestore, lucideCircleAlert, lucideEllipsis, lucidePackage, lucideTrash } from '@ng-icons/lucide';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { ThemeService } from '@/app/services/theme.service';
import { NoteService } from '@/app/services/note.service';
import { MessageService } from 'primeng/api';
import { finalize, timer } from 'rxjs';
import { Chip } from 'primeng/chip';

@Component({
  selector: 'app-notecard',
  imports: [RouterLink, Button, NgIcon, Popover, Chip],
  templateUrl: './notecard.component.html',
  styleUrl: './notecard.component.scss',
  providers:[provideIcons({lucideEllipsis, lucideArchive, lucideArchiveRestore, lucidePackage, lucideTrash, lucideCircleAlert})]
})
export class NotecardComponent implements AfterViewInit{
  private readonly domSanitazer = inject(DomSanitizer)
  private readonly themeService = inject(ThemeService)
  private readonly noteService = inject(NoteService)
  private readonly messageService = inject(MessageService)

  readonly colorIndex = input<number>(0)
  readonly note = input.required<NoteResponse>()
  deleteConfirm = signal(false)
  loading = signal(false)

  private readonly colors = [
    '#D8E2DC', '#F8EDEB', '#FAE1DD', '#DED6CE', '#FEC5BB', '#F5EBE0'
  ]

  private readonly darkColors = [
    '#374D3B', '#4D472C', '#4D312A', '#3B264D', '#37494D', '#634071'
  ]
 

  @ViewChild('op')
  protected popover!: Popover

  ngAfterViewInit(): void {
    this.popover.onHide.subscribe(()=> this.deleteConfirm.set(false))
  }

  getNoteContent(){
    return this.domSanitazer.sanitize(SecurityContext.HTML, this.note().note)
  }

  getColor(){
    if(this.themeService.getTheme() === 'light'){
      return this.colors[this.colorIndex()]
    }else{
      return this.darkColors[this.colorIndex()]
    }
  }

  showPopover(event: Event){
    event.stopPropagation()
    this.popover.toggle(event)
  }

  setArchiveStatus(status:boolean){
    this.loading.set(true)
    this.noteService.setArchived(this.note().uuid, status).pipe(finalize(()=> this.loading.set(false))).subscribe({
      next:()=>{
        this.note().archived = status
      }
    })
  }

  deleteNote(){
    if(!this.deleteConfirm()){
      this.deleteConfirm.set(true)
      return
    }
    this.loading.set(true)
    this.noteService.deleteNote(this.note().uuid).pipe(finalize(()=> this.loading.set(false))).subscribe({
      next: ()=>{
        this.messageService.add({
          severity:'warn',
          summary: 'Delete successfull'
        })
        timer(1000).subscribe(()=> window.location.reload())
      }
    })
  }
}
