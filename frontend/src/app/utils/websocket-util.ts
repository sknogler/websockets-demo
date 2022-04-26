import {Subject} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";

export class WebsocketUtil<T> {
  public message: Subject<T>
  public errorMessage: Subject<any>
  public sessionId: number
  public socket: WebSocketSubject<T> | null

  constructor() {
    this.message = new Subject<T>();
    this.errorMessage = new Subject();
    this.sessionId = Date.now();
    this.socket = null;
  }

  public connect(): void{
    this.socket = webSocket<T>({
      url: "ws://localhost:8080/ws/" + this.sessionId,
      deserializer: msg => msg.data
    })

    this.socket.subscribe({
      next: msg => this.message.next(msg),
      error: err => this.errorMessage.next(err)
    })
  }


  public sendMessage(message: T): void{
    if (this.socket){
      this.socket.next(message);
    }
  }
}


