export function set(name, value, expiration) {
	expiration = expiration || 100;

	var date = new Date();
	
	date.setTime(date.getTime() + (expiration*24*60*60*1000));

	var expires = "expires="+ date.toUTCString();

	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function get(name) {
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

export function has(name) {
	return get(name) != "";
}

export function remove(name) {
	document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}