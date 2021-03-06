/*jshint strict: false*/

import define from "domain/ed/define-properties";
import EDProfile from "domain/ed/objects/profile/EDProfile";

export default class EDFan extends EDProfile {
  static get MODEL_TYPE(){
    return EDProfile.MODEL_TYPE + "-fan";
  }

  constructor ( args ) {
    var argsCopy = Object.assign( {}, args );

    super( args );

    if ( args.yearOfBirth ) {
      argsCopy.yearOfBirth = new Date( args.yearOfBirth );
    }

    define.enumReadOnly( this, [
      "yearOfBirth"
    ], argsCopy );
  }
}
