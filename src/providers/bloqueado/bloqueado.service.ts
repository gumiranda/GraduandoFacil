import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { UserServiceProvider } from './../user/user.service';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Bloqueado } from '../../models/bloqueado.model';
import { BaseService } from '../base.service';
import { User } from '../../models/user.model';

@Injectable()
export class BloqueadoService extends BaseService {
  bloqueados: FirebaseListObservable<Bloqueado[]>;
items;
  feeds;

  constructor(public userService:UserServiceProvider,
    public af: AngularFire, public http: Http, @Inject(FirebaseApp) public firebaseApp: any) {
    super();
    this.setBloqueados();

    
  }
 

  users: FirebaseListObservable<User[]>;
  delete(bloqueado:Bloqueado,/*userId:string*/) : firebase.Promise<void>{
    return this.af.database.object(`/bloqueados/${bloqueado.$key}`).remove().catch(this.handlePromiseError);
  }
  get(userId: string): FirebaseObjectObservable<Bloqueado> {
    return <FirebaseObjectObservable<Bloqueado>>this.af.database.object(`/bloqueados/${userId}`)
      .catch(this.handleObservableError);
  }
  getAllBloqueados(userid:string): FirebaseListObservable<Bloqueado[]>{
    return <FirebaseListObservable<Bloqueado[]>> this.af.database.list(`bloqueados/${userid}`,{
      query :{
        orderByChild: 'flagBloqueou',
        equalTo:1
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).catch(this.handleObservableError); 
    }
    getAllQuemMeBloqueou(userid:string): FirebaseListObservable<Bloqueado[]>{
      return <FirebaseListObservable<Bloqueado[]>> this.af.database.list(`bloqueados/${userid}`,{
        query :{
          orderByChild: 'flagBloqueou',
          equalTo:2
          //limita o numero de mensagens que ira aparecer na tela
        }
      }).catch(this.handleObservableError); 
      }
    getBloqueados(userId1: string): FirebaseListObservable<Bloqueado[]>{
      return <FirebaseListObservable<Bloqueado[]>> this.af.database.list(`/bloqueados/${userId1}`,{
        query :{
          orderByChild: 'timestamp',
          //limita o numero de mensagens que ira aparecer na tela
        }
      }).catch(this.handleObservableError); 
      }
      create(bloqueado: Bloqueado): firebase.Promise<void> {
        return this.af.database.list(`/bloqueados/${bloqueado.bloqueante}`).push(bloqueado).catch(this.handlePromiseError);
      }
     
      public setBloqueados(): void {
        this.af.auth.subscribe(
          (authState: FirebaseAuthState) => {
            if (authState) {
              this.bloqueados = <FirebaseListObservable<Bloqueado[]>>this.af.database.list(`/bloqueados/${authState.auth.uid}`, {
                query: {
                  orderByChild: 'timestamp'
                }
              }).map((bloqueados: Bloqueado[]) => {
                return bloqueados.reverse();
              }).catch(this.handleObservableError);
            }
          }
        );
      }

}