import { OT, apiKey } from "./constants"
import publisherOptions from "./publisherOptions";
import subscriberOptions from "./subscriberOptions";
import Vue from 'vue';



// Handling all of our errors here by alerting them
const handleError = (error) => {
    if (error) {
      throw error;
    }
  }

const isLecturer = (role) => {
    return role.split("-")[0] == 'lecturer'
}
  
const initializeSession = (self, token, sessionId, cb, showFullScreen) => {


    var { role, email, addStudent, removeStudent, name } = self;
    var session = OT.initSession(apiKey, sessionId), publisher;

    if(!isLecturer(role)) {
        addStudent(role, email, name);
    }

    Vue.nextTick(function() {
        // Create a publisher
        publisher = OT.initPublisher(role,{ ...publisherOptions, name: `${role} ${email}`}, handleError);

        publisher.setStyle({buttonDisplayMode: "off"});

        window.console.log(publisher, role)
        window.console.log(session)

        // Connect to the session
        session.connect(token, function(error) {
            // If the connection is successful, publish to the session
            if (error) {
                //handleError(error);
                throw error;
            } else {
                session.publish(publisher, handleError);
            }
        });

        session.on('streamCreated', function(event) {
            var [roleStudent, emailStudent] = event.stream.name.split(" ");
            window.console.log("Role Student", roleStudent, emailStudent)
            if(!isLecturer(roleStudent) && !document.getElementById(roleStudent)) {
                addStudent(roleStudent, emailStudent, name);
            }
            Vue.nextTick(function() {

                if(event.stream.videoType === 'screen') {
                    showFullScreen()
                    session.subscribe(event.stream, roleStudent, { ...subscriberOptions, fitMode: 'contain' }, handleError);
                    return;
                }

                session.subscribe(event.stream, roleStudent, subscriberOptions, handleError);
            })
        });

        session.on('streamDestroyed', function(e) {
            var [roleStudent, emailStudent] = e.stream.name.split(" ");
            window.console.log(roleStudent, emailStudent)
            removeStudent(roleStudent, emailStudent);
        })


        cb(publisher, session);
    })
}

export default initializeSession;