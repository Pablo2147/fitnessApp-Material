import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { Exercise } from './exercise.model';
import { Subscription } from 'rxjs';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
      .pipe(
        map(docArray => {
          // throw (new Error());
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      },
        error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnakcBar('Fetching Exercises failed, please try again later', null, 3000);
          this.exercisesChanged.next(null);
        }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDataBase({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDataBase(
      {
        ...this.runningExercise,
        date: new Date(),
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        state: 'cancelled'
      }
    );
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchPastExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next([...exercises]);
    }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDataBase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
