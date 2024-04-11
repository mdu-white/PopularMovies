import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonText, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { catchError, finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonBadge, IonLabel, IonText, IonAlert, IonSkeletonText, IonAvatar, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonList, DatePipe, RouterModule],
})
export class HomePage {
  private movieService = inject(MovieService);
  public currentPage = 1;
  public movies: any[] = []
  public error = null;
  public isLoading = false;
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies()
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService
      .getTopRatedMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          console.log(err)

          this.error = err.error.status_message;
          return []
        })
    )
    .subscribe({
      next: (res) => {
        console.log(res)

        this.movies.push(...res.results);
        event?.target.complete()

        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      }
    })

  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

}
