import { OT } from "./constants"

const checkScreenSharing = () => {
    let support = true;
    OT.checkScreenSharingCapability(function(response) {
        if(!response.supported || response.extensionRegistered === false) {
            support = false;
        }
    });
    return support;
}

export default checkScreenSharing;