import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { By } from '@angular/platform-browser';
import { HeroService } from '../services/hero.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
}

class RouterStub {
  navigate(params) {}
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
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
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title Top Heroes', async(() => {
    const titleDE = fixture.debugElement.query(By.css('h4'));
    expect(titleDE.nativeElement.textContent).toBe('Top Heroes');
  }));

  it('should have 4 top heroes', async(() => {
    fixture.whenStable().then(() => {
      expect(component.topHeroes).toBeDefined('top heroes should be defined');
      expect(component.topHeroes.length).toBe(4, 'length of top heroes should be 4');
    });
  }));

  it('should display 4 top heroes', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroesDEs = fixture.debugElement.queryAll(By.css('.hero'));
      expect(heroesDEs.length).toBe(4, 'should have 4 hero elements');
    });
  }));

  it('should navigate to heroes/:id when clicked', async(() => {
    const router = TestBed.inject(Router);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const heroesDEs = fixture.debugElement.queryAll(By.css('.hero'));
      const navigateSpy = spyOn(router, 'navigate');

      heroesDEs[0].triggerEventHandler('click', null);
      const navFirstArg = navigateSpy.calls.first().args[0];

      expect(navigateSpy).toHaveBeenCalled();

      expect(navFirstArg).toContain('/heroes', 'first argument should contain /heroes');
      expect(navFirstArg).toContain(11, 'first argument should contain 11');
    });
  }));
});
