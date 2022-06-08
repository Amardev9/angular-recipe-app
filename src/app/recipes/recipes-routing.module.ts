import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { EditRecipeComponent } from "./edit-recipe/edit-recipe.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeResolverService } from "./recipe-resolver.service";
import { RecipesComponent } from "./recipes.component";
import { StartComponent } from "./start/start.component";

const routes: Routes = [
    {path: '', component: RecipesComponent, canActivate: [AuthGuard],children:[
        {path: '', component: StartComponent},
        {path:'new', component: EditRecipeComponent},
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
        {path:':id/edit', component: EditRecipeComponent, resolve: [RecipeResolverService]},
      ]},
];
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RecipeRoutingModule {}