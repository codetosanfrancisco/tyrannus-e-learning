import { OT } from "./constants"

const checkScreenSharing = () => {
    return OT.checkScreenSharingCapability(function(response) {
        if(!response.supported || response.extensionRegistered === false) {
            return false;
        } else {
            return true;
        }
    });
}

export default checkScreenSharing;