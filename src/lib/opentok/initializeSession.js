import { OT, apiKey } from "./constants"
import publisherOptions from "./publisherOptions";
import subscriberOptions from "./subscriberOptions";


// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      alert(error.message);
    }
  }
  
const initializeSession = (sessionId, token) => {

    var session = OT.initSession(apiKey, sessionId);

    // Create a publisher
    var publisher = OT.initPublisher('publisher', publisherOptions, handleError);

    publisher.setStyle({buttonDisplayMode: "off"})

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
        session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    });
}

export default initializeSession;