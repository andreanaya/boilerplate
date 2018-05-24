export const jsonAttribute = function(attr) {
	return attr.replace(/([{,]\s?)([^:{,]*):([^,}]*)/gim, "$1\"$2\":$3");
}