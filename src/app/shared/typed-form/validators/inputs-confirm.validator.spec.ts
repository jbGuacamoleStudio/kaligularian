import { FormControl, FormGroup, Validators } from '@angular/forms';

import { inputsConfirmValidatorFn } from './inputs-confirm.validator';

describe('InputsConfirmValidatorFn', () => {
    const form = new FormGroup(
        {
            email: new FormControl('', []),
            confirmEmail: new FormControl('', [Validators.email]),
        },
        {
            validators: [inputsConfirmValidatorFn('email', 'confirmEmail')],
        }
    );

    beforeEach(() => {
        form.get('email')?.setValue('');
        form.get('confirmEmail')?.setValue('');
    });

    it('inputs should be identical [OK]', () => {
        form.get('email')?.setValue('email@email.com');
        form.get('confirmEmail')?.setValue('email@email.com');
        form.get('confirmEmail')?.markAsTouched();
        expect(form.get('confirmEmail')?.errors).toEqual(null);
    });

    it('inputs should be identical [KO]', () => {
        form.get('confirmEmail')?.setValue('email@email.com');
        form.get('confirmEmail')?.markAsTouched();
        expect(form.get('confirmEmail')?.errors).toEqual({
            inputConfirm: true,
        });
    });

    it('errors should add up [OK]', () => {
        form.get('confirmEmail')?.setValue('email');
        form.get('confirmEmail')?.markAsTouched();
        expect(form.get('confirmEmail')?.errors).toEqual({
            email: true,
            inputConfirm: true,
        });
    });
});
