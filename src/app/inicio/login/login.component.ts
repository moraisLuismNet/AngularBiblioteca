import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService } from 'src/app/services/app.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ILogin } from 'src/app/biblioteca/interfaces/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  infoLogin: ILogin = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private appService: AppService,
    private messageService: MessageService,
    private authGuard: AuthGuard
  ) {}

  ngOnInit() {
    if (this.authGuard.isLoggedIn()) {
      this.router.navigateByUrl('biblioteca/editoriales');
    }
  }

  login() {
    this.appService.login(this.infoLogin).subscribe({
      next: (data) => {
        sessionStorage.setItem('usuario', JSON.stringify(data));
        this.router.navigateByUrl('biblioteca/editoriales');
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales erróneas',
        });
      },
    });
  }
}
