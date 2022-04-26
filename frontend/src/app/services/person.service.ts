import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Person } from '../models/models';
import {WebsocketService} from "../websocket.service";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private readonly personSubject: BehaviorSubject<Person[]>;

  constructor(private readonly backend: BackendService,
              private readonly webSocket: WebsocketService) {
    this.personSubject = new BehaviorSubject<Person[]>([]);
    this.connectWS()
  }

  public fetchPersons(): void {
    this.backend.get<Person[]>('persons').then(persons => {

      persons.map(p => {
        return {
          ...p,
          birthdate: new Date(p as any)
        }
      });

      this.personSubject.next(persons)
    });
  }

  private connectWS(): void{
    this.webSocket.connect().subscribe(value => {
      console.log(value);
      const person: Person = JSON.parse(JSON.parse(value))


      //this.personSubject.next([...this.personSubject.value, person])

      //alle personen de ma hobn
      const persons: Person[] = this.personSubject.value
      //gebn de neiche person dazua
      persons.push(person)
      //publishen des ganze
      this.personSubject.next(persons)
    })
  }

  public getPersons(): Observable<Person[]> {
    return this.personSubject;
  }

  public createPerson(person: Person): void {
    const body = {
      name: person.name,
      email: person.email,
      birthdate: this.formatDate(person.birthdate)
    };

    this.backend.post<Person>('persons', body).then(value => {
      console.log(value)
      this.webSocket.sendMessage(JSON.stringify(value))
      //des isses
    });
  }

  private formatDate(date: Date): string {
    return `${ date.getFullYear() }-${ ('0' + (date.getMonth() + 1)).slice(-2) }-${ ('0' + (date.getDate())).slice(-2) }`;
  }
}
