import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NoteResponse } from '@/app/model/response/noteResponse';
import { environment } from '@/environments/environment';
import { UUID } from 'crypto';
import { CreateNoteRequest } from '@/app/model/request/createNoteRequest';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly http = inject(HttpClient)

  public getUserNotes(options: Partial<{sortArchived: boolean | undefined, categories: UUID[] |undefined}>): Observable<NoteResponse[]>{
    let params = new HttpParams()
    if(options.sortArchived != undefined){
      params = params.set("sortArchived", ""+options.sortArchived)
    }
    if(options.categories != undefined){
      params = params.set("categories", options.categories.join(","))
    }
    return this.http.get<NoteResponse[]>(`${environment.apiUrl}/notes`, {params})
  }

  public getNoteByUUID(noteUUID: UUID): Observable<NoteResponse>{
    return this.http.get<NoteResponse>(`${environment.apiUrl}/notes/${noteUUID}`,)
  }

  public createNote(request: CreateNoteRequest): Observable<any>{
    return this.http.post(`${environment.apiUrl}/notes`, request)
  }

  public editNote(noteUUID: UUID, request: CreateNoteRequest): Observable<any>{
    return this.http.put(`${environment.apiUrl}/notes/${noteUUID}`, request)
  }

  public deleteNote(noteUUID: UUID): Observable<any>{
    return this.http.delete(`${environment.apiUrl}/notes/${noteUUID}`)
  }

  public setArchived(noteUUID: UUID, setArchived: boolean): Observable<any>{
    const params = new HttpParams().set("v", setArchived)
    return this.http.put(`${environment.apiUrl}/notes/${noteUUID}/setarchived`, null, {params})
  }
}
