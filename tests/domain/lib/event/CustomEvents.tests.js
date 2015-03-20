( function( win, doc, System, sinon, expect ) {
  "use strict";

  suite( "CustomEvents", function() {
    var CustomEvents;

    suiteSetup( function( done ) {
      System.import( "domain/lib/event/CustomEvents" )
        .then( function( imported ) {
          CustomEvents = imported.default;
          done();
        }, function( error ) {
          console.warn( "Could not import 'CustomEvents' for testing: ", error.message );
          console.error( error.stack );
          done( error );
        });
    });

    // Tests begin
    suite( "browser support", function() {
      test( "when browser doesn't support CustomEvent constructor", function() {
        var descriptor = {
            detail: "something"
          },
          event = new CustomEvents( "open", descriptor );

        console.log( "are you getting here?" );
        window.CustomEvent = undefined;

        expect( event.constructor )
          .to.equal( CustomEvents );

        expect( event )
          .to.be.an.instanceOf( Event );

        //expect( event )
        //  .to.throw( err );
      });

      test( "when browser supports CustomEvent constructor", function() {
        var descriptor = {
            detail: "something"
          },
          event = new CustomEvents( "open", descriptor );

        expect( event.constructor )
          .to.equal( CustomEvents );

        expect( event )
          .to.be.an.instanceOf( Event );
      });
    });
  });
})( window, document, window.System, window.sinon, window.chai.expect );
