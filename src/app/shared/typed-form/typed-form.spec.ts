import { delay, mergeMap, skip, tap } from 'rxjs/operators';

import { FormBuilder, Validators } from '@angular/forms';

import { circularReplacer } from '../utils/circular-replacer';
import {
    INPUT_CONFIRM_ERROR,
    inputsConfirmValidatorFn,
} from '../validators/inputs-confirm.validator';
import { TypedForm } from './typed-form';

type TestControls = {
    email: string;
    password: string;
    confirmPassword: string;
    group: { rememberMe: string };
};

const ERROR_REQUIRED = 'Ce champ est obligatoire';
const ERROR_EMAIL = "C'est email n'est pas valide";
const ERROR_CONFIRM_PASSWORD = 'Les mots de passe ne sont pas identiques';
const fb = new FormBuilder();

const form = new TypedForm<TestControls>({
    builder: fb,
    config: {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        group: { rememberMe: [true, [Validators.required]] },
    },
    errorMap: {
        email: {
            required: ERROR_REQUIRED,
            email: ERROR_EMAIL,
        },
        password: {
            required: ERROR_REQUIRED,
        },
        confirmPassword: {
            required: ERROR_REQUIRED,
            [INPUT_CONFIRM_ERROR]: ERROR_CONFIRM_PASSWORD,
        },
        group: {
            rememberMe: {
                required: ERROR_REQUIRED,
            },
        },
    },
    validators: [inputsConfirmValidatorFn<TestControls>('password', 'email')],
});

describe('TypedForm', () => {
    it('should expose valid path', () => {
        expect(form.path).toStrictEqual({
            email: 'email',
            password: 'password',
            confirmPassword: 'confirmPassword',
            group: { rememberMe: 'group.rememberMe' },
        });
    });

    it('should expose valid form', () => {
        const EXPECTED_FORM = fb.group(
            {
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]],
                group: fb.group({ rememberMe: [true, [Validators.required]] }),
            },
            {
                validators: [
                    inputsConfirmValidatorFn<TestControls>('password', 'email'),
                ],
            }
        );
        expect(JSON.stringify(form.group, circularReplacer())).toEqual(
            JSON.stringify(EXPECTED_FORM, circularReplacer())
        );
    });

    it('should emit error', (done) => {
        form.listen([]);
        form.group.valueChanges
            .pipe(
                // wait for debounce time
                delay(1000),
                mergeMap(() => form.errors$),
                tap((errors) =>
                    expect(errors).toStrictEqual({
                        email: ERROR_EMAIL + ' ',
                        password: '',
                        confirmPassword: '',
                        group: { rememberMe: '' },
                    })
                ),
                tap(() => done())
            )
            .subscribe();
        form.group.get(form.path.email)?.setValue('test');
        form.group.get(form.path.email)?.markAsTouched();
    });

    it('should emit error in nested groups', (done) => {
        type TestNestedControls = {
            credentials: {
                email: string;
                password: string;
                confirmPassword: string;
            };
            rememberMe: string;
        };
        const nestedForm = new TypedForm<TestNestedControls>({
            builder: fb,
            config: {
                credentials: {
                    email: ['', [Validators.required, Validators.email]],
                    password: ['', [Validators.required]],
                    confirmPassword: ['', [Validators.required]],
                },
                rememberMe: [true, [Validators.required]],
            },
            errorMap: {
                credentials: {
                    email: {
                        required: ERROR_REQUIRED,
                        email: ERROR_EMAIL,
                    },
                    password: {
                        required: ERROR_REQUIRED,
                    },
                    confirmPassword: {
                        [INPUT_CONFIRM_ERROR]: ERROR_CONFIRM_PASSWORD,
                    },
                },
                rememberMe: {
                    required: ERROR_REQUIRED,
                },
            },
            validators: [
                inputsConfirmValidatorFn<TestControls>(
                    'password',
                    'confirmPassword'
                ),
            ],
        });
        nestedForm.listen([]);
        nestedForm.group.valueChanges
            .pipe(
                // wait for debounce time
                delay(1000),
                mergeMap(() => nestedForm.errors$),
                tap((errors) =>
                    expect(errors).toStrictEqual({
                        credentials: {
                            email: ERROR_EMAIL + ' ',
                            password: '',
                            confirmPassword: '',
                        },
                        rememberMe: '',
                    })
                ),
                tap(() => done())
            )
            .subscribe();
        nestedForm.group
            .get(nestedForm.path.credentials.email)
            ?.setValue('test');
        nestedForm.group
            .get(nestedForm.path.credentials.email)
            ?.markAsTouched();
    });

    it('should emit error from ValidatorFn', (done) => {
        const form = new TypedForm<TestControls>({
            builder: fb,
            config: {
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required]],
                confirmPassword: ['', Validators.required],
                group: { rememberMe: [true, [Validators.required]] },
            },
            errorMap: {
                email: {
                    required: ERROR_REQUIRED,
                    email: ERROR_EMAIL,
                },
                password: {
                    required: ERROR_REQUIRED,
                },
                confirmPassword: {
                    inputConfirm: ERROR_CONFIRM_PASSWORD,
                    required: ERROR_REQUIRED,
                },
                group: {
                    rememberMe: {
                        required: ERROR_REQUIRED,
                    },
                },
            },
            validators: [
                inputsConfirmValidatorFn<TestControls>(
                    'password',
                    'confirmPassword'
                ),
            ],
        });
        form.listen([]);
        form.group.valueChanges
            .pipe(
                // wait for debounce time
                delay(1000),
                skip(1),
                mergeMap(() => form.errors$),
                tap((errors) =>
                    expect(errors).toEqual({
                        email: '',
                        password: '',
                        confirmPassword: ERROR_CONFIRM_PASSWORD + ' ',
                        group: {
                            rememberMe: '',
                        },
                    })
                ),
                tap(() => console.log(1)),
                tap(() => done())
            )
            .subscribe();
        form.group.get(form.path.password)?.setValue('password');
        form.group.get(form.path.password)?.markAsTouched();
        form.group.get(form.path.confirmPassword)?.setValue('confirmPassword');
        form.group.get(form.path.confirmPassword)?.markAsTouched();
    });
});
