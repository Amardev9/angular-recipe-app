import { Component, OnInit, EventEmitter,Output } from '@angular/core';

import { Recipe } from '../recipe.model';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes:Recipe[] = [
    new Recipe('Test','This is a test', 'https://cdn.pixabay.com/photo/2016/01/22/02/13/meat-1155132_960_720.jpg'),
    new Recipe('Test2','This is a test2', 'https://cdn.pixabay.com/photo/2016/01/22/02/13/meat-1155132_960_720.jpg'),
  ];
  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe)
  } 

}
