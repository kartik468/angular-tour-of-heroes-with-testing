import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../services/hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];

  constructor(private heroService: HeroService, private router: Router) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });
  }

  onDeleteHeroClick(hero: Hero, event: Event) {
    event.stopPropagation();
    this.heroService.deleteHero(hero.id).subscribe(_ => {
      this.getHeroes();
    });
  }

  onHeroClick(hero: Hero) {
    this.router.navigate(['/heroes', hero.id]);
  }
}
