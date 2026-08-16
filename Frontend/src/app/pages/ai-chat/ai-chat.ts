

// import {
//   Component,
//   ChangeDetectorRef,
//   ElementRef,
//   ViewChild,
//   AfterViewChecked,
//   OnInit,
//   OnDestroy
// } from '@angular/core';

// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { AiService } from '../../core/services/ai.service';
// import { Auth } from '../../core/services/auth';

// import { Subscription } from 'rxjs';


// interface ChatMessage {
//   role: 'user' | 'assistant';
//   message: string;
// }


// @Component({
//   selector: 'app-ai-chat',

//   standalone: true,

//   imports: [
//     CommonModule,
//     FormsModule
//   ],

//   templateUrl: './ai-chat.html',

//   styleUrl: './ai-chat.css'
// })


// export class AiChat
//   implements OnInit, OnDestroy, AfterViewChecked {


//   // =========================================================
//   // CHAT BODY
//   // =========================================================

//   @ViewChild('chatBody')
//   private chatBody!: ElementRef;


//   // =========================================================
//   // LOGIN STATE
//   // =========================================================

//   isLoggedIn: boolean = false;


//   // =========================================================
//   // CHAT WINDOW STATE
//   // =========================================================

//   isChatOpen: boolean = false;


//   // =========================================================
//   // INPUT MESSAGE
//   // =========================================================

//   message: string = '';


//   // =========================================================
//   // CHAT MESSAGES
//   // =========================================================

//   messages: ChatMessage[] = [];


//   // =========================================================
//   // CONVERSATION ID
//   // =========================================================

//   conversationId: number | null = null;


//   // =========================================================
//   // LOADING STATE
//   // =========================================================

//   loading: boolean = false;


//   // =========================================================
//   // QUICK QUESTIONS
//   // =========================================================

//   quickQuestions: string[] = [

//     'What is my sample status?',

//     'How many tests are pending?',

//     'Which tests are completed?',

//     'Is my report ready?'

//   ];


//   // =========================================================
//   // AUTH SUBSCRIPTION
//   // =========================================================

//   private authSubscription?: Subscription;


//   // =========================================================
//   // CONSTRUCTOR
//   // =========================================================

//   constructor(

//     private aiService: AiService,

//     private auth: Auth,

//     private cdr: ChangeDetectorRef

//   ) {}


//   // =========================================================
//   // ON INIT
//   // =========================================================

//   ngOnInit(): void {

//     // Check current login state
//     this.isLoggedIn =
//       this.auth.isLoggedIn();


//     console.log(
//       'Initial AI Login State:',
//       this.isLoggedIn
//     );


//     // Listen for login / logout changes
//     this.authSubscription =
//       this.auth.loggedIn$.subscribe(

//         (loggedIn: boolean) => {

//           console.log(
//             'AI Authentication State:',
//             loggedIn
//           );


//           // =================================================
//           // USER LOGGED IN
//           // =================================================

//           if (loggedIn) {

//             this.isLoggedIn = true;

//             console.log(
//               'AI Assistant enabled'
//             );

//           }


//           // =================================================
//           // USER LOGGED OUT
//           // =================================================

//           else {

//             this.isLoggedIn = false;

//             // Close chatbot
//             this.isChatOpen = false;

//             // Clear input
//             this.message = '';

//             // Stop loading
//             this.loading = false;

//             // Clear messages
//             this.messages = [];

//             // IMPORTANT:
//             // Do not carry previous user's conversation
//             this.conversationId = null;

//             console.log(
//               'AI Assistant disabled and chat cleared'
//             );

//           }


//           // Update Angular UI
//           this.cdr.detectChanges();

//         }

//       );

//   }


//   // =========================================================
//   // OPEN / CLOSE CHAT
//   // =========================================================

//   toggleChat(): void {

//     // Security check
//     if (!this.isLoggedIn) {

//       console.warn(
//         'AI Chat blocked: User is not logged in.'
//       );

//       return;
//     }


