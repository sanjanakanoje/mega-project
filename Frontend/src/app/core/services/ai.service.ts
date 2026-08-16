// import { Injectable } from '@angular/core';

// import {
//   HttpClient,
//   HttpHeaders
// } from '@angular/common/http';

// import { Observable } from 'rxjs';


// @Injectable({
//   providedIn: 'root'
// })
// export class AiService {

//   private apiUrl =
//     'http://localhost:5000/api/ai';


//   constructor(
//     private http: HttpClient
//   ) {}


//   sendMessage(
//     message: string,
//     conversationId: number | null
//   ): Observable<any> {

//     const token =
//       localStorage.getItem('token');


//     // No token = do not send AI request
//     if (!token) {

//       throw new Error(
//         'User is not authenticated.'
//       );

//     }


//     const headers =
//       new HttpHeaders({

//         'Content-Type':
//           'application/json',

//         'Authorization':
//           `Bearer ${token}`

//       });


//     const body = {

//       message: message,

//       conversationId:
//         conversationId

//     };


//     return this.http.post<any>(

//       `${this.apiUrl}/chat`,

//       body,

//       {
//         headers: headers
//       }

//     );

//   }

// }


















import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AiService {


  private apiUrl =
    'http://localhost:5000/api/ai';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // HEADERS
  // =====================================================

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');


    return new HttpHeaders({

      'Content-Type':
        'application/json',

      'Authorization':
        `Bearer ${token}`

    });

  }


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  sendMessage(
    message: string,
    conversationId: number | null
  ): Observable<any> {

    const body = {

      message,

      conversationId

    };


    return this.http.post(

      `${this.apiUrl}/chat`,

      body,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // GET CONVERSATIONS
  // =====================================================

  getConversations(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/conversations`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // GET CONVERSATION MESSAGES
  // =====================================================

  getConversationMessages(
    conversationId: number
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/conversations/${conversationId}/messages`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // DELETE CONVERSATION
  // =====================================================

  deleteConversation(
    conversationId: number
  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/conversations/${conversationId}`,

      {
        headers:
          this.getHeaders()
      }

    );

  }

}