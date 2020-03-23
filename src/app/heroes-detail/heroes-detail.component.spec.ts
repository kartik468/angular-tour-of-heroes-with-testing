import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HeroesDetailComponent } from './heroes-detail.component';
import { ActivatedRoute, ParamMap, Params, convertToParamMap } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { Hero } from '../hero';
import { of, ReplaySubject, defer } from 'rxjs';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

const heroes = [
  { id: 11, name: 'Dr Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

class HeroServiceStub {
  getHero(id: number) {
    const user = heroes.find(hero => hero.id === id);
    // return of(user).pipe(delay(100));
    // return asyncData(user);
    return of(user);
  }

  addHero(hero: Hero) {
    return of(hero);
  }
}

class ActivatedRouteStub {
  paramMapSubject = new ReplaySubject<ParamMap>();

  paramMap = this.paramMapSubject.asObservable();

  // constructor(params?: Params) {
  // if (params) {
  //   this.setParamMap(params);
  // }
  // }

  setParamMap(params: Params) {
    this.paramMapSubject.next(convertToParamMap(params));
  }
}

class LocationStub {
  back() {}
}

describe('HeroesDetailComponent', () => {
  let component: HeroesDetailComponent;
  let fixture: ComponentFixture<HeroesDetailComponent>;
  let activatedRoute: ActivatedRoute;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub
        },
        { provide: HeroService, useClass: HeroServiceStub },
        { provide: Location, useClass: LocationStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesDetailComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRouteStub = (activatedRoute as any) as ActivatedRouteStub;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hero when it gets value in param map', async(() => {
    activatedRouteStub.setParamMap({ id: 11 });
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.hero).toBeDefined('hero to be defined');
      expect(fixture.componentInstance.hero.id).toBe(11, 'hero id should be 11');
    });
  }));

  it('should set hero name in card-header element', async(() => {
    activatedRouteStub.setParamMap({ id: 11 });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const hero = fixture.componentInstance.hero;
      // expect(fixture.componentInstance.hero).toBeDefined('hero to be defined');
      // expect(fixture.componentInstance.hero.id).toBe(11, 'hero id should be 11');
      const cardHeaderDE = fixture.debugElement.query(By.css('.card-header'));
      expect(cardHeaderDE.nativeElement.textContent).toContain(hero.name);
    });
  }));

  it('should call back method when go back button is clicked', async(() => {
    activatedRouteStub.setParamMap({ id: 11 });
    const location = TestBed.inject(Location);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const goBackButton = fixture.debugElement.query(By.css('.btn-secondary'));
      const backSpy = spyOn(location, 'back');

      goBackButton.triggerEventHandler('click', null);
      expect(backSpy).toHaveBeenCalled();
    });
  }));

  it('should call addHero when save button is clicked', async(() => {
    activatedRouteStub.setParamMap({ id: 11 });
    const location = TestBed.inject(Location);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const saveBtn = fixture.debugElement.query(By.css('.btn-primary'));
      const backSpy = spyOn(location, 'back');
      saveBtn.triggerEventHandler('click', null);
      expect(backSpy).toHaveBeenCalled();
    });
  }));

  it('should set name john', async(() => {
    activatedRouteStub.setParamMap({ id: 11 });
    const location = TestBed.inject(Location);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const nameInputDE = fixture.debugElement.query(By.css('.form-control'));
        nameInputDE.nativeElement.value = 'john';
        // nameInputDE.triggerEventHandler('input', null);
        const inputEvent = new Event('input');
        nameInputDE.nativeElement.dispatchEvent(inputEvent);
        // fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.hero.name).toBe('john');
        const cardHeaderDE = fixture.debugElement.query(By.css('.card-header'));
        expect(cardHeaderDE.nativeElement.textContent).toContain('john');
        // });
      });
    });
  }));
});
