( function( polymer, System ) {
  "use strict";

  System.import( "domain/ed/services/ed-user-service" )
    .then( function( imported ) {
      var userService = imported.default;

      polymer( "ed-login-view", {
        /* LIFECYCLE */
        ready: function() {
          this.loginForm = this.shadowRoot.getElementById( "login-form" );
          this.submitButton = this.shadowRoot.getElementById( "login-submit" );
          this.clickEvents = [ "mousedown", "touchstart" ];
        },
        attached: function() {
          this.clickEvents.forEach( function( e ) {
            this.submitButton.addEventListener( e, this.submitForm.bind( this ) );
          }.bind( this ) );
        },
        submitForm: function( event ) {
          event.preventDefault();

          var email = this.loginForm.querySelector( ".email" ).shadowRoot.querySelector( "input" ).value,
            password = this.loginForm.querySelector( ".password" ).shadowRoot.querySelector( "input" ).value;

          userService.login( email, password );
        },
        detached: function() {},
        attributeChanged: function( attrName, oldValue, newValue ) {}
        /* PROPERTIES */
        /* METHODS */
      });
    })


})( window.Polymer, window.System );
