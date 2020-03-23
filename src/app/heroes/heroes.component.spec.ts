import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';
import { HeroService } from '../services/hero.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { By } from '@angular/platform-browser';

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
class HeroServiceStub {
  getHeroes() {
    return of(heroes).pipe(delay(100));
  }
  deleteHero(heroId: number) {}
}

class RouterStub {
  navigate(params) {}
}

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      providers: [
        {
          provide: HeroService,
          useClass: HeroServiceStub
        },
        {
          provide: Router,
          useClass: RouterStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title My heroes', () => {
    fixture.detectChanges();
    const titleDE = fixture.debugElement.query(By.css('h3'));
    expect(titleDE.nativeElement.textContent).toBe('My Heroes');
  });

  it('should have 0 heroes initially', () => {
    const heroDEs = fixture.debugElement.queryAll(By.css('.list-group-item'));
    expect(heroDEs.length).toBe(0);
  });

  it('should have 10 heroes displayed', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroDEs = fixture.debugElement.queryAll(By.css('.list-group-item'));
      expect(heroDEs.length).toBe(10);
    });
  }));

  it('should navigate to hero detail page when clicked', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroDEs = fixture.debugElement.queryAll(By.css('.list-group-item'));
      const routerStub = TestBed.inject(Router);
      const navigateSpy = spyOn(routerStub, 'navigate');
      heroDEs[0].triggerEventHandler('click', null);
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy.calls.first().args[0]).toContain(11, '');
    });
  }));

  it('should call delete hero when delete button is clicked', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroDEs = fixture.debugElement.queryAll(By.css('.list-group-item'));
      const firstHero = heroDEs[0].query(By.css('.delete'));
      const heroService = TestBed.inject(HeroService);
      const deleteHeroSpy = spyOn(heroService, 'deleteHero').and.returnValue(of(true));

      firstHero.triggerEventHandler('click', { stopPropagation: () => {} });
      fixture.whenStable().then(() => {
        expect(deleteHeroSpy).toHaveBeenCalled();
      });
    });
  }));

  it('should show 0 heroes when getHeroes return empty array', async(() => {
    const heroService = TestBed.inject(HeroService);
    const getHeroes = spyOn(heroService, 'getHeroes').and.returnValue(of([]));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const heroDEs = fixture.debugElement.queryAll(By.css('.list-group-item'));
      expect(heroDEs.length).toBe(0);
    });
  }));
});
