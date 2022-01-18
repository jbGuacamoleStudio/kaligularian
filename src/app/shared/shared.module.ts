import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFieldComponent } from './form-field/form-field.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    FormFieldComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
