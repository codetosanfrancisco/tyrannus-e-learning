import { OT, apiKey } from "./constants"
import publisherOptions from "./publisherOptions";
import subscriberOptions from "./subscriberOptions";


// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      alert(error.message);
    }
  }
  
const initializeSession = (sessionId, token, role) => {

    var session = OT.initSession(apiKey, sessionId);

    // Create a publisher
    var publisher = OT.initPublisher('mentor',{ ...publisherOptions , style: { nameDisplayMode: "on", insertDefaultUI: true} }, handleError);

    publisher.setStyle({buttonDisplayMode: "off"})

    // publisher.on('videoElementCreated', function(event) {
    //     document.getElementById(`${role }`).appendChild(event.element);
    //   });

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
        // session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
        var subscriber = session.subscribe(event.stream, {insertDefaultUI: false, ...subscriberOptions});
        subscriber.on('videoElementCreated', function(event) {
            document.getElementById(`${role}`).appendChild(event.element);
        });
    });
}

export default initializeSession;