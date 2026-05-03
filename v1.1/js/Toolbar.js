/**********************************

TOOLBAR CODE

**********************************/

// Inline SVG icons — vector, stroked with currentColor so CSS controls colour.
// Style: 24×24, line width 2, rounded caps/joins. Fpc minimal-line aesthetic.
Toolbar.ICONS = {
	ink:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
		'stroke-linecap="round" stroke-linejoin="round">' +
		'<path d="M21 6.5L17.5 3 4 16.5V20h3.5L21 6.5z"/>' +
		'<path d="M14.5 5.5l3.5 3.5"/>' +
		'</svg>',
	label:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
		'stroke-linecap="round" stroke-linejoin="round">' +
		'<path d="M5 5h14"/>' +
		'<path d="M12 5v14"/>' +
		'<path d="M9 19h6"/>' +
		'</svg>',
	drag:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
		'stroke-linecap="round" stroke-linejoin="round">' +
		'<path d="M12 2v20"/>' +
		'<path d="M2 12h20"/>' +
		'<path d="M9 5l3-3 3 3"/>' +
		'<path d="M9 19l3 3 3-3"/>' +
		'<path d="M5 9l-3 3 3 3"/>' +
		'<path d="M19 9l3 3-3 3"/>' +
		'</svg>',
	erase:
		'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
		'stroke-linecap="round" stroke-linejoin="round">' +
		'<path d="M7 21l-4.3-4.3a2 2 0 010-2.8l9.9-9.9a2 2 0 012.8 0l5.6 5.6a2 2 0 010 2.8L13 21"/>' +
		'<path d="M22 21H7"/>' +
		'<path d="M5 11l8 8"/>' +
		'</svg>'
};

function Toolbar(loopy){

	var self = this;

	// Tools & Buttons
	var buttons = [];
	var buttonsByID = {};
	self.dom = document.getElementById("toolbar");
	self.addButton = function(options){

		var id = options.id;
		var tooltip = options.tooltip;
		var callback = options.callback;

		// Add the button
		var button = new ToolbarButton(self,{
			id: id,
			icon: Toolbar.ICONS[id],
			tooltip: tooltip,
			callback: callback
		});
		self.dom.appendChild(button.dom);
		buttons.push(button);
		buttonsByID[id] = button;

		// Keyboard shortcut!
		(function(id){
			subscribe("key/"+id,function(){
				loopy.ink.reset(); // also CLEAR INK CANVAS
				buttonsByID[id].callback();
			});
		})(id);

	};

	// Select button
	self.selectButton = function(button){
		for(var i=0;i<buttons.length;i++){
			buttons[i].deselect();
		}
		button.select();
	};

	// Set Tool
	self.currentTool = "ink";
	self.setTool = function(tool){
		self.currentTool = tool;
		var name = "TOOL_"+tool.toUpperCase();
		loopy.tool = Loopy[name];
		document.getElementById("canvasses").setAttribute("cursor",tool);
	};

	// Populate those buttons!
	self.addButton({
		id: "ink",
		tooltip: "draw (N)",
		callback: function(){
			self.setTool("ink");
		}
	});
	self.addButton({
		id: "label",
		tooltip: "text (T)",
		callback: function(){
			self.setTool("label");
		}
	});
	self.addButton({
		id: "drag",
		tooltip: "move (V)",
		callback: function(){
			self.setTool("drag");
		}
	});
	self.addButton({
		id: "erase",
		tooltip: "erase (E)",
		callback: function(){
			self.setTool("erase");
		}
	});

	// Select button
	buttonsByID.ink.callback();

}

function ToolbarButton(toolbar, config){

	var self = this;
	self.id = config.id;

	// Inline SVG icon (no more background-image PNGs)
	self.dom = document.createElement("div");
	self.dom.setAttribute("class", "toolbar_button");
	self.dom.innerHTML = config.icon;

	// Tooltip!
	self.dom.setAttribute("data-balloon", config.tooltip);
	self.dom.setAttribute("data-balloon-pos", "right");

	// Selected?
	self.select = function(){
		self.dom.setAttribute("selected", "yes");
	};
	self.deselect = function(){
		self.dom.setAttribute("selected", "no");
	};

	// On Click
	self.callback = function(){
		config.callback();
		toolbar.selectButton(self);
	};
	self.dom.onclick = self.callback;

}
