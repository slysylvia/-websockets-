/*jshint strict: false*/

// 5 min -- 300000
// 2.5 min -- 150000

var generateToken,
  EDWebSocketTimeoutError,
  requestTimeout = 150000,
  isAuthenticated = Symbol( "isAuthenticated" ),
  token = 0;

import { default as HealingWebSocket, symbols } from "domain/lib/connection/HealingWebSocket";
import url from "domain/ed/urls";
import createEvent from "domain/lib/event/create-event";
import edUserService from "domain/ed/services/ed-user-service";

generateToken = function() {
  return ++token;
};

// Create a custom error class
// Can't extend builtins so we have to do it old school
EDWebSocketTimeoutError = function( message ) {
  this.message = message || "EDWebSocket request timed out";

  if ( "captureStackTrace" in Error ) {
    Error.captureStackTrace( this, EDWebSocketTimeoutError );
  } else {
    this.stack = ( new Error() ).stack;
  }
};

EDWebSocketTimeoutError.prototype = Object.create( Error.prototype );
EDWebSocketTimeoutError.prototype.name = "EDWebSocketTimeoutError";
EDWebSocketTimeoutError.prototype.constructor = EDWebSocketTimeoutError;

/**
 * @class EDWebSocket
 * @extends HealingWebSocket
 */
export default class EDWebSocket extends HealingWebSocket {
  constructor() {
    super( url.path );
    this[ isAuthenticated ] = false;

    // TODO Account for if "clear" method is called
    this.on( "close", () => {
      console.log( "socket was closed" );
      this[ isAuthenticated ] = false;
    });
  }

  get isAuthenticated() {
    return this[ isAuthenticated ];
  }

  authenticate( email, password ) {
    var authBlock = {
      auth: {
        email,
        password
      }
    };

    return new Promise(( resolve, reject ) => {
      var checkForAuthResponse = event => {
        var response;

        if ( !this.isOpen ) {
          this.once( "open", () => resolve( this.authenticate( email, password )));
          return;
        }

        // console.log( "in socket auth received message event:", event );

        try {
          response = JSON.parse( event.data );
        } catch ( error ) {
          console.error( error.stack );
          reject( error );
          return;
        }

        // validate response
        if ( response.status.code === 1 && "profileId" in response.data && "userId" in response.data ) {
          resolve( event );

          this[ isAuthenticated ] = true;

          this.dispatch( createEvent( "authenticated", {
            detail: {
              task: "for future self"
            }
          }));

          this.off( "message", checkForAuthResponse );
        } else if ( response.status.code === 11 ) {
          resolve( event );
          this[ isAuthenticated ] = false;
        }
      };

      // send to socket & bind message events
      this.send( authBlock );
      this.on( "message", checkForAuthResponse );
    });
  }

  request( data ) {
    var newToken;

    if (
      data instanceof ArrayBuffer ||
      data instanceof Blob ||
      data instanceof String ||
      typeof data === "string"
    ) {
      throw new TypeError( "EDWebSocket request function only accepts simple objects" );
    }

//    console.log( "request called with data: %o", data );

    if ( !data.hasOwnProperty( "action" ) ) {
      data.action = {};
    }

    newToken = generateToken();
    data.action.responseToken = newToken;

    return new Promise(( resolve, reject ) => {
      var
        timeoutId,
        handler = ( event ) => {
          var responseData;

          try {
            responseData = JSON.parse( event.data );
          } catch ( error ) {
            console.warn( "error in request handler" );
            console.error( error );
            responseData = event;
          }

          if ( "meta" in responseData && responseData.meta.responseToken === newToken ) {
            resolve( event );
            window.clearTimeout( timeoutId );
            this.off( "message", handler );
          }
        }; // end handler function

      this.on( "message", handler );
      this.send( data );

      // Set a timeout to reject promise if request takes too long
      timeoutId = window.setTimeout(() => {
        console.warn( "timeout! %o", data );
        reject( new EDWebSocketTimeoutError( `Request to ${data.action.route} with response token ${ data.action.responseToken } timed out` ) );
        this.off( "message", handler );
      }, requestTimeout );
    });
  }

  [ symbols.heal ]( data ) {
    console.log( "edSocket is being healed" );

    if ( edUserService.isOpenSession && edUserService.sessionAuthJSON != null ) {
      this.authenticate(
        edUserService.sessionAuthJSON.email,
        edUserService.sessionAuthJSON.password
      );
    }

    super[ symbols.heal ]( data );
  }
}
