import { AbstractControl, ValidationErrors } from '@angular/forms';

type Phone = { phone: boolean };
const phone: Phone = { phone: true };

/**
 * Check if it is a phone number.
 * @returns ({phone: true}) or null
 */
export function phoneValidator(
    control: AbstractControl
): ValidationErrors | null {
    const phoneRegex = new RegExp('^[0-9]{10}$');
    const isPhone = control.value ? phoneRegex.test(control.value) : true;

    return isPhone ? null : { ...phone };
}
