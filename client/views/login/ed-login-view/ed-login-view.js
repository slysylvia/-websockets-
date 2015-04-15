( function( polymer, System ) {
  "use strict";

  Promise.all([
    System.import( "domain/ed/objects/model-type-checker" ),
    System.import( "domain/ed/services/ed-user-service" )
  ])
    .then( function( imported ) {
      var
        userService = imported[ 1 ].default,
        typeChecker = imported[ 0 ].default,
        clickEvents = [ "mousedown", "touchstart" ];

      polymer( "ed-login-view", {
        /* LIFECYCLE */
        ready: function() {
          this.loginForm = this.shadowRoot.getElementById( "login-form" );
          this.submitButton = this.shadowRoot.getElementById( "login-submit" );
          this.signUpButton = this.shadowRoot.getElementById( "sign-up-button" );
        },
        attached: function() {
          clickEvents.forEach(function( eventName ) {
            this.submitButton.addEventListener( eventName, this.submitForm.bind( this ));
            this.signUpButton.addEventListener( eventName, this.goToSignUpPage.bind( this ));
          }.bind( this ));

          this.submitButton.addEventListener( "keydown", function( event ) {
            if ( event.keyCode === 13 ) {
              this.submitForm( event );
            }

            return false;
          }.bind( this ));
        },
        submitForm: function( event ) {
          event.preventDefault();

          var
            email = this.loginForm.querySelector( ".email" )
              .shadowRoot.querySelector( "input" ).value,
            password = this.loginForm.querySelector( ".password" )
              .shadowRoot.querySelector( "input" ).value;

          userService.login( email, password )
            .then(function( edProfile ) {
              var redirectTo;

              if ( typeChecker.isArtist( edProfile ) ) {
                redirectTo = "/artist/" + edProfile.id;
              } else {
                redirectTo = "/fan/" + edProfile.id;
              }

              this.router.go( redirectTo );
            }.bind( this ));
        },
        goToSignUpPage: function() {
          this.router.go( "/register" );
        },
        detached: function() {},
        attributeChanged: function( attrName, oldValue, newValue ) {}
        /* PROPERTIES */
        /* METHODS */
      });
    });
})( window.Polymer, window.System );
