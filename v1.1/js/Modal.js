/***********************

Modal — kept as a stub so Loopy.js can still call `new Modal(self)` and check
`self.modal.isShowing` in its update loop. fathom doesn't use modal pages —
instructions live in the slide-out panel and examples load via the top bar.

************************/

function Modal(loopy){
	var self = this;
	self.loopy = loopy;
	self.isShowing = false;
	self.show = function(){};
	self.hide = function(){};
	self.showPage = function(){};
}
