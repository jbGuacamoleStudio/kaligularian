import { FormControl, FormGroup, Validators } from '@angular/forms';

import { phoneValidator } from './phone.validator';

describe('PhoneValidatorFn', () => {
    const form = new FormGroup({
        phone: new FormControl('', [phoneValidator, Validators.required]),
    });

    beforeEach(() => {
        form.get('phone')?.setValue('');
    });

    it('input should be a phone number [OK]', () => {
        form.get('phone')?.setValue('0123456789');
        form.get('phone')?.markAsTouched();
        expect(form.get('phone')?.errors).toEqual(null);
    });

    it('input should be a phone number [KO]', () => {
        form.get('phone')?.setValue('phone');
        form.get('phone')?.markAsTouched();
        expect(form.get('phone')?.errors).toEqual({ phone: true });
    });

    it('error should add up [OK]', () => {
        form.get('phone')?.markAsTouched();
        expect(form.get('phone')?.errors).toEqual({
            required: true,
        });
    });

    it('no error should appear if there is no phone number [OK]', () => {
        form.get('phone')?.markAsTouched();
        expect(form.get('phone')?.errors).toEqual({
            required: true,
        });
    });
});
