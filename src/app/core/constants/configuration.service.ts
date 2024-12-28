import { Injectable } from '@angular/core';
//import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private static readonly BASE_URL: string = 'https://dedis-production-1-0-0.onrender.com';

  static readonly ENDPOINTS = {
    admin: {
      login: (): string => `${ ConfigurationService.BASE_URL }/api/admin/login`,
      requestPasswordReset: (): string => `${ ConfigurationService.BASE_URL }/api/admin/request-reset-password`,
      resetPassword: (): string => `${ ConfigurationService.BASE_URL }/api/admin/reset-password`,
      exportChildrenToExcel: (): string => `${ ConfigurationService.BASE_URL }/api/admin/excel`
    },
    child: {
      register: (): string => `${ ConfigurationService.BASE_URL }/api/child`
    },
    event: {
      create: (): string => `${ ConfigurationService.BASE_URL }/api/event/create-event`,
      update: (eventId: string): string => `${ ConfigurationService.BASE_URL }/api/event/update-event/${ eventId }`,
      list: (): string => `${ ConfigurationService.BASE_URL }/api/event/list-events`,
      get: (eventId: string): string => `${ ConfigurationService.BASE_URL }/api/event/get-event/${ eventId }`,
      cancel: (eventId: string): string => `${ ConfigurationService.BASE_URL }/api/event/cancel-event/${ eventId }`
    }
  };

  static getApiUrl(): string {
    return ConfigurationService.BASE_URL;
  }
}
