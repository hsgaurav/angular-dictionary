import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Dictionary} from "./dictionary";

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private baseUrl = 'https://dictionary-word-api.herokuapp.com/dictionary';

  constructor(private http: HttpClient) {
  }

  getDictionary(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  saveWord(word: Dictionary): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, word);
  }

  updateWord(actualWord: string, updatedWord: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${actualWord}`, updatedWord);
  }

  deleteWord(word: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${word}`);
  }
}
