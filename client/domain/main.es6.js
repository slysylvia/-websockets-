/**
 * Created by rj on 11/24/14.
 */
import helloGoodbye from "./hello-goodbye.es6";

// Hello ES6
helloGoodbye.hello( "ES6" );

// Goodbye ES5
helloGoodbye.goodbye( "ES5" );

export default ( name ) => helloGoodbye.hello( name );
