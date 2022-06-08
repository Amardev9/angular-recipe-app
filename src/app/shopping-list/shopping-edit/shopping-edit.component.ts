import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  sub: Subscription;
  editMode = false;
  editedItemIndex:number;
  editedItem: Ingredient;
  @ViewChild('form') slForm: NgForm;

  constructor(private slService:ShoppingListService) { }

  ngOnInit(): void {
    this.sub = this.slService.startedEditing.subscribe((index: number) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.editedItem = this.slService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      })
    })
  }

  onAddItem(form: NgForm){
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, newIngredient)
    }else{
      this.slService.addIngredients(newIngredient)
    }
    this.onClear()
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }


  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear()
  }
  

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

