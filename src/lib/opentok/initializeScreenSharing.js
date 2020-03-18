import { OT } from "./constants"
import $ from "jquery"

const initializeScreenSharing = (session, status = 0, cb) => {

    if(status) {
      $(".screen-share").first().prepend('<div class="screen-children" id="screen-preview"></div>')
    }

    var publisher = OT.initPublisher('screen-preview', { videoSource: 'screen', width: '100%', height: '100%', name: 'screen-preview', publishAudio: true }, function(error) {
        if (error) {
          // Look at error.message to see what went wrong.
        } else {
          session.publish(publisher, function(result) {
            if(result) {
              alert(result);
              cb();
            }
          });
          
        }
    })
    return publisher;
}

export default initializeScreenSharing;