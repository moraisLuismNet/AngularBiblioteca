import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoresComponent } from './autores/autores.component';
import { EditorialesComponent } from './editoriales/editoriales.component';
import { LibrosComponent } from './libros/libros.component';
import { BibliotecaComponent } from './biblioteca.component';

const appRoutes: Routes = [
  {
    path: '',
    component: BibliotecaComponent,
    children: [
      { path: '', redirectTo: '/biblioteca/editoriales', pathMatch: 'full' },
      { path: 'editoriales', component: EditorialesComponent },
      { path: 'autores', component: AutoresComponent },
      { path: 'libros', component: LibrosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class BibliotecaRoutingModule {}
