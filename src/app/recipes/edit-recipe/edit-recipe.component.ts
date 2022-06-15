import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as RecipesActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  id:number;
  editMode:boolean = false;
  recipeForm: FormGroup;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<fromApp.AppState>) { }
    private storeSub: Subscription;

  ngOnInit(): void {
    this.route.params.subscribe(
      ((params:Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
       this.initForm();
      })
    )
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  private initForm(){
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode){
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipe').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe,index) => {
          return index === this.id
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if( recipe['ingredients']) {
        for(let ingredienent of recipe.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredienent.name, Validators.required),
              'amount': new FormControl(ingredienent.amount,[
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        }
      }
        

      })

      
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    })
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
    // const newRecipe = new  Recipe(
    // this.recipeForm.value['name'], 
    // this.recipeForm.value['description'],
    // this.recipeForm.value['imagePath'],
    // this.recipeForm.value['ingredients']);

    if(this.editMode){
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value); // or newRecipe 
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}))
    }else{
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }
  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(): void {
   if(this.storeSub){
    this.storeSub.unsubscribe()
   }
  }
}
