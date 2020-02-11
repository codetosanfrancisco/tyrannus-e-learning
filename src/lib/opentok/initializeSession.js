import { OT, apiKey } from "./constants"
import publisherOptions from "./publisherOptions";
import subscriberOptions from "./subscriberOptions";
import $ from 'jquery';


// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      alert(error.message);
    }
  }
  
const initializeSession = (sessionId, token, role, container, email) => {

    var session = OT.initSession(apiKey, sessionId);

    var containerJ = $(container);

    if(email != 'mentor1@gmail.com') containerJ.append(`<div id="${role}" class="mentee"><div class="label-email">${email}</div></div>`)

    // Create a publisher
    var publisher = OT.initPublisher(role,{ ...publisherOptions, name: role }, handleError);

    publisher.setStyle({buttonDisplayMode: "off"})

    // publisher.on('videoElementCreated', function(event) {
    //     document.getElementById(`${role}`).appendChild(event.element);
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
        if(event.stream.name !== 'mentor-0' && !document.getElementById(event.stream.name)) containerJ.append(`<div id="${event.stream.name}" class="mentee"><div class="label-email"></div></div>`)
        session.subscribe(event.stream, event.stream.name, subscriberOptions, handleError);
        // var subscriber = session.subscribe(eve.stream, {...subscriberOptions});
        // subscriber.on('videoElementCreated', function(event) {
        //     document.getElementById(eve.stream.name).appendChild(event.element);
        // });
    });

    session.on('streamDestroyed', function(e) {
        window.console.log(e)
        if(e.stream.name !== 'mentor-0') {
            $(`#${e.stream.name}`).remove();
        }
    })

    return {publisher, session};
}

export default initializeSession;