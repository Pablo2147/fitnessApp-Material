import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    SidenavListComponent
  ]
})
export class NavigationModule { }
