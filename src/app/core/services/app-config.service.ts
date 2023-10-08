import { Injectable } from '@angular/core';
import { parse } from 'secure-json-parse';
import { HttpClient } from '@angular/common/http'
import { catchError, take, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public static readonly configPath = 'config/config.json';

  public config: Record<string, unknown>;

  constructor(private http: HttpClient) {
    this.config = {};
  }

  public getConfig(): object {
    return this.config;
  }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      if (sessionStorage[AppConfigService.configPath]) {
        try {
          this.config = parse(sessionStorage[AppConfigService.configPath]) as Record<string, unknown>;
          resolve(true);
          return;
        } catch (error) {
          // refresh the data
        }
      }
      this.http.get(AppConfigService.configPath).pipe(take(1),
        catchError((error) => throwError(error || 'Server Error'))).subscribe((config: object) => {
          sessionStorage[AppConfigService.configPath] = JSON.stringify(config);
          this.config = config as Record<string, unknown>;
          resolve(true);
        });
    });
  }
}
