import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const INPUT_CONFIRM_ERROR = 'inputConfirm';

/**
 * Check if 2 inputs are identical.
 * If different, add an error for the control input
 * @param controlName reference input
 * @param confirmControlName control input
 * @returns ({mustConfirm: true}) or null in control input
 */
export function inputsConfirmValidatorFn<T>(
    controlName: Extract<keyof T, string>,
    confirmControlName: Extract<keyof T, string>,
    errorKey: string = INPUT_CONFIRM_ERROR
): ValidatorFn {
    return (abstractControl: AbstractControl): ValidationErrors | null => {
        const control = abstractControl.get(controlName);
        const confirmControl = abstractControl.get(confirmControlName);

        if (control && confirmControl) {
            if (control.value !== confirmControl.value) {
                confirmControl.setErrors({
                    ...confirmControl.errors,
                    ...{ [errorKey]: true },
                });
            } else {
                const withoutConfirmError: ValidationErrors | null =
                    removeConfirmError(confirmControl.errors, errorKey);
                confirmControl.setErrors(withoutConfirmError);
            }
        }

        return null;
    };
}

function removeConfirmError(
    withConfirmErrors: ValidationErrors | null,
    errorKey: string
): ValidationErrors | null {
    let errors: ValidationErrors | null = null;
    if (withConfirmErrors) {
        const withoutConfirmError = Object.keys(withConfirmErrors).filter(
            (key) => key !== errorKey
        );
        errors = withoutConfirmError.length ? withConfirmErrors : null;
    }

    return errors;
}