//     this.isChatOpen =
//       !this.isChatOpen;


//     if (this.isChatOpen) {

//       setTimeout(() => {

//         this.scrollToBottom();

//       }, 100);

//     }

//   }


//   // =========================================================
//   // CLOSE CHAT
//   // =========================================================

//   closeChat(): void {

//     this.isChatOpen = false;

//   }


//   // =========================================================
//   // QUICK QUESTION
//   // =========================================================

//   askQuickQuestion(
//     question: string
//   ): void {

//     // User must be logged in
//     if (!this.isLoggedIn) {

//       console.warn(
//         'Cannot ask AI question: User is not logged in.'
//       );

//       return;
//     }


//     // Prevent multiple requests
//     if (this.loading) {

//       return;
//     }


//     this.message = question;

//     this.sendMessage();

//   }


//   // =========================================================
//   // ENTER / SHIFT + ENTER
//   // =========================================================

//   handleKeydown(
//     event: KeyboardEvent
//   ): void {


//     // Enter without Shift
//     // = Send message

//     if (
//       event.key === 'Enter' &&
//       !event.shiftKey
//     ) {

//       event.preventDefault();

//       this.sendMessage();

//     }


//     // Shift + Enter
//     // = New line
//     //
//     // Browser default behaviour remains.

//   }


//   // =========================================================
//   // SEND MESSAGE
//   // =========================================================

//   sendMessage(): void {


//     // =======================================================
//     // SECURITY CHECK
//     // =======================================================

//     if (!this.isLoggedIn) {

//       console.warn(
//         'AI request blocked: User is not logged in.'
//       );

//       return;
//     }


//     // =======================================================
//     // EMPTY MESSAGE CHECK
//     // =======================================================

//     if (!this.message.trim()) {

//       return;
//     }


//     // =======================================================
//     // PREVENT MULTIPLE REQUESTS
//     // =======================================================

//     if (this.loading) {

//       return;
//     }


//     // =======================================================
//     // GET USER MESSAGE
//     // =======================================================

//     const userMessage =
//       this.message.trim();


//     // =======================================================
//     // ADD USER MESSAGE
//     // =======================================================

//     this.messages = [

//       ...this.messages,

//       {
//         role: 'user',

//         message: userMessage
//       }

//     ];


//     // =======================================================
//     // CLEAR INPUT
//     // =======================================================

//     this.message = '';


//     // =======================================================
//     // START LOADING
//     // =======================================================

//     this.loading = true;


//     // =======================================================
//     // UPDATE UI
//     // =======================================================

//     this.cdr.detectChanges();

//     this.scrollToBottom();


//     console.log(
//       'Sending AI message:',
//       userMessage
//     );


//     console.log(
//       'Conversation ID:',
//       this.conversationId
//     );


//     // =======================================================
//     // CALL EXISTING AI SERVICE
//     // =======================================================

//     this.aiService

//       .sendMessage(

//         userMessage,

//         this.conversationId

//       )

//       .subscribe({

//         // ===================================================
//         // SUCCESS
//         // ===================================================

//         next: (response: any) => {


//           console.log(
//             'AI Response:',
//             response
//           );


//           // =================================================
//           // SAVE CONVERSATION ID
//           // =================================================

//           if (
//             response &&
//             response.conversationId
//           ) {

//             this.conversationId =
//               Number(
//                 response.conversationId
//               );

//           }


//           // =================================================
//           // ADD AI RESPONSE
//           // =================================================

//           if (
//             response &&
//             response.response
//           ) {

//             this.messages = [

//               ...this.messages,

//               {

//                 role: 'assistant',

//                 message:
//                   response.response

//               }

//             ];

//           }


//           // =================================================
//           // STOP LOADING
//           // =================================================

//           this.loading = false;


//           // =================================================
//           // UPDATE UI
//           // =================================================

//           this.cdr.detectChanges();


//           // =================================================
//           // SCROLL TO BOTTOM
//           // =================================================

//           this.scrollToBottom();


