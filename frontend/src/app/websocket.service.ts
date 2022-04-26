import { Injectable } from '@angular/core';
import {WebsocketUtil} from "./utils/websocket-util";
import {Observable} from "rxjs";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebsocketUtil<string> | null

  constructor() {
    this.socket = null;
  }

  public getSessionId(): number | undefined{
    return this.socket?.sessionId;
  }

  connect(): Observable<string>{
    if (!this.socket){
      this.socket = new WebsocketUtil()
      this.socket.connect()

      this.socket.errorMessage.subscribe(value => {
        console.log(value);
      })
    }

    return this.socket.message;
  }

  sendMessage(message: string): void{
    this.socket?.sendMessage(message);
  }

}
