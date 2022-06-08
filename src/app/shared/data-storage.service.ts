import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,private recipeService: RecipeService,) { }


  saveRecipes(){
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.http.put('https://vjezba-1b64c-default-rtdb.firebaseio.com/recipes.json',recipes).subscribe( resposne => {
      console.log(resposne)
    })
  }

  getRecipes(){
    return this.http.get<Recipe[]>('https://vjezba-1b64c-default-rtdb.firebaseio.com/recipes.json')
    .pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients :  [] };
      })
    }),
    tap(recipes => {
      this.recipeService.setRecipes(recipes)
    })
  )}
}


