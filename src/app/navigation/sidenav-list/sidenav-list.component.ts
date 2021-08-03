import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeItem = new EventEmitter<void>();
  isAuth = false;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.authChange.subscribe(res => {
      this.isAuth = res;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onClose() {
    this.authService.logout();
    this.closeItem.emit();
  }

}
