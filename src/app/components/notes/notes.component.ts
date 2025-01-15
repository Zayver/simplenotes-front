import { NoteResponse } from '@/app/model/response/noteResponse';
import { AuthService } from '@/app/services/auth.service';
import { NoteService } from '@/app/services/note.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { merge, Observable, switchMap } from 'rxjs';
import { Skeleton } from 'primeng/skeleton'
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { NotecardComponent } from './notecard/notecard.component';
import { SelectButton, SelectButtonChangeEvent } from 'primeng/selectbutton';
import { CategoryService } from '@/app/services/category.service';
import { CategoryResponse } from '@/app/model/response/categoryResponse';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { Dialog } from 'primeng/dialog';
import { CategoryComponent } from '../category/category.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  imports: [AsyncPipe, Skeleton, Button, RouterLink, NotecardComponent, SelectButton, MultiSelect, Dialog, CategoryComponent, ReactiveFormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  private readonly noteService = inject(NoteService)
  private readonly categoryService = inject(CategoryService)
  private readonly authService = inject(AuthService)
  private readonly formBuilder = inject(FormBuilder)

  notes$!: Observable<NoteResponse[]>
  categories$!: Observable<CategoryResponse[]>
  categoryDialogVisible = false
  filterForm!: FormGroup

  protected readonly archivedTypes = [
    {name: 'Archived', value: true},
    {name: 'Not Archived', value: false},
  ]

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      'sortArchived': [undefined],
      'categories': [undefined]
    })
    this.notes$ = merge(
      this.noteService.getUserNotes({}),
      this.filterForm.valueChanges.pipe(switchMap((v)=>{
        return this.noteService.getUserNotes(v)
      }))
    )
    this.categories$ = this.categoryService.getUserCategories()
    

  }

  getUsername() {
    return this.authService.user.username
  }
}
