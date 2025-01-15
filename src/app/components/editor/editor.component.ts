import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NoteService } from '@/app/services/note.service';
import { CreateNoteRequest } from '@/app/model/request/createNoteRequest'
import { MdeditorComponent } from './mdeditor/mdeditor.component';
import { delay, finalize, take, timer } from 'rxjs';
import { UUID } from 'crypto';
import { NoteResponse } from '@/app/model/response/noteResponse';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { lucideArchive, lucideArchiveRestore, lucideChartColumnStacked, lucideCircleAlert, lucideTrash } from '@ng-icons/lucide';
import { MultiSelect } from 'primeng/multiselect';
import { CategoryService } from '@/app/services/category.service';
import { Skeleton } from 'primeng/skeleton';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-editor',
  imports: [ReactiveFormsModule, MdeditorComponent, InputText, Button, NgIcon, MultiSelect, Skeleton, AsyncPipe],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  providers: [provideIcons({lucideTrash, lucideArchive, lucideArchiveRestore, lucideChartColumnStacked, lucideCircleAlert})]
})
export class EditorComponent implements OnInit {
  private readonly noteService = inject(NoteService)
  private readonly categoryService = inject(CategoryService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly messageService = inject(MessageService)
  private readonly router = inject(Router)

  createNoteForm!: FormGroup
  note: NoteResponse | undefined
  loading = signal(false)
  deleteConfirm = signal(false)
  categories$ = this.categoryService.getUserCategories()

  ngOnInit(): void {
    this.createNoteForm = this.formBuilder.group({
      "title": ['', Validators.required],
      "note": ['', Validators.required],
      "categories": [[]]
    })

    this.getNoteControl().valueChanges.pipe(take(1), delay(1000)).subscribe({
      next: () => {
        if (this.createNoteForm.get('title')?.value === '') {
          this.createNoteForm.get('title')?.setValue(this.getCurrentDate())
        }
      }
    })
  }

  @Input()
  set noteUUID(noteUUID: UUID | undefined) {
    if (noteUUID === undefined) {
      return
    }
    this.noteService.getNoteByUUID(noteUUID).subscribe({
      next: (n: NoteResponse) => {
        this.note = n
        const {categories, ...rest} = n
        const categoriesTranformed = categories.map((c)=> c.uuid)
        this.createNoteForm.patchValue({categories: categoriesTranformed, ...rest})
      }
    })
  }


  getNoteControl() {
    return this.createNoteForm.get('note') as FormControl
  }

  getCurrentDate() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `Note ${day}-${month}-${year} ${hours}:${minutes}`
  };

  onSubmit() {
    const createNoteRequest: CreateNoteRequest = this.createNoteForm.value
    if(createNoteRequest.title == ""){
      createNoteRequest.title = this.getCurrentDate()
    }
    this.loading.set(true)
    if (this.note === undefined) {
      this.noteService.createNote(createNoteRequest).pipe(finalize(() => this.loading.set(false))).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Created successfully'
          })
          timer(1500).subscribe(() => this.router.navigate(['/']))
        }
      })
    } else {
      this.noteService.editNote(this.note.uuid, createNoteRequest).pipe(finalize(() => this.loading.set(false))).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'warn',
            detail: 'Edited succesfully'
          })
          timer(1500).subscribe(() => this.router.navigate(['/']))
        }
      })
    }
  }

  setArchiveStatus(status: boolean) {
    this.loading.set(true)
    this.noteService.setArchived(this.note!.uuid, status).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.note!.archived = status
      }
    })
  }

  deleteNote() {
    if (!this.deleteConfirm()) {
      this.deleteConfirm.set(true)
      return
    }
    this.loading.set(true)
    this.noteService.deleteNote(this.note!.uuid).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Delete successfull'
        })
        timer(1000).subscribe(() => this.router.navigate(['/']))
      }
    })
  }
}
