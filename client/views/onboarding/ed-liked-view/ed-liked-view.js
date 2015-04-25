( function( polymer ) {
  "use strict";

  Promise.all([
    System.import( "domain/ed/services/ed-discover-service" )
  ]).then(function( imported ) {
    var
      discoverService = imported[ 0 ].default,
      bubbleCounter = 0,
      bubbleArray = [],
      triggerBubblesHandler = function( event ) {
        var i, isSet;
        event.preventDefault();

        // clear array
        bubbleArray = [];

        for ( i = 0; i < this.inputBubbles.length; i++ ) {
          if ( this.inputBubbles[i].hasAttribute( "checked" ) ) {
            bubbleArray.push( this.inputBubbles[i].getAttribute( "data-id" ) );
          }
        }

        isSet = discoverService.setLikedBlend( bubbleArray );

        if ( isSet ) {
          this.router.go( "/onboarding/dislike" );
        }
      },
      triggerCounterHandler = function( event ) {
        if ( event.target.hasAttribute( "checked" ) &&
          event.target.hasAttribute( "data-id" ) &&
          bubbleCounter < 3 ) {
          bubbleCounter++;
        } else if ( !event.target.hasAttribute( "checked" ) &&
          !event.target.hasAttribute( "disabled" ) &&
          bubbleCounter !== 0 ) {
          bubbleCounter--;
        }

        return this.handlers.bubblesLiked();
      },
      bubblesLikedHandler = function( event ) {
        var i, j, k;

        // so many for loops ugh
        if ( bubbleCounter < 3 ) {
          for ( i = 0; i < this.inputBubbles.length; i++ ) {
            if ( !this.inputBubbles[ i ].hasAttribute( "checked" ) ) {
              this.inputBubbles[ i ].removeAttribute( "disabled" );
            }
          }
        }

        if ( bubbleCounter === 3 ) {
          for ( j = 0; j < this.inputBubbles.length; j++ ) {
            this.inputBubbles[ j ].setAttribute( "disabled", "" );
          }

          for ( k = 0; k < this.inputBubbles.length; k++ ) {
            if ( this.inputBubbles[ k ].hasAttribute( "checked" ) ) {
              this.inputBubbles[ k ].removeAttribute( "disabled" );
            }
          }
        }
      };

    polymer( "ed-liked-view", {
      /* LIFECYCLE */
      ready: function() {
        this.inputBubbles     = this.shadowRoot.querySelectorAll( "ed-bubble-select" );
        this.nextBtn          = this.shadowRoot.getElementById( "next-button" );
        this.bubbleContainer  = this.shadowRoot.getElementById( "bubble-container" );

        // handlers
        this.handlers = {
          triggerBubbles: triggerBubblesHandler.bind( this ),
          triggerCounter: triggerCounterHandler.bind( this ),
          bubblesLiked: bubblesLikedHandler.bind( this )
        };
      },
      attached: function() {
        this.nextBtn.addEventListener( "click", this.handlers.triggerBubbles );
        this.bubbleContainer.addEventListener( "click", this.handlers.triggerCounter );
      },
      detached: function() {
        this.nextBtn.removeEventListener( "click", this.handlers.triggerBubbles );
        this.bubbleContainer.removeEventListener( "click", this.handlers.triggerCounter );
      },
      attributeChanged: function( attrName, oldValue, newValue ) {}
      /* PROPERTIES */
      /* METHODS */
    });
  });
})( window.Polymer );
