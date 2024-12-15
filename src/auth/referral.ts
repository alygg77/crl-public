export const SaveReferral = () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get('referral_id'));
    document.cookie = "referral_id="+urlParams.get('referral_id');
}

function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const CheckReferral = () => {
    const referral = getCookie("referral_id");
    if (referral != "") {
        console.log(referral)
    }
}

