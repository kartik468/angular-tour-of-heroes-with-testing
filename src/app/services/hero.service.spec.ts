import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
const heroesUrl = 'api/heroes';
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

describe('HeroService', () => {
  let service: HeroService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(HeroService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get heroes successfully', () => {
    service.getHeroes().subscribe(users => {
      expect(users.length).toBe(10);
    });

    const req = httpTestingController.expectOne(heroesUrl);
    req.flush(heroes);
  });

  it('should get hero with id 11', () => {
    service.getHero(11).subscribe(hero => {
      expect(hero.id).toBe(11);
    });
    const req = httpTestingController.expectOne(heroesUrl + '/11');
    req.flush({ id: 11, name: 'Dr Nice' });
  });

  it('should fail get hero with id 111', () => {
    service.getHero(111).subscribe(
      hero => {
        // expect(hero.id).toBe(111);
      },
      (err: HttpErrorResponse) => {
        expect(err.status).toBe(404);
      }
    );
    const req = httpTestingController.expectOne(heroesUrl + '/111');
    req.flush('Not Found', { status: 404, statusText: 'failed to get hero with id 111' });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
