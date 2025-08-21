import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    ReactiveFormsModule,
    MaterialModule,
    HeaderComponent 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [FormBuilder]
})
export class SharedModule {}
