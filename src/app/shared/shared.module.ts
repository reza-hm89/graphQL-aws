import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ItemsComponent } from '../components/items/items.component';



@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    ItemsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LayoutComponent,
  ]
})
export class SharedModule { }
