( function( polymer ) {
  "use strict";

  Promise.all([
    System.import( "domain/ed/services/ed-player-service" ),
    System.import( "domain/lib/event/create-event" )
  ]).then(function( imported ) {
    var
      playerService = imported[ 0 ].default,
      createEvent = imported[ 1 ].default,
      createUpdateEvent = function( name, detail ) {
        detail = detail || {};
        detail.name = name;

        return createEvent( "scrubberUpdate", {
          detail: detail
        });
      },
      updateCenterHandler = function() {
        var top = window.pageYOffset;
        this.mouseDown = true;

        // determines center of svg, using top to compensate for scrolling
        this.svgBox = this.svg.getBoundingClientRect();
        this.scrubCenter = [
          this.svgBox.left + this.svgBox.width / 2,
          this.svgBox.top + top + this.svgBox.height / 2
        ];
      },
      scrubFireHandler = function() {
        this.mouseDown = false;

        this.dispatchEvent( createUpdateEvent( "scrubEnd" ));
      },
      triggerMoveHandler = function( event ) {
        var angle,
          radians;

        if ( this.mouseDown ) {
          if ( event.touches ) {
            radians = Math.atan2( event.touches[ 0 ].pageX - this.scrubCenter[ 0 ], event.touches[ 0 ].pageY - this.scrubCenter[ 1 ] );
          } else {
            radians = Math.atan2( event.pageX - this.scrubCenter[ 0 ], event.pageY - this.scrubCenter[ 1 ] );
          }

          angle = ( radians * ( 180 / Math.PI ) * -1 ) + 90;
          this.currentVal = ( ( ( angle + 90 ) * this.max ) / 360 );

          this.scrubber.style.webkitTransform = "rotate(" + angle + "deg)";
          this.scrubber.style.transform = "rotate(" + angle + "deg)";

          this.shadowScrubber.style.webkitTransform = "rotate(" + angle + "deg)";
          this.shadowScrubber.style.transform = "rotate(" + angle + "deg)";

          this.front.style[ "stroke-dashoffset" ] = ( ( ( -1 * angle * this.circFront ) / 360 ) - ( this.circFront * 1.25 ) ) + "%";
          this.mid.style[ "stroke-dashoffset" ] = ( ( ( -1 * angle * this.circMid ) / 360 ) - ( this.circMid * 1.25 ) ) + "%";

          this.dispatchEvent( createUpdateEvent( "scrubStart", { currentVal: this.currentVal }));
          this.handler.updateScrub();
        }
      },
      updateScrubHandler = function() {
        var degPercent = parseInt( this.value / this.max * 360, 10 ),
          rotation = "rotate(" + ( degPercent - 90 ) + "deg)";

        this.scrubber.style.webkitTransform = rotation;
        this.scrubber.style.transform = rotation;

        //this.scrubber.style.webkitAnimation = "rotateScrubber " + this.max + "s linear";
        //this.scrubber.style.animation = "rotateScrubber " + this.max + "s linear";

        this.shadowScrubber.style.webkitTransform = rotation;
        this.shadowScrubber.style.transform = rotation;

        //this.shadowScrubber.style.webkitAnimation = "rotateScrubber " + this.max + "s linear";
        //this.shadowScrubber.style.animation = "rotateScrubber " + this.max + "s linear";

        this.front.style[ "stroke-dashoffset" ] = ( ( ( -1 * ( degPercent - 90 ) * this.circFront ) / 360 ) - ( this.circFront * 1.25 ) ) + "%";
        this.mid.style[ "stroke-dashoffset" ] = ( ( ( -1 * ( degPercent - 90 ) * this.circMid ) / 360 ) - ( this.circMid * 1.25 ) ) + "%";

        //this.front.style.webkitAnimation = "dashoffsetFill " + this.max + "s linear";
        //this.mid.style.animation = "dashoffsetFill " + this.max + "s linear";

        this.$["song-timer"].innerText = playerService.formattedDisplayTime;
      },
      skipSongHandler = function() {
        this.dispatchEvent( createUpdateEvent( "skip" ));
      },
      playerServiceEventHandler = function( event ) {
        var eventType = event.detail.type != null ? event.detail.type : this.playIcon.getAttribute( "name" );

        if ( eventType === "play" ) {
          console.log( "inside play event maiiiin" );
          this.playIcon.setAttribute( "name", "pause" );
        }

        if ( eventType === "pause" ) {
          this.playIcon.setAttribute( "name", "play" );
        }

        this.dispatchEvent( createUpdateEvent( eventType ));
      },
      initScrubberHandler = function() {
        // calculates the circumference of circles
        this.circFront = ( 2.01 * Math.PI * ( parseInt( this.front.getAttribute( "r" ), 10 )));
        this.circMid = ( 2.01 * Math.PI * ( parseInt( this.mid.getAttribute( "r" ), 10 )));
        this.front.style[ "stroke-dasharray" ] = this.circFront + "%";
        this.mid.style[ "stroke-dasharray" ] = this.circMid + "%";
      },
      mouseOutHandler = function() {
        this.mouseDown = false;
      },
      showRatingsHandler = function() {
        this.dispatchEvent( createUpdateEvent( "showRatings" ));
      };

    polymer( "ed-song-card-scrubber", {
      complete: false,
      ready: function() {
        // selectors
        this.svg = this.shadowRoot.getElementById( "svg-circle" );
        this.mid = this.shadowRoot.getElementById( "mid-circle" );
        this.front = this.shadowRoot.getElementById( "front-circle" );
        this.scrubber = this.shadowRoot.getElementById( "circle-scrubber" );
        this.shadowScrubber = this.shadowRoot.getElementById( "shadow-scrubber" );
        this.playBtn = this.shadowRoot.getElementById( "play-btn" );
        this.playIcon = this.shadowRoot.getElementById( "play-icon" );
        this.skipBtn = this.shadowRoot.getElementById( "skip-btn" );

        // event Handler
        this.handler = {
          initScrubber: initScrubberHandler.bind( this ),
          updateCenter: updateCenterHandler.bind( this ),
          scrubFire: scrubFireHandler.bind( this ),
          triggerMove: triggerMoveHandler.bind( this ),
          updateScrub: updateScrubHandler.bind( this ),
          skipSong: skipSongHandler.bind( this ),
          playerServiceEvent: playerServiceEventHandler.bind( this ),
          mouseOut: mouseOutHandler.bind( this ),
          showRatings: showRatingsHandler.bind( this )
        };

        // init
        this.mouseDown = false;
      },
      attached: function() {
        // mouse events
        this.scrubber.addEventListener( "mousedown", this.handler.updateCenter );
        this.shadowScrubber.addEventListener( "mousedown", this.handler.updateCenter );
        this.skipBtn.addEventListener( "click", this.handler.skipSong );
        this.addEventListener( "mouseup", this.handler.scrubFire );
        this.addEventListener( "mousemove", this.handler.triggerMove );
        this.addEventListener( "mouseout", this.handler.mouseOut );

        // touch events
        this.playBtn.addEventListener( "touchstart", this.handler.playerServiceEvent );
        this.scrubber.addEventListener( "touchstart", this.handler.updateCenter );
        this.shadowScrubber.addEventListener( "touchstart", this.handler.updateCenter );
        this.addEventListener( "touchend", this.handler.scrubFire );
        this.addEventListener( "touchmove", this.handler.triggerMove );

        // bind player updates through the service
        playerService.emitter.on( "playerUpdate", this.handler.playerServiceEvent );

        // init
        this.handler.initScrubber();
      },
      detached: function() {
        this.scrubber.removeEventListener( "mousedown", this.handler.updateCenter );
        this.shadowScrubber.removeEventListener( "mousedown", this.handler.updateCenter );
        this.removeEventListener( "mouseup", this.handler.scrubFire );
        this.removeEventListener( "mousemove", this.handler.triggerMove );
        this.removeEventListener( "mouseout", this.handler.mouseOut );

        // touch events
        this.playBtn.removeEventListener( "touchstart", this.handler.playerServiceEvent );
        this.scrubber.removeEventListener( "touchstart", this.handler.updateCenter );
        this.shadowScrubber.removeEventListener( "touchstart", this.handler.updateCenter );
        this.removeEventListener( "touchend", this.handler.scrubFire );
        this.removeEventListener( "touchmove", this.handler.triggerMove );

        playerService.emitter.off( "playerUpdate", this.handler.playerServiceEvent );
      },
      attributeChanged: function( attrName, oldVal, newVal ) {
        if ( attrName === "value" ) {
          this.handler.updateScrub();
        }

        if ( this.value === this.max ) {
          this.complete = true;
          this.setAttribute( "complete", "" );
          this.scrubber.style.opacity = 0;
          this.shadowScrubber.style.opacity = 0;
          this.playBtn.disabled = true;
          this.playIcon.style.opacity = 0.02;
          this.playIcon.setAttribute( "name", "play");
        } else {
          this.complete = false;
          this.removeAttribute( "complete" );
        }

        if ( this.value === this.max || Math.floor( this.value ) > 29 ) {
          this.handler.showRatings();
        }
      }
    });
  });
})( window.Polymer );
