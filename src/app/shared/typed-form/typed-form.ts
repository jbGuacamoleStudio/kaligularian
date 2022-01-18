import { BehaviorSubject, fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, mergeAll, takeUntil, tap } from 'rxjs/operators';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef } from '@angular/core';
import {
    AsyncValidatorFn,
    FormBuilder,
    FormGroup,
    ValidatorFn,
} from '@angular/forms';

type ErrorMap<T> = Partial<{
    [K in keyof T]: Record<string, string> | ErrorMap<T[K]>;
}>;

type Config<T> = {
    [K in keyof T]: unknown[] | Config<T[K]>;
};

type TypedFormConfig<T> = {
    builder: FormBuilder;
    config: Config<T>;
    errorMap: ErrorMap<T>;
    validators?: ValidatorFn | ValidatorFn[] | null;
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    updateOn?: 'change' | 'blur' | 'submit' | undefined;
};

export class TypedForm<T> {
    group: FormGroup;
    path: T;
    controlName: T;

    private _errorMap: ErrorMap<T>;

    private _destroy = new Subject();
    private _destroy$ = this._destroy.asObservable();

    private _errors$: BehaviorSubject<T>;

    constructor(params: TypedFormConfig<T>) {
        this.group = this._buildForm(
            params.config,
            params.builder,
            params.validators,
            params.asyncValidators,
            params.updateOn
        );
        this.path = this._formPath(params.config);
        this.controlName = this._controlName(this.path);
        this._errorMap = params.errorMap;
        this._errors$ = new BehaviorSubject<T>(this._initMessages(this.path));
    }

    get errors$(): Observable<T> {
        return this._errors$.asObservable();
    }

    destroy(): void {
        this._destroy.next(null);
        this._destroy.complete();
    }

    listen(inputs: ElementRef[]): void {
        const controlBlurs: Observable<unknown>[] = inputs.map(
            (control: ElementRef) => fromEvent(control.nativeElement, 'blur')
        );
        of(this.group.valueChanges, ...controlBlurs)
            .pipe(
                mergeAll(),
                debounceTime(800),
                delay(0),
                tap(() =>
                    this._errors$.next(
                        this._processErrors(this.group, this._errorMap)
                    )
                ),
                takeUntil(this._destroy$)
            )
            .subscribe();
    }

    private _controlName(path: T): T {
        const result = {} as any;
        Object.entries(path).forEach(([key, value]) => {
            if (typeof value === 'string') {
                result[key] = key;
            } else {
                result[key] = this._controlName(value as T);
            }
        });
        return result;
    }

    private _initMessages(path: T): T {
        const result = {} as any;
        Object.entries(path).forEach(([key, value]) => {
            if (typeof value === 'string') {
                result[key] = '';
            } else {
                result[key] = this._initMessages(value as T);
            }
        });
        return result;
    }

    private _buildForm(
        config: Config<T> | Config<T[keyof T]>,
        fb: FormBuilder,
        validatorsFn?: ValidatorFn | ValidatorFn[] | null,
        asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null,
        updateOn?: 'change' | 'blur' | 'submit' | undefined
    ): FormGroup {
        const result: Record<string, unknown[] | FormGroup> = {};
        Object.entries(config).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                result[key] = value;
            } else {
                result[key] = this._buildForm(value as Config<T[keyof T]>, fb);
            }
        });
        return fb.group(result, {
            validators: validatorsFn,
            asyncValidators: asyncValidators,
            updateOn: updateOn,
        });
    }

    private _formPath(config: Config<T>, path?: string): T {
        const result = {} as any;
        (Object.keys(config) as (keyof T)[]).forEach((key) => {
            const currentPath = `${path ?? ''}${path ? '.' : ''}${key}`;
            if (Array.isArray(config[key])) {
                result[key] = currentPath;
            } else {
                result[key] = this._formPath(config[key] as any, currentPath);
            }
        });
        return result;
    }

    private _processErrors(container: FormGroup, errorMap: any): T {
        const messages = {} as any;
        for (const controlKey in container.controls) {
            const key = controlKey as keyof T;
            if (
                Object.prototype.hasOwnProperty.call(
                    container.controls,
                    controlKey
                )
            ) {
                const c = container.controls[controlKey];
                // If it is a FormGroup, process its child controls.
                if (c instanceof FormGroup) {
                    messages[key] = this._processErrors(c, errorMap[key] || {});
                    // Object.assign(messages, childMessages);
                } else {
                    // Only validate if there are validation messages for the control
                    if (errorMap[controlKey]) {
                        const type = errorMap[controlKey] || {};
                        messages[key] = '';
                        if ((c.dirty || c.touched) && c.errors) {
                            Object.keys(c.errors).map((messageKey) => {
                                if (type[messageKey]) {
                                    messages[key] += type[messageKey] + ' ';
                                }
                            });
                        }
                    }
                }
            }
        }
        return messages;
    }
}