//           console.log(
//             'Conversation ID after response:',
//             this.conversationId
//           );

//         },


//         // ===================================================
//         // ERROR
//         // ===================================================

//         error: (error: any) => {


//           console.error(
//             'AI Chat Error:',
//             error
//           );


//           // =================================================
//           // STOP LOADING
//           // =================================================

//           this.loading = false;


//           // =================================================
//           // HANDLE UNAUTHORIZED
//           // =================================================

//           if (
//             error.status === 401 ||
//             error.status === 403
//           ) {

//             console.warn(
//               'AI request unauthorized.'
//             );


//             this.messages = [

//               ...this.messages,

//               {

//                 role: 'assistant',

//                 message:
//                   'Your session has expired. Please login again.'

//               }

//             ];

//           }


//           // =================================================
//           // OTHER ERRORS
//           // =================================================

//           else {

//             this.messages = [

//               ...this.messages,

//               {

//                 role: 'assistant',

//                 message:
//                   'Sorry, I could not process your request. Please try again.'

//               }

//             ];

//           }


//           // =================================================
//           // UPDATE UI
//           // =================================================

//           this.cdr.detectChanges();


//           // =================================================
//           // SCROLL
//           // =================================================

//           this.scrollToBottom();

//         }

//       });

//   }


//   // =========================================================
//   // AUTO SCROLL
//   // =========================================================

//   ngAfterViewChecked(): void {

//     if (
//       this.isLoggedIn &&
//       this.isChatOpen
//     ) {

//       this.scrollToBottom();

//     }

//   }


//   // =========================================================
//   // SCROLL TO BOTTOM
//   // =========================================================

//   private scrollToBottom(): void {

//     try {

//       if (!this.chatBody) {

//         return;
//       }


//       const element =
//         this.chatBody.nativeElement;


//       element.scrollTop =
//         element.scrollHeight;

//     }

//     catch (error) {

//       console.error(
//         'Chat scroll error:',
//         error
//       );

//     }

//   }


//   // =========================================================
//   // DESTROY
//   // =========================================================

//   ngOnDestroy(): void {

//     // Prevent memory leak
//     if (this.authSubscription) {

//       this.authSubscription.unsubscribe();

//     }

//   }

// }










import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AiService } from '../../core/services/ai.service';
import { Auth } from '../../core/services/auth';

import { Subscription } from 'rxjs';


interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}


interface Conversation {
  id: number;
  title: string;
  created_at: string;
  last_message?: string;
}


@Component({
  selector: 'app-ai-chat',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})


