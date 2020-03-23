import { TestBed, async, ComponentFixture } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Directive, Input, DebugElement, HostListener } from '@angular/core';
import { By } from '@angular/platform-browser';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[routerLink]'
})
// tslint:disable-next-line: directive-class-suffix
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams;

  navigatedTo;

  @HostListener('click')
  click() {
    this.navigatedTo = this.linkParams;
  }
}

let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;
let appDE: DebugElement;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [AppComponent, RouterLinkDirectiveStub]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    appDE = fixture.debugElement;
    app = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Tour of Heroes'`, () => {
    expect(app.title).toEqual('Tour of Heroes');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Tour of Heroes app is running!');
  });

  it('should have two router links', () => {
    const routerLinkDEs = appDE.queryAll(By.directive(RouterLinkDirectiveStub));
    expect(routerLinkDEs.length).toBe(2, 'there should be 2 router links');
  });

  it('router links should match to values', () => {
    const routerLinkDEs = appDE.queryAll(By.directive(RouterLinkDirectiveStub));
    expect(routerLinkDEs.length).toBe(2, 'there should be 2 router links');
    const routerLinks = routerLinkDEs.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks[0].linkParams).toContain('/dashboard', 'should match to dashboard');
    expect(routerLinks[1].linkParams).toBe('/heroes', 'should match dashboard');
  });

  it('routerLinks should set navigateTo property when clicked', () => {
    const routerLinkDEs = appDE.queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = routerLinkDEs.map(de => de.injector.get(RouterLinkDirectiveStub));

    expect(routerLinks[0].navigatedTo).toBeUndefined('should not have navigated yet');

    routerLinkDEs[0].triggerEventHandler('click', null);
    expect(routerLinks[0].navigatedTo).toContain('/dashboard');
  });
});
