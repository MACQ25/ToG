import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, tap, switchMap, forkJoin, catchError, of, ObservableInput, merge } from 'rxjs';
import { Set } from '../../interfaces/set';
import { Block } from '../../interfaces/block';
import { ProgressionStart } from '../gameServices/pod-config.model';
import moment from 'moment';


@Injectable({
  providedIn: 'root',
})
export class SetsService {
  
  KNOWN_MISSING: String[] = ["4vv", "fbb", "sum", "tsb"];

  REGISTERED: String[] = [];

  constructor(private http: HttpClient, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer){
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('https://svgs.scryfall.io')
    );
  }

  public handleRegisty(code: string): Observable<boolean>{
    const codeClean = code.toLowerCase();
    const iconName = `${codeClean}-icon`;

    if(this.REGISTERED.includes(codeClean)){
      return of(true)
    }

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
              this.REGISTERED.push(codeClean)
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
          releaseDate: chl.releaseDate,
          font: set.font
        }));


        set.members = set.members.sort((k1: any, k2: any) => k1.releaseDate.localeCompare(k2.releaseDate));


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
        switchMap((response: any[]) => this.setUpData(response)),
      );
  }

  public listProgressionSet(mode: number, extras: boolean, refTarget?: Set){

    let dParams = {}

    switch(mode){
      case ProgressionStart.OldSchool:
            dParams = {
              date: moment({ year: 1993, month: 7, day: 4 }),
              range: moment({ year: 1994, month: 11, day: 2 }),
              opt: { allowMasters: true, allowPromo: extras },
            } 
        break;
      case ProgressionStart.ProTour:
            dParams = {
              date: moment({ year: 1995, month: 3, day: 1 }),
              range: moment({ year: 1999, month: 8, day: 1 }),
              opt: { allowMasters: true, allowPromo: extras, allowStarter: extras },
            } 
        break;
      case ProgressionStart.Year2000:
            dParams = {
              date: moment({ year: 1999, month: 9, day: 3 }),
              range: moment({ year: 2003, month: 5, day: 26 }),
              opt: { allowPromo: extras, allowStarter: extras, sixthEd: true },
            } 
        break;
      case ProgressionStart.Modern:
            dParams = {
              date: moment({ year: 2003, month: 6, day: 27 }),
              range: moment({ year: 2011, month: 5, day: 14 }),
              opt: { allowPromo: extras, allowStarter: extras },
            } 
        break;
      case ProgressionStart.SpecificSet:
            dParams = {
              date: moment(refTarget?.releaseDate, 'YYYY-MM-DD'),
              range: moment(refTarget?.releaseDate, 'YYYY-MM-DD').add(2, 'year'),
              opt: { customStart: true, allowMasters: true, allowPromo: extras, allowStarter: extras },
            }
        break;
    }

    return this.listByRange(dParams)
  }

  public listByStandardRotation(year: any, range: number, options = null): Observable<any> {
    
    const dParams = {
      date: year,
      range: range,
      opt: options,
      stnd: true
    } 

    return this.listByRange(dParams);

  }

  private listByRange(params: any){
    return this.http.post<any>(`${environment.apiUrl}/sets/byRange`, params)
      .pipe(
        switchMap((response: any) => forkJoin(
            {
              included: response.included && response.included.length > 0 ? this.setUpData(response.included) : of([] as Set[]),
              toRelease: response.toRelease ? this.setUpData(response.toRelease) : of([] as Set[]),
              justRotated: response.justRotated ? this.setUpData(response.justRotated) : of(null),
              starterSet: response.starterSet ? this.setUpData(response.starterSet) : of(null),
              promo: response.promo ? this.setUpData(response.promo) : of(null)
            }
          )
        )
    );  
  }


  

  public setCardList(code: String): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/sets/${code}`)
  }

  
}