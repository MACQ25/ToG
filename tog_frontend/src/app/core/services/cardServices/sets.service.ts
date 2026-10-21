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
  
  KNOWN_MISSING = ["4vv", "fbb", "sum", "tsb"];

  constructor(private http: HttpClient, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer){
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('https://svgs.scryfall.io')
    );
  }

  public handleRegisty(code: string): Observable<boolean>{
    const codeClean = code.toLowerCase();
    const iconName = `${codeClean}-icon`;
    const url = `${environment.apiUrl}/sets/icon/${codeClean}`;

    if (this.KNOWN_MISSING.includes(codeClean)) {
      this.iconRegistry.addSvgIcon(
          iconName,
          this.sanitizer.bypassSecurityTrustResourceUrl(`icons/${iconName}.svg`)
        );
      return of(true);
    }
    else return this.http.get(url, { responseType: 'text', observe: 'response' }).pipe(
      map((res) => {
          if (res.status === 200 && res.body) {
              this.iconRegistry.addSvgIconLiteral(
                  iconName,
                  this.sanitizer.bypassSecurityTrustHtml(res.body)
              );
          } else {
              this.registryFallback(iconName);
          }
          return true;
        }),
      catchError(() => {
        this.registryFallback(iconName);
        return of(true);
      })
    );
  }


  private registryFallback(iconName: string) {
    this.iconRegistry.addSvgIcon(
      iconName,
      this.sanitizer.bypassSecurityTrustResourceUrl(`icons/pw-icon.svg`)
    );
  }

  private fontAccordingToDate(date: Date){
      if(date < new Date('2003-07-28')) return 'Goudy Medieval';
      else if (date < new Date('2014-07-18')) return 'Matrix';
      else return 'Beleren'
  }

  private setUpData(data: any[]): Observable<any>{
    let sets: any[] = data.map((set: any) => ({
        id: set._id,
        name: set.data.name,
        code: set.data.code,
        members: set.data.members,
        icon: `${set.data.code.toLowerCase()}-icon`,
        releaseDate: set.data.releaseDate,
        font: this.fontAccordingToDate(new Date(set.data.releaseDate))
    }));

    sets = sets.map((set) => {
      if (set.members) {
        set.members = set.members.map((chl: any) => ({
          id: chl.id,
          name: chl.name,
          code: chl.code,
          icon: `${chl.code.toLowerCase()}-icon`,
          releaseDate: set.releaseDate,
          font: set.font
        }))
      }
      return set;
    })

    const registrations = data.map((set: any) => { return this.handleRegisty(set.data.code) });

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

  public listByDateRange(year: number, range: number, rangeStart: boolean = true): Observable<Set[]> {
    
    const dParams = {
      date: year,
      range: range,
      ori: rangeStart
    } 

    return this.http.get<any>(`${environment.apiUrl}/sets/byRange`, {params: dParams})
      .pipe(
        switchMap((response: any[]) => this.setUpData(response))
      );  
  }
  

  public setCardList(code: String): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/sets/${code}`)
  }

  
}