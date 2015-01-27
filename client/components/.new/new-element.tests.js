/*eslint-env mocha */
/*eslint-env mocha */
( function( window, document, chai ) {
  "use strict";
  var expect = chai.expect,
    createNewElement = function() {
      return document.createElement( "new-element" );
    },
    // get wrapper from document or for karma, create a new div and append it to the DOM
    testingWrapper = document.getElementById( "new-element-test-wrapper" ) ||
      ( function() {
        var wrapper = document.createElement( "div" );
        document.body.appendChild( wrapper );
        return wrapper;
      })(),
    // original state to test against
    originalWrapperOuterHTML = testingWrapper.outerHTML,
    // re-sets wrapper to blank
    resetWrapper = function() {
      testingWrapper.innerHTML = "";
    };

  suite( "<new-element>", function() {
    suite( "Life Cycle", function() {
      test( "ready: can create from document.createElement", function() {
        expect( document.createElement( "new-element" ) )
          .to.have.property( "outerHTML" )
          .that.is.a( "string" )
          .and.equals( "<on-off></on-off>" );
      });

      test( "attached: can be added to another DOM Element", function() {
        var newElement = createNewElement();

        testingWrapper.appendChild( newElement );

        expect( testingWrapper )
          .to.have.property( "innerHTML" )
          .that.is.a( "string" )
          .and.equals( "<new-element></new-element>" );

        resetWrapper();
      });

      test( "detached: can be removed from another DOM element", function() {
        var newElement = createNewElement();

        testingWrapper.appendChild( newElement );
        testingWrapper.removeChild( newElement );

        expect( testingWrapper )
          .to.have.property( "outerHTML" )
          .that.is.a( "string" )
          .and.equals( originalWrapperOuterHTML );

        resetWrapper();
      });
    });

    suite( "Attributes", function() {
      suite( "data-text", function() {
        test( "reflection", function() {});
      });
    });

    suite( "Events", function() {
      suite( "Event Name", function() {
        test( "customEvent", function( done ) {});
      });
    });
  });
})( window, document, window.chai );
