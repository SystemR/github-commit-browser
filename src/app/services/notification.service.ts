import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

const DISPLAY_TOAST_IN_MS = 3500;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}
  show(msg: string, title: string = null, seconds: number = DISPLAY_TOAST_IN_MS) {
    this.toastr.info(msg, title, {
      timeOut: seconds
    });
  }

  success(msg: string, title: string = null, seconds: number = DISPLAY_TOAST_IN_MS) {
    this.toastr.success(msg, title, {
      timeOut: seconds
    });
  }

  error(msg: string, title: string = null, seconds: number = DISPLAY_TOAST_IN_MS) {
    this.toastr.error(msg, title, {
      timeOut: seconds
    });
  }

  showApiError(e: HttpErrorResponse) {
    const resetTime = e.headers.get('X-RateLimit-Reset') || 0;
    const resetDate = new Date(+resetTime * 1000);

    this.toastr.error(
      `You have reached Github's API Rate Limit. Please wait until ${resetDate} to browse the page or set Client ID and Client Secret in <a href='/settings'>Settings</a>.`,
      null,
      {
        enableHtml: true
      }
    );
  }
}

export const NotificationConfig = {
  positionClass: 'toast-bottom-left',
  maxOpened: 6,
  autoDismiss: true,
  newestOnTop: false
};
