import { OT, apiKey } from "./constants"


// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      alert(error.message);
    }
  }
  
const initializeSession = (sessionId, token) => {
    var session = OT.initSession(apiKey, sessionId);

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function(error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });

    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
    });
}

export default initializeSession;