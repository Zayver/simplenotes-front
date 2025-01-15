import { CategoryResponse } from '@/app/model/response/categoryResponse';
import { CategoryService } from '@/app/services/category.service';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { finalize, Observable, timer } from 'rxjs';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { UUID } from 'crypto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { createCategoryRequest } from '@/app/model/request/createCategoryRequest';
import { Validators } from 'ngx-editor';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideTrash } from '@ng-icons/lucide';

@Component({
  selector: 'app-category',
  imports: [ReactiveFormsModule, Button, InputText, AsyncPipe, ConfirmPopup, NgIcon],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  providers: [ConfirmationService, provideIcons({lucideTrash, lucidePlus})]
})
export class CategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryService)
  private readonly messageService = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService)
  private readonly formBuilder = inject(FormBuilder)
  createCategoryForm!: FormGroup

  categories$!: Observable<CategoryResponse[]>
  loading = signal(false)

  ngOnInit(): void {
    this.categories$ = this.categoryService.getUserCategories()
    this.createCategoryForm = this.formBuilder.group({
      'name': ['', Validators.required]
    })
  }

  onSubmit() {
    const request: createCategoryRequest = this.createCategoryForm.value
    this.loading.set(true)
    this.categoryService.createCategory(request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Category added'
        })
        timer(1200).subscribe(()=> window.location.reload())
      }
    })
  }

  confirmRemoveCategory(event: Event, uuid:UUID) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deleting category, Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.removeCategory(uuid)
      }
    })
  }

  private removeCategory(uuid: UUID) {
    this.categoryService.deleteCategory(uuid).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Category deleted'
        })
        timer(1200).subscribe(()=> window.location.reload())
      }
    })
  }
}
