import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private baseUrl = 'http://localhost:8000/dictionary';

  constructor(private http: HttpClient) {
  }

  getDictionary(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  saveWord(word: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, word);
  }

  updateWord(updatedWord: string, word: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${updatedWord}`, word);
  }

  deleteWord(word: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}`,
      {body: word});
  }
}
