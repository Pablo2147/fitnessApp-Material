import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[] = [];
  exercisesSub: Subscription;

  isLoading = false;
  private loadingSub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exercisesSub = this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    if (this.exercisesSub) {
      this.exercisesSub.unsubscribe();
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStarTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
