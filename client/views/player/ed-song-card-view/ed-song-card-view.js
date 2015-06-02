( function( polymer ) {
  "use strict";

  Promise.all([
    System.import( "domain/ed/services/ed-player-service" )
  ]).then(function( imported ) {
    var
      playerService = imported[ 0 ].default,
      intervalTime = 500,
      updateTimeHandler,
      playerServiceEventHandler,
      injectStatsHandler,
      resetRatingHandler;

    // helpers
    resetRatingHandler = function() {
      this.songCompleted = false;
      this.hasRated = false;
    };

    updateTimeHandler = function( tempValue, isScrubbing ) {
      var currentValue;

      if ( isScrubbing ) {
        currentValue = playerService.scrubTo( tempValue );
      } else {
        currentValue = playerService.currentTime;
      }

      this.mainPlayer.setAttribute( "max", playerService.trackLength );
      this.mainPlayer.setAttribute( "value", currentValue );
    };

    playerServiceEventHandler = function( event ) {
      var eventType = event.detail.name,
        currentVal = event.detail.currentVal;

      if ( eventType === "pause" || eventType === "stop" ) {
        playerService.pause();
        clearInterval( this.intervalId );
      }

      if ( eventType === "play" ) {
        playerService.play();

        this.intervalId = setInterval( this.handler.updateTime, intervalTime );
        this.mainPlayer.setAttribute( "image", playerService.currentStats.playing.art.phoneLarge );
        this.miniPlayer.setAttribute( "image", playerService.currentStats.playing.art.phoneLarge );

        this.handler.injectStats();
      }

      if ( eventType === "scrubStart" ) {
        this.handler.updateTime( currentVal, true );
      }

      if ( eventType === "rate" ) {
        playerService.rateTrack( currentVal );
        this.hasRated = true;

        if ( this.songCompleted ) {
          this.handler.resetRating();
          playerService.skip();
        }
      }

      if ( eventType === "skip" ) {
        this.trackName.classList.add( "loading" );
        this.artistName.classList.add( "loading" );
        this.ratingsForm.classList.remove( "show" );

        playerService.skip();
      }

      if ( eventType === "showRatings" ) {
        if ( !this.ratingsForm.classList.contains( "show" )) {
          this.ratingsForm.classList.add( "show" );
        }

        if ( !this.disableText.classList.contains( "hide" )) {
          this.disableText.classList.add( "hide" );
        }
      }

      if ( eventType === "showMainPlayer" ) {
        this.miniPlayerWrapper.classList.remove( "show-mini" );
        this.mainPlayerWrapper.classList.remove( "hide-main" );
        this.songCardWrapper.classList.remove( "minimized" );
      }

      if ( eventType === "songComplete" ) {
        this.songCompleted = true;

        if ( this.hasRated ) {
          this.handler.resetRating();
          playerService.skip();
        }
      }
    };

    injectStatsHandler = function() {
      this.$[ "complete-listens" ].shadowRoot.querySelector( ".rank-box " ).innerText = playerService.userStats.completedListens;
      this.$[ "songs-rated" ].shadowRoot.querySelector( ".rank-box " ).innerText = playerService.userStats.ratedTracks;
    };

    polymer( "ed-song-card-view", {
      /* LIFECYCLE */
      playerService: playerService,
      hasRated: false,
      songCompleted: false,
      ready: function() {
        // dom selectors
        this.animationWrapper = document.getElementById( "animation-wrapper" );
        this.songCard = document.getElementById( "song-card" );
        this.songCardWrapper = this.$[ "song-card-wrapper" ];
        this.mainPlayer = this.$[ "main-player" ];
        this.mainPlayerWrapper = this.$[ "main-player-wrapper" ];
        this.miniPlayer = this.$[ "mini-player" ];
        this.miniPlayerWrapper = this.$[ "mini-player-wrapper" ];
        this.trackName = this.$[ "star-rating" ].shadowRoot.querySelector( "#track-name" );
        this.artistName = this.$[ "star-rating" ].shadowRoot.querySelector( "#artist-name" );
        this.ratingsForm = this.$[ "star-rating" ].shadowRoot.getElementById( "rating-form-wrapper" );
        this.disableText = this.$[ "star-rating" ].shadowRoot.getElementById( "disable-text" );

        // Event Handler
        this.handler = {
          updateTime: updateTimeHandler.bind( this ),
          playerServiceEvent: playerServiceEventHandler.bind( this ),
          injectStats: injectStatsHandler.bind( this ),
          resetRating: resetRatingHandler.bind( this )
        };
      },
      attached: function() {
        // bind events
        this.addEventListener( "scrubberUpdate", this.handler.playerServiceEvent );
      },
      detached: function() {
        clearInterval( this.intervalId );

        this.removeEventListener( "scrubberUpdate", this.handler.playerServiceEvent );
      },
      attributeChanged: function( attrName, oldValue, newValue ) {

      },
      /* open/close methods slide player up & down */
      open: function() {
        this.miniPlayerWrapper.classList.remove( "close" );
        this.mainPlayerWrapper.classList.remove( "close" );
        this.songCardWrapper.classList.remove( "minimized" );
        this.animationWrapper.classList.remove( "player-padding" );
      },
      close: function() {
        this.miniPlayerWrapper.classList.add( "close" );
        this.mainPlayerWrapper.classList.add( "close" );
        this.songCardWrapper.classList.add( "minimized" );
        this.animationWrapper.classList.add( "player-padding" );
      },
      /* show/hide methods toggle entire song cards display/visibility */
      show: function() {
        this.songCard.classList.remove( "hidden" );
      },
      hide: function() {
        this.miniPlayerWrapper.classList.remove( "close" );
        this.songCard.classList.add( "hidden" );
        this.animationWrapper.classList.remove( "player-padding" );
      }
      /* PROPERTIES */
      /* METHODS */
    });
  });
})( window.Polymer );
