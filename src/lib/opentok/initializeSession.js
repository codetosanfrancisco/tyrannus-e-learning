import { OT, apiKey } from "./constants"
import publisherOptions from "./publisherOptions";
import subscriberOptions from "./subscriberOptions";
import Vue from 'vue';



// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      alert(error.message);
    }
  }
  
const initializeSession = (self, token, sessionId, cb) => {


    var { role, email, addMentee, removeMentee } = self;
    var session = OT.initSession(apiKey, sessionId), publisher;

    if(email != 'mentor1@gmail.com') {
        addMentee(role, email);
    }

    Vue.nextTick(function() {
        // Create a publisher
        publisher = OT.initPublisher(role,{ ...publisherOptions, name: `${role} ${email}` }, handleError);

        publisher.setStyle({buttonDisplayMode: "off"});

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
            var [roleMentee, emailMentee] = event.stream.name.split(" ");
            if(role !== 'mentor-0' && !document.getElementById(role)) {
                addMentee(roleMentee, emailMentee);
            }
            Vue.nextTick(function() {
                session.subscribe(event.stream, roleMentee, subscriberOptions, handleError);
            })
        });

        session.on('streamDestroyed', function(e) {
            var [roleMentee, emailMentee] = e.stream.name.split(" ");
            if(e.stream.name !== 'mentor-0') {
                removeMentee(roleMentee, emailMentee);
            }
        })


        cb(publisher, session);
    })
}

export default initializeSession;