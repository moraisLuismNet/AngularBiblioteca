import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthGuard } from '../guards/auth-guard.service';
import { environment } from 'src/environments/environment';
import { IAutor, IEditorial, ILibro } from './biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaService {
  urlAPI = environment.urlAPI;
  constructor(private http: HttpClient, private authGuard: AuthGuard) {}

  getEditoriales(): Observable<IEditorial[]> {
    const headers = this.getHeaders();
    return this.http.get<IEditorial[]>(`${this.urlAPI}editoriales/conTotalLibros`, {
      headers,
    });
  }

  addEditorial(editorial: IEditorial): Observable<IEditorial> {
    const headers = this.getHeaders();
    return this.http.post<IEditorial>(`${this.urlAPI}editoriales`, editorial, {
      headers,
    });
  }

  updateEditorial(Editorial: IEditorial): Observable<IEditorial> {
    const headers = this.getHeaders();
    return this.http.put<IEditorial>(
      `${this.urlAPI}editoriales/${Editorial.idEditorial}`,
      Editorial,
      {
        headers,
      }
    );
  }

  deleteEditorial(id: number): Observable<IEditorial> {
    const headers = this.getHeaders();
    return this.http.delete<IEditorial>(`${this.urlAPI}editoriales/${id}`, {
      headers,
    });
  }

  getAutores(): Observable<IAutor[]> {
    const headers = this.getHeaders();
    return this.http.get<IAutor[]>(`${this.urlAPI}autores/conTotalLibros`, {
      headers,
    });
  }

  addAutor(autor: IAutor): Observable<IAutor> {
    const headers = this.getHeaders();
    return this.http.post<IAutor>(`${this.urlAPI}autores`, autor, {
      headers,
    });
  }

  updateAutor(Autor: IAutor): Observable<IAutor> {
    const headers = this.getHeaders();
    return this.http.put<IAutor>(
      `${this.urlAPI}autores/${Autor.idAutor}`,
      Autor,
      {
        headers,
      }
    );
  }

  deleteAutor(id: number): Observable<IAutor> {
    const headers = this.getHeaders();
    return this.http.delete<IAutor>(`${this.urlAPI}autores/${id}`, {
      headers,
    });
  }

  getLibros(): Observable<ILibro[]> {
    const headers = this.getHeaders();
    return this.http.get<ILibro[]>(`${this.urlAPI}libros`, { headers });
  }

  addLibro(libro: ILibro): Observable<ILibro> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('titulo', libro.titulo);
    formData.append('paginas', libro.paginas.toString());
    formData.append('precio', libro.precio.toString());
    formData.append('autorId', libro.autorId?.toString()!);
    formData.append('editorialId', libro.editorialId?.toString()!);
    formData.append('descatalogado', libro.descatalogado ? 'true' : 'false');
    formData.append('foto', libro.foto!);

    return this.http.post<ILibro>(`${this.urlAPI}libros`, formData, {
      headers,
    });
  }

  deleteLibro(id: number): Observable<ILibro> {
    const headers = this.getHeaders();
    return this.http.delete<ILibro>(`${this.urlAPI}libros/${id}`, {
      headers,
    });
  }

  updateLibro(libro: ILibro): Observable<ILibro> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('idLibro', libro.isbn.toString());
    formData.append('titulo', libro.titulo);
    formData.append('paginas', libro.paginas.toString());
    formData.append('precio', libro.precio.toString());
    formData.append('autorId', libro.autorId?.toString()!);
    formData.append('editorialId', libro.editorialId?.toString()!);
    formData.append('descatalogado', libro.descatalogado ? 'true' : 'false');
    if (libro.foto) {
      formData.append('foto', libro.foto, libro.foto.name);
    }

    return this.http.put<ILibro>(`${this.urlAPI}libros/${libro.isbn}`, formData, { headers: this.getHeaders() });
  }

  getHeaders(): HttpHeaders {
    const token = this.authGuard.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return headers;
  }
}
