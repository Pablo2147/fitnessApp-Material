import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  loadingStateChanged = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) { }

  showSnakcBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration });
  }
}
