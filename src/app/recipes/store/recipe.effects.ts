import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()

export class RecipeEffects {
    fetchRecipes = createEffect(()=> {
        return this.action$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>('https://vjezba-1b64c-default-rtdb.firebaseio.com/recipes.json')
            }),
            map(recipes => {
                return recipes.map(recipe => {
                  return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients :  [] };
                })
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes)
            })
        )
    })

    storeRecipes = createEffect(() => {
        return this.action$.pipe(ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipe')),
        switchMap(([actionData, recipeState])=>{
            return this.http.put('https://vjezba-1b64c-default-rtdb.firebaseio.com/recipes.json',recipeState.recipes)
        }))
    }, {dispatch: false})
    constructor(private action$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>){}
}