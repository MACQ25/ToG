import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, tap, switchMap, forkJoin, catchError, of, ObservableInput } from 'rxjs';
import { Set } from '../../interfaces/set';
import { Block } from '../../interfaces/block';


@Injectable({
  providedIn: 'root',
})
export class SetsService {

  constructor(private http: HttpClient, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer){
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('https://svgs.scryfall.io')
    );
  }

  private setUpData(data: any[]): Observable<any>{
    const sets: any[] = data.map((set: any) => ({
        id: set._id,
        name: set.data.name,
        code: set.data.code,
        members: set.data.members,
        icon: `${set.data.code.toLowerCase()}-icon`,
        releaseDate: set.data.releaseDate,
        font: new Date(set.data.releaseDate) <= new Date('2003-07-27') ? 'Goudy Medieval' : 'Beleren'
    }));

    const registrations = data.map((set: any) => {
      const code = set.data.code.toLowerCase();
      const iconName = `${code}-icon`;
      const url = `https://svgs.scryfall.io/sets/${code}.svg`;

      return this.http.get(url, { responseType: 'text' }).pipe(
        map((svgContent: string) => {
          this.iconRegistry.addSvgIconLiteral(
            iconName,
            this.sanitizer.bypassSecurityTrustHtml(svgContent)
          );
          return true;
        }),
        catchError(() => {
          const fallbackCode = ["4vv", "fbb", "sum", "tsb"].includes(code) ? code : "pw";
          this.iconRegistry.addSvgIcon(
            iconName,
            this.sanitizer.bypassSecurityTrustResourceUrl(`icons/${fallbackCode}-icon.svg`)
          );
          return of(true);
        })
      );
    });

    return forkJoin(registrations).pipe(map(() => sets));
  }

  public listSets(): Observable<Set[]> {
    return this.http.get<any>(`${environment.apiUrl}/sets/all`)
      .pipe(
        switchMap((response: any[]) => this.setUpData(response))
      );
  }

  public listBlocks(): Observable<Block[]> {
    return this.http.get<any>(`${environment.apiUrl}/sets/blocksSelect`)
      .pipe(
        switchMap((response: any[]) => this.setUpData(response))
      );
  }

  public setCardList(code: String): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/sets/${code}`)
  }

  
}