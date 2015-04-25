( function( polymer ) {
  "use strict";
  var triggerMenuHandler = function() {
    if ( !this.edMenu.hasAttribute( "class" ) ) {
      this.edMenu.setAttribute( "class", "hide-menu" );
      this.settingsTitle.style.opacity = 1;
    } else {
      this.edMenu.removeAttribute( "class" );
      this.settingsTitle.style.opacity = 0;
    }
  }

  polymer( "ed-settings-view", {
    /* LIFECYCLE */
    ready: function() {
      this.edMenu = document.getElementById( "side-menu" );
      this.triggerBtn = this.shadowRoot.getElementById( "menu-trigger" );
      this.settingsTitle = this.shadowRoot.getElementById( "settings-title" );
      console.log( this.settingsTitle );
      this.handlers = {
        triggerMenu: triggerMenuHandler.bind( this )
      };
    },
    attached: function() {
      this.triggerBtn.addEventListener( "click", this.handlers.triggerMenu );
      this.triggerBtn.addEventListener( "tap", this.handlers.triggerMenu );
    },
    detached: function() {
      this.triggerBtn.removeEventListener( "click", this.handlers.triggerMenu );
      this.triggerBtn.removeEventListener( "tap", this.handlers.triggerMenu );
    },
    attributeChanged: function( attrName, oldValue, newValue ) {}
    /* PROPERTIES */
    /* METHODS */
  });
})( window.Polymer );
