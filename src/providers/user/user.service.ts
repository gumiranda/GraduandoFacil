import { Platform } from 'ionic-angular';
import { User } from './../../models/user.model';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState, FirebaseApp } from 'angularfire2';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs/Observable';

import { BehaviorSubject } from 'rxjs';

//import * as firebase from 'firebase';
/*
  Generated class for the UserProvider provider.
 
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserServiceProvider extends BaseService {
  private nbObjects: BehaviorSubject<any> = new BehaviorSubject<any>(150);



  users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;

  constructor(public af: AngularFire,
    public platform:Platform,
    /*@Inject(FirebaseApp) public firebaseApp: firebase.app.App*/
    @Inject(FirebaseApp) public firebaseApp: any,  public http: Http) {
    super();
    this.nbObjects.next(this.nbObjects.getValue() + 100);    
      // nao precisa mais   this.users = this.af.database.list(`/users`);
    this.listenAuthState();

  }

  
  loadMoreObjects() : void {
		this.nbObjects.next(this.nbObjects.getValue() + 100); 
	}

  private listenAuthState(): void {
    this.af.auth.subscribe(
      (authState: FirebaseAuthState) => {
        if (authState) {
          
          this.currentUser = this.af.database.object(`/users/${authState.auth.uid}`);
        /*this.currentUser.forEach(e=>{
          if(e.name === undefined){
this.delete(e.$key);
          }
        });
        */
          // this.setUsersPerto(this.arrayUsuariosDistantes);
        //console.log("usersprovider");
        //this.users = this.getAllUsers(authState.auth.uid);
        this.setUsers(authState.auth.uid);
        }
      }
    );
  }

  private setUsers(uidToExclude: string): void {
    this.users = <FirebaseListObservable<User[]>>this.af.database.list(`users`, {
      query: {
        orderByChild: 'name',
        limitToLast : this.nbObjects
      }
    }).map((users: User[]) => {
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }
  getAllUsers(uidToExclude: string): FirebaseListObservable<User[]>{
    return <FirebaseListObservable<User[]>> this.af.database.list(`/users`,{
      query :{
        orderByChild: 'name',
        limitToLast : this.nbObjects
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).map((users: User[]) => {
      return users.filter((user: User) =>
        user.$key !== uidToExclude 
        );
    })
    .catch(this.handleObservableError); 
    }
    getLoca(key:string){
      this.getLocalization(key).forEach(e=>{
        if(e.l === undefined){
        return false;
      }else{
        return true;
      }
      }); 
    }

  get(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>>this.af.database.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  }
  getLocalization(userId: string): FirebaseObjectObservable<any> {
    return <FirebaseObjectObservable<User>>this.af.database.object(`/localizacaoUsuarios/${userId}`)
      .catch(this.handleObservableError);
  }
  create(user: User, uuid: string): firebase.Promise<void> {
    //   return this.af.database.list(`/users`).push(user);
    //return this.users.push(user); 
    return this.af.database.object(`/users/${uuid}`).set(user).catch(this.handlePromiseError);
  }
edit(user:{name:string,distance:number,curso:string,faculdade:string,photo:string}) : firebase.Promise<void>{
  return this.currentUser.update(user).catch(this.handlePromiseError);
}

uploadPhoto(file:File,userId:string) :firebase.storage.UploadTask {
  return this.firebaseApp.storage().ref().child(`/users/${userId}`).put(file);
}

  /* // OUTRO MODO DE FAZER
  ref = firebase.database().ref('users/');
  
  create(user:User) {
   let newData = this.ref.push();
   newData.set(user);
  }
  
  
  */
  userExists(username: string): Observable<boolean> {
    return this.af.database.list(`/users`, {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }
  localizacaoExists(username: string): Observable<boolean> {
    return this.af.database.list(`/localizacaoUsuarios/${username}`, { 
    }).map((users: any[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }
  delete(user:string/*userId:string*/) : firebase.Promise<void>{
    return this.af.database.object(`/users/${user}`).remove().catch(this.handlePromiseError);
  }
  emailExists(email: string): Observable<boolean> {
    return this.af.database.list(`/users`, {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }

}