export class AiChat
  implements OnInit, OnDestroy, AfterViewChecked {


  // =========================================================
  // CHAT BODY
  // =========================================================

  @ViewChild('chatBody')
  private chatBody!: ElementRef;


  // =========================================================
  // LOGIN STATE
  // =========================================================

  isLoggedIn: boolean = false;


  // =========================================================
  // CHAT WINDOW
  // =========================================================

  isChatOpen: boolean = false;


  // =========================================================
  // INPUT
  // =========================================================

  message: string = '';


  // =========================================================
  // CURRENT CHAT MESSAGES
  // =========================================================

  messages: ChatMessage[] = [];


  // =========================================================
  // CURRENT CONVERSATION
  // =========================================================

  conversationId: number | null = null;


  // =========================================================
  // CHAT HISTORY
  // =========================================================

  conversations: Conversation[] = [];

  showHistory: boolean = false;

  historyLoading: boolean = false;


  // =========================================================
  // LOADING
  // =========================================================

  loading: boolean = false;


  // =========================================================
  // QUICK QUESTIONS
  // =========================================================

  quickQuestions: string[] = [

    'What is my sample status?',

    'How many tests are pending?',

    'Which tests are completed?',

    'Is my report ready?'

  ];


  // =========================================================
  // AUTH SUBSCRIPTION
  // =========================================================

  private authSubscription?: Subscription;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private aiService: AiService,

    private auth: Auth,

    private cdr: ChangeDetectorRef

  ) {}


  // =========================================================
  // ON INIT
  // =========================================================

  ngOnInit(): void {

    this.isLoggedIn =
      this.auth.isLoggedIn();


    console.log(
      'Initial AI Login State:',
      this.isLoggedIn
    );


    // =======================================================
    // IF USER IS ALREADY LOGGED IN
    // =======================================================

    if (this.isLoggedIn) {

      this.loadConversations();

    }


    // =======================================================
    // LISTEN LOGIN / LOGOUT
    // =======================================================

    this.authSubscription =
      this.auth.loggedIn$.subscribe(

        (loggedIn: boolean) => {

          console.log(
            'AI Authentication State:',
            loggedIn
          );


          // =================================================
          // LOGIN
          // =================================================

          if (loggedIn) {

            this.isLoggedIn = true;

            this.isChatOpen = false;

            this.messages = [];

            this.conversationId = null;

            this.message = '';

            this.showHistory = false;

            this.loadConversations();


            console.log(
              'AI Assistant enabled'
            );

          }


          // =================================================
          // LOGOUT
          // =================================================

          else {

            this.isLoggedIn = false;

            this.isChatOpen = false;

            this.message = '';

            this.loading = false;

            this.messages = [];

            this.conversationId = null;

            this.conversations = [];

            this.showHistory = false;


            console.log(
              'AI Assistant disabled and chat cleared'
            );

          }


          this.cdr.detectChanges();

        }

      );

  }


  // =========================================================
  // OPEN / CLOSE CHAT
  // =========================================================

  toggleChat(): void {

    if (!this.isLoggedIn) {

      console.warn(
        'AI Chat blocked: User is not logged in.'
      );

      return;

    }


    this.isChatOpen =
      !this.isChatOpen;


    if (this.isChatOpen) {

      this.showHistory = false;

      setTimeout(() => {

        this.scrollToBottom();

      }, 100);

    }

  }


  // =========================================================
  // CLOSE CHAT
  // =========================================================

  closeChat(): void {

    this.isChatOpen = false;

    this.showHistory = false;

  }


  // =========================================================
  // LOAD CONVERSATION LIST
  // =========================================================

  loadConversations(): void {

    if (!this.isLoggedIn) {

      return;

    }


    this.historyLoading = true;


    this.aiService
      .getConversations()
      .subscribe({

        next: (response: any) => {

          console.log(
            'AI Conversations:',
            response
          );


          this.conversations =
            response?.conversations || [];


          this.historyLoading = false;


          this.cdr.detectChanges();

        },


        error: (error: any) => {

          console.error(
            'Failed to load AI conversations:',
            error
          );


          this.conversations = [];

          this.historyLoading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // OPEN EXISTING CONVERSATION
  // =========================================================

  openConversation(
    conversation: Conversation
  ): void {

    if (!this.isLoggedIn) {

      return;

    }


    if (this.loading) {

      return;

    }


    this.historyLoading = true;

    this.showHistory = false;


    this.conversationId =
      Number(conversation.id);


    this.messages = [];


    console.log(
      'Opening conversation:',
      this.conversationId
    );


    this.aiService
      .getConversationMessages(
        this.conversationId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Conversation messages:',
            response
          );


          this.messages =
            response?.messages || [];


          this.historyLoading = false;


          this.isChatOpen = true;


          this.cdr.detectChanges();


          setTimeout(() => {

            this.scrollToBottom();

          }, 100);

        },


        error: (error: any) => {

          console.error(
            'Failed to load conversation:',
            error
          );


          this.messages = [];

          this.historyLoading = false;


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // START NEW CHAT
  // =========================================================

  startNewChat(): void {

    if (!this.isLoggedIn) {

      return;

    }


    if (this.loading) {

      return;

    }


    this.conversationId = null;

    this.messages = [];

    this.message = '';

    this.showHistory = false;


    this.cdr.detectChanges();


    setTimeout(() => {

      this.scrollToBottom();

    }, 100);

  }


  // =========================================================
  // QUICK QUESTION
  // =========================================================

  askQuickQuestion(
    question: string
  ): void {

    if (!this.isLoggedIn) {

      return;

    }


    if (this.loading) {

      return;

    }


    this.message = question;

    this.sendMessage();

  }


  // =========================================================
  // ENTER / SHIFT + ENTER
  // =========================================================

  handleKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      this.sendMessage();

    }

  }


  // =========================================================
  // SEND MESSAGE
  // =========================================================

  sendMessage(): void {

    // =======================================================
    // LOGIN CHECK
    // =======================================================

    if (!this.isLoggedIn) {

      console.warn(
        'AI request blocked: User is not logged in.'
      );

      return;

    }


    // =======================================================
    // EMPTY MESSAGE
    // =======================================================

    if (!this.message.trim()) {

      return;

    }


    // =======================================================
    // PREVENT DUPLICATE REQUEST
    // =======================================================

    if (this.loading) {

      return;

    }


    const userMessage =
      this.message.trim();


    // =======================================================
    // ADD USER MESSAGE
    // =======================================================

    this.messages = [

      ...this.messages,

      {
        role: 'user',
        message: userMessage
      }

    ];


    // =======================================================
    // CLEAR INPUT
    // =======================================================

    this.message = '';


    // =======================================================
    // LOADING
    // =======================================================

    this.loading = true;


    this.cdr.detectChanges();

    this.scrollToBottom();


    console.log(
      'Sending AI message:',
      userMessage
    );


    console.log(
      'Conversation ID:',
      this.conversationId
    );


    // =======================================================
    // CALL BACKEND
    // =======================================================

    this.aiService
      .sendMessage(

        userMessage,

        this.conversationId

      )
      .subscribe({

        // ===================================================
        // SUCCESS
        // ===================================================

        next: (response: any) => {

          console.log(
            'AI Response:',
            response
          );


          // ===============================================
          // SAVE CONVERSATION ID
          // ===============================================

          if (
            response &&
            response.conversationId
          ) {

            this.conversationId =
              Number(
                response.conversationId
              );

          }


          // ===============================================
          // ADD AI RESPONSE
          // ===============================================

          if (
            response &&
            response.response
          ) {

            this.messages = [

              ...this.messages,

              {
                role: 'assistant',
                message: response.response
              }

            ];

          }


          // ===============================================
          // STOP LOADING
          // ===============================================

          this.loading = false;


          // ===============================================
          // REFRESH HISTORY
          // ===============================================

          this.loadConversations();


          this.cdr.detectChanges();


          this.scrollToBottom();


          console.log(
            'Conversation ID after response:',
            this.conversationId
          );

        },


        // ===================================================
        // ERROR
        // ===================================================

        error: (error: any) => {

          console.error(
            'AI Chat Error:',
            error
          );


          this.loading = false;


          if (
            error.status === 401 ||
            error.status === 403
          ) {

            this.messages = [

              ...this.messages,

              {
                role: 'assistant',
                message:
                  'Your session has expired. Please login again.'
              }

            ];

          }

          else {

            this.messages = [

              ...this.messages,

              {
                role: 'assistant',
                message:
                  'Sorry, I could not process your request. Please try again.'
              }

            ];

          }


          this.cdr.detectChanges();

          this.scrollToBottom();

        }

      });

  }


  // =========================================================
  // AUTO SCROLL
  // =========================================================

  ngAfterViewChecked(): void {

    if (
      this.isLoggedIn &&
      this.isChatOpen
    ) {

      this.scrollToBottom();

    }

  }


  // =========================================================
  // SCROLL
  // =========================================================

  private scrollToBottom(): void {

    try {

      if (!this.chatBody) {

        return;

      }


      const element =
        this.chatBody.nativeElement;


      element.scrollTop =
        element.scrollHeight;

    }

    catch (error) {

      console.error(
        'Chat scroll error:',
        error
      );

    }

  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    if (this.authSubscription) {

      this.authSubscription.unsubscribe();

    }

  }

}