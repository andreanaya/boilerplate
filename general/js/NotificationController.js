var active = [];

export function show(notification, priority) {
	notification.el.addEventListener('close', onClose.bind(notification));
	document.body.appendChild(notification.el);
	// active.push(notification);
}

function onClose(e) {
	document.body.removeChild(this.el);
	// active.splice(active.indexOf(e.target), 1);
}