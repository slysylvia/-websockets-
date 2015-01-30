( function( Polymer ) {
  "use strict";

  Polymer( "flip-box", {
    get trigger() {
      return this._trigger;
    },
    set trigger( value ) {
      this.setAttribute( "trigger", value );
      this._trigger = value;
      return value;
    },
    get animation() {
      return this._animation;
    },
    set animation( value ) {
      this.setAttribute( "animation", value );
      this._animation = value;
      return value;
    },
    get rotation() {
      return this._rotation;
    },
    set rotation( value ) {
      this.setAttribute( "rotation", value );
      this._rotation = value;
      return value;
    },

    /*** LIFECYCLE ***/
    ready: function() {
      this._animation = this.attributes.animation.value;
      this._rotation = this.attributes.rotation.value;
      this._trigger = this.attributes.trigger.value;
      this.boxEventList = [ "mouseover", "touchmove" ];
      this.btnEventList = [ "mousedown", "touchstart" ];
      this.loopEventList = [ "mouseout", "touchleave" ];
      this.flipBoxContainer = this.shadowRoot
        .getElementsByClassName( "flipbox-container" )[ 0 ];
      this.flipListener = this.flip.bind( this );
      this.rotationListener = this.boxRotation.bind( this );
      this.triggerBoxes = Array.from( this.shadowRoot.getElementsByClassName( "box" ) );
      this.triggerButtons = Array.from( this.shadowRoot
        .getElementsByClassName( "flipbox-button" ) );
    },
    attached: function() {
      console.log( this.attributes );

      if ( this.trigger === "btn" ) {
        this.trigger = "btn";
        this.btnHiddenClass( "remove" );
      } else {
        this.trigger = "box";
        this.btnHiddenClass( "add" );
      }

      if ( this.animation === "vertical" ) {
        this.animation = "vertical";
      } else {
        this.animation = "horizontal";
      }

      if ( this.rotation === "loop" ) {
        this.rotation = "loop";
        this.flipBoxContainer.classList.add( "pause" );

        if ( this.trigger === "btn" ) {
          this.btnLoopListener( "add" );
        } else {
          this.boxLoopListener( "add" );
        }
      } else {
        this.rotation = "toggle";

        if ( this.trigger === "btn" ) {
          this.btnToggleListener( "add" );
        } else {
          this.boxToggleListener( "add" );
        }
      }
    },
    /*** FUNCTIONS ***/
    flip: function() {
      this.flipBoxContainer.classList.toggle( "flip" );
    },
    boxRotation: function() {
      if ( this.flipBoxContainer.classList.contains( "pause" ) ) {
        this.flipBoxContainer.classList.remove( "pause" );
        return;
      }
      this.flipBoxContainer.classList.add( "pause" );
      this.flipBoxContainer.addEventListener( "webkitAnimationEnd", function() {
        this.flipBoxContainer.style.webkitAnimationPlayState = "paused";
      });
    },
    /* EVENT LISTENERS */
    btnHiddenClass: function( flag ) {
      this.triggerButtons.forEach( function( button ) {
        button.classList[ flag ]( "hidden" );
      }, this );
    },
    btnToggleListener: function( flag ) {
      this.triggerButtons.forEach( function( button ) {
        this.btnEventList.forEach( function( event ) {
          button[ flag + "EventListener" ]( event, this.flipListener );
        }.bind( this ) );
      }.bind( this ) );
    },
    boxToggleListener: function( flag ) {
      this.triggerBoxes.forEach( function( box ) {
        this.boxEventList.forEach( function( event ) {
          box[ flag + "EventListener" ]( event, this.flipListener );
        }.bind( this ) );
      }.bind( this ) );
    },
    btnLoopListener: function( flag ) {
      this.triggerButtons.forEach( function( button ) {
        this.btnEventList.forEach( function( event ) {
          button[ flag + "EventListener" ]( event, this.rotationListener );
        }.bind( this ) );
      }.bind( this ) );
    },
    boxLoopListener: function( flag ) {
      this.triggerBoxes.forEach( function( box ) {
        this.loopEventList.forEach( function( event ) {
          box[ flag + "EventListener" ]( event, this.rotationListener );
        }.bind( this ) );
      }.bind( this ) );
    },
    /* ATTRIBUTE CHANGE */
    attributeChanged: function( attrName, oldVal, newVal ) {
      // trigger
      if ( attrName === "trigger" ) {
        this.trigger = newVal;

        if ( newVal === "btn" ) {
          this.boxToggleListener( "remove" );
          this.boxLoopListener( "remove" );
          this.btnToggleListener( "add" );
          this.btnLoopListener( "add" );
          this.btnHiddenClass( "remove" );
        } else {
          this.btnHiddenClass( "add" );
          this.trigger = "box";
          this.boxListener( "add" );
        }
      // animation
      } else if ( attrName === "animation" ) {
        this.animation = newVal;

        if ( newVal === "vertical" ) {
          this.animation = "vertical";
        } else {
          this.animation = "horizontal";
        }
      // rotation
      } else if ( attrName === "rotation" ) {
        this.rotation = newVal;

        if ( newVal === "loop" ) {
          this.rotation = "loop";

          if ( this.trigger === "btn" ) {
            this.boxLoopListener( "remove" );
            this.btnLoopListener( "add" );
          } else {
            this.btnLoopListener( "remove" );
            this.boxLoopListener( "add" );
          }
        } else {
          this.rotation = "toggle";

          if ( this.trigger === "btn" ) {
            this.boxToggleListener( "remove" );
            this.btnToggleListener( "add" );
          } else {
            this.btnToggleListener( "remove" );
            this.boxToggleListener( "add" );
          }
        }
      }
    }
    /*** END FUNCTIONS ***/
  });
})( window.Polymer );
