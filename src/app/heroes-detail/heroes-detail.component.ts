import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { Hero } from '../hero';
import { Location } from '@angular/common';

@Component({
  selector: 'app-heroes-detail',
  templateUrl: './heroes-detail.component.html',
  styleUrls: ['./heroes-detail.component.scss']
})
export class HeroesDetailComponent implements OnInit {
  hero: Hero;

  constructor(private route: ActivatedRoute, private heroService: HeroService, private location: Location) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      console.log(id);
      this.heroService.getHero(id).subscribe(hero => {
        this.hero = hero;
      });
    });
  }

  onGoBackButtonClick() {
    this.location.back();
  }

  onSaveButtonClick() {
    this.heroService.addHero(this.hero).subscribe(res => {
      this.location.back();
    });
  }
}
