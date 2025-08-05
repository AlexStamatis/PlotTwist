import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorModalService } from '../shared/error-modal.service';
import { inject } from '@angular/core';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const errorModalService = inject(ErrorModalService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occured';

      if(error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server error: (${error.status}) : Try again in a while`;
      }
      errorModalService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
