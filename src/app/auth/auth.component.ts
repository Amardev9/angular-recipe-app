import { Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { Store } from '@ngrx/store';
import * as formApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {
  storeSub: Subscription;
  isLoginMode = true;
  isLoading = false;
  error:string = ''
  constructor( 
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<formApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.showErrorAlert(this.error)
      }
    })
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm){
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      // authObs = this.authService.login(email,password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}))

    }else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}))
    }
    form.reset()
    
  }

  onHandleError(){
    this.store.dispatch(new AuthActions.ClearError())
  }

  private showErrorAlert(message:string){
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
  }

  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe()
    }
  }
}
