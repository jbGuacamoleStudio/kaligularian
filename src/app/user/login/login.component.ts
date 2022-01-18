import { take, tap } from 'rxjs/operators';
import { ROUTES } from 'src/app/shared/routes';
import { TypedForm } from 'src/app/shared/typed-form/typed-form';

import {
    ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChildren
} from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Credentials } from '../models/credentials';
import { UserService } from '../user.service';

type LoginControls = {
  email: string;
  password: string;
};

const ERROR_REQUIRED = 'Ce champ est obligatoire';
const ERROR_EMAIL = "C'est email n'est pas valide";
const ERROR_MIN_LENGTH_SIX = 'Ce champ doit comporter au moins 6 caractères';
const ERROR_MIN_LENGTH_FIVE = 'Ce champ doit comporter au moins 5 caractères';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) inputs!: ElementRef[];
  form!: TypedForm<LoginControls>;

  errorMessage = false;

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.form = new TypedForm<LoginControls>({
      builder: this._fb,
      config: {
        email: [
          '',
          [Validators.required, Validators.email, Validators.minLength(6)],
        ],
        password: ['', [Validators.required, Validators.minLength(5)]],
      },
      errorMap: {
        email: {
          required: ERROR_REQUIRED,
          email: ERROR_EMAIL,
          minlength: ERROR_MIN_LENGTH_SIX,
        },
        password: {
          required: ERROR_REQUIRED,
          minlength: ERROR_MIN_LENGTH_FIVE,
        },
      },
    });
  }

  ngAfterViewInit(): void {
    this.form.listen(this.inputs);
  }

  ngOnDestroy(): void {
    this.form.destroy();
  }

  onSubmit(): void {
    const login: LoginControls = this.form.group.getRawValue();
    const credentials: Credentials = {
      email: login.email,
      password: login.password,
    };
    this._userService
      .login(credentials)
      .pipe(
        take(1),
        tap((isAuthenticated) =>
          !isAuthenticated
            ? (this.errorMessage = true)
            : this._router.navigate([ROUTES.home])
        )
      )
      .subscribe();
  }
}
