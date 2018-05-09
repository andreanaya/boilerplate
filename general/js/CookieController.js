function setCookie(name, value, expiration) {
	expiration = expiration || 100;

	var date = new Date();
	
	date.setTime(date.getTime() + (expiration*24*60*60*1000));

	var expires = "expires="+ date.toUTCString();

	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
	name = name + "=";
    
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hasCookie(name) {
	return getCookie(name) != "";
}

function deleteCookie(name) {
	document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default {
	set: setCookie,
	get: getCookie,
	has: hasCookie,
	delete: deleteCookie,
}