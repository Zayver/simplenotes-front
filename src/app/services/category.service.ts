import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse } from '@/app/model/response/categoryResponse';
import { environment } from '@/environments/environment';
import { createCategoryRequest } from '@/app/model/request/createCategoryRequest';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient)

  getUserCategories(): Observable<CategoryResponse[]>{
    return this.http.get<CategoryResponse[]>(`${environment.apiUrl}/categories`)
  }

  createCategory(request: createCategoryRequest): Observable<any>{
    return this.http.post<CategoryResponse>(`${environment.apiUrl}/categories`, request)
  }

  deleteCategory(uuid: UUID){
    return this.http.delete(`${environment.apiUrl}/categories/${uuid}`)
  }
}
