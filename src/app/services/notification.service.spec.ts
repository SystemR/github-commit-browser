import { inject, TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { NotificationConfig, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let toast: ToastrService;
  let notificationConfig: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()]
    });
  });

  beforeEach(inject(
    [NotificationService, ToastrService],
    (_notificationService_: NotificationService, _toast_: ToastrService) => {
      notificationService = _notificationService_;
      toast = _toast_;
      notificationConfig = NotificationConfig;
    }
  ));

  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  it('should handle show', () => {
    spyOn(toast, 'info');
    notificationService.show('Hello World', 'Title');
    expect(toast.info).toHaveBeenCalledWith('Hello World', 'Title', { timeOut: 3500 });
  });

  it('should handle success', () => {
    spyOn(toast, 'success');
    notificationService.success('Hello World', 'Title');
    expect(toast.success).toHaveBeenCalledWith('Hello World', 'Title', { timeOut: 3500 });
  });

  it('should handle error', () => {
    spyOn(toast, 'error');
    notificationService.error('Hello World', 'Title');
    expect(toast.error).toHaveBeenCalledWith('Hello World', 'Title', { timeOut: 3500 });
  });

  it('should handle defined seconds', () => {
    spyOn(toast, 'success');
    notificationService.success('Hello World', 'Title', 3000);
    expect(toast.success).toHaveBeenCalledWith('Hello World', 'Title', { timeOut: 3000 });
  });
});
