import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as formShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  sub: Subscription;
  editMode = false;
  editedItem: Ingredient;
  @ViewChild('form') slForm: NgForm;

  constructor(private store:Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.sub = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        })
      }else{
        this.editMode = false;
      }
    })
  }

  onAddItem(form: NgForm){
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    }else{
      // this.slService.addIngredients(newIngredient)
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.onClear()
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }


  onDelete(){
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear()
  }
  

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
}

