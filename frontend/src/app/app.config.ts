import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PropertyListComponent } from './property-list.component';
import { PropertyFormComponent } from './property-form.component';
import { PropertyDetailComponent } from './property-detail.component';

const routes = [
  { path: '', component: PropertyListComponent },
  { path: 'add-property', component: PropertyFormComponent },
  { path: 'property/:id', component: PropertyDetailComponent },
  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
