import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../services/hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  topHeroes: Hero[];

  constructor(private heroService: HeroService, private router: Router) {}

  ngOnInit(): void {
    this.getTopHeroes();
  }

  getTopHeroes() {
    this.heroService.getHeroes().subscribe(heroes => {
      this.topHeroes = heroes.slice(0, 4);
    });
  }

  onHeroClick(hero: Hero) {
    this.router.navigate(['/heroes', hero.id]);
  }
}
