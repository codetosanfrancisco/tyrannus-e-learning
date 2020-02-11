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
    var publisher = OT.initPublisher(role,{ ...publisherOptions, name: `${role} ${email}` }, handleError);

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
        var [role, email] = event.stream.name.split(" ");
        window.console.log(role, email)
        if(role !== 'mentor-0' && !document.getElementById(role)) containerJ.append(`<div id="${role}" class="mentee"><div class="label-email">${email}</div></div>`)
        session.subscribe(event.stream, role, subscriberOptions, handleError);
        // var subscriber = session.subscribe(eve.stream, {...subscriberOptions});
        // subscriber.on('videoElementCreated', function(event) {
        //     document.getElementById(eve.stream.name).appendChild(event.element);
        // });
    });

    session.on('streamDestroyed', function(e) {
        window.console.log(e)
        var [role] = e.stream.name.split(" ");
        if(e.stream.name !== 'mentor-0') {
            $(`#${role}`).remove();
        }
    })

    return {publisher, session};
}

export default initializeSession;