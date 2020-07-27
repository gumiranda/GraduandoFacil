import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { UserServiceProvider } from './../user/user.service';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Denuncia } from '../../models/denuncia.model';
import { BaseService } from '../base.service';
import { User } from '../../models/user.model';

@Injectable()
export class DenunciaService extends BaseService {
  denuncias: FirebaseListObservable<Denuncia[]>;
items;
  feeds;

  constructor(public userService:UserServiceProvider,
    public af: AngularFire, public http: Http, @Inject(FirebaseApp) public firebaseApp: any) {
    super();
    this.setDenuncias();

    
  }
 

  users: FirebaseListObservable<User[]>;
  delete(denuncia:Denuncia,/*userId:string*/) : firebase.Promise<void>{
    return this.af.database.object(`/denuncias/${denuncia.$key}`).remove().catch(this.handlePromiseError);
  }
  get(userId: string): FirebaseObjectObservable<Denuncia> {
    return <FirebaseObjectObservable<Denuncia>>this.af.database.object(`/denuncias/${userId}`)
      .catch(this.handleObservableError);
  }
  getAllDenuncias(): FirebaseListObservable<Denuncia[]>{
    return <FirebaseListObservable<Denuncia[]>> this.af.database.list(`denuncias/`,{
      query :{
        orderByChild: 'timestamp',
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).catch(this.handleObservableError); 
    }
    getDenuncias(userId1: string): FirebaseListObservable<Denuncia[]>{
      return <FirebaseListObservable<Denuncia[]>> this.af.database.list(`/denuncias/${userId1}`,{
        query :{
          orderByChild: 'timestamp',
          //limita o numero de mensagens que ira aparecer na tela
        }
      }).catch(this.handleObservableError); 
      }
      create(denuncia: Denuncia): firebase.Promise<void> {
        return this.af.database.list(`/denuncias/`).push(denuncia).catch(this.handlePromiseError);
      }
     
      public setDenuncias(): void {
        this.af.auth.subscribe(
          (authState: FirebaseAuthState) => {
            if (authState) {
              this.denuncias = <FirebaseListObservable<Denuncia[]>>this.af.database.list(`/denuncias/`, {
                query: {
                  orderByChild: 'timestamp'
                }
              }).map((denuncias: Denuncia[]) => {
                return denuncias.reverse();
              }).catch(this.handleObservableError);
            }
          }
        );
      }

}