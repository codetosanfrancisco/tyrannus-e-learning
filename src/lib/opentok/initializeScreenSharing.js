import { OT } from "./constants"

const initializeScreenSharing = (session) => {
    var publisher = OT.initPublisher('screen-preview', { videoSource: 'screen', width: '100%', height: '100%', name: 'screen-preview'}, function(error) {
        if (error) {
          // Look at error.message to see what went wrong.
        } else {
          session.publish(publisher, function(error) {
            if (error) {
              // Look error.message to see what went wrong.
            }
          });
        }
    })
    return publisher;
}

export default initializeScreenSharing;