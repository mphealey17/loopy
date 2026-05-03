/**********************************

SIDEBAR CODE — fathom

**********************************/

function Sidebar(loopy){

	var self = this;
	PageUI.call(self, document.getElementById("sidebar"));

	// Edit
	self.edit = function(object){
		self.showPage(object._CLASS_);
		self.currentPage.edit(object);
	};

	// Go back to main when the thing you're editing is killed
	subscribe("kill",function(object){
		if(self.currentPage.target==object){
			self.showPage("Edit");
		}
	});

	////////////////////////////////////////////////////////////////////////////////////////////
	// ACTUAL PAGES ////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////

	// Node!
	(function(){
		var page = new SidebarPage();
		page.addComponent(new ComponentButton({
			header: true,
			label: "back to top",
			onclick: function(){
				self.showPage("Edit");
			}
		}));
		page.addComponent("label", new ComponentInput({
			label: "<br><br>name:"
		}));
		page.addComponent("hue", new ComponentSlider({
			bg: "color",
			label: "colour:",
			options: [0,1,2,3,4,5],
			oninput: function(value){
				Node.defaultHue = value;
			}
		}));
		page.addComponent("init", new ComponentSlider({
			bg: "initial",
			label: "start amount:",
			options: [0, 0.16, 0.33, 0.50, 0.66, 0.83, 1],
			oninput: function(value){
				Node.defaultValue = value;
			}
		}));

		// Shape picker — pick a silhouette to visually categorise the node.
		page.addComponent("shape", new ComponentShapePicker({
			label: "shape:",
			oninput: function(value){
				Node.defaultShape = value;
			}
		}));

		// In/out degree readout
		var degreeReadout = new ComponentHTML({ html: "" });
		page.addComponent(degreeReadout);

		page.onedit = function(){

			// Set color of Slider
			var node = page.target;
			var color = Node.COLORS[node.hue];
			page.getComponent("init").setBGColor(color);

			// Refresh in/out degree
			var inD = loopy.model.getInDegree(node);
			var outD = loopy.model.getOutDegree(node);
			degreeReadout.dom.innerHTML =
				"<div class='degree_readout'>" +
				"<div class='degree_label'>connections</div>" +
				"<div class='degree_pair'>" +
				"<span class='degree_in'>&rarr; " + inD + " in</span>" +
				"<span class='degree_out'>" + outD + " out &rarr;</span>" +
				"</div>" +
				"<div class='degree_hint'>high out-degree usually means high leverage</div>" +
				"</div>";

			// Focus on the name field IF IT'S "" or "?"
			var name = node.label;
			if(name=="" || name=="?") page.getComponent("label").select();

		};
		page.addComponent(new ComponentButton({
			label: "delete node",
			onclick: function(node){
				node.kill();
				self.showPage("Edit");
			}
		}));
		self.addPage("Node", page);
	})();

	// Edge!
	(function(){
		var page = new SidebarPage();
		page.addComponent(new ComponentButton({
			header: true,
			label: "back to top",
			onclick: function(){
				self.showPage("Edit");
			}
		}));
		page.addComponent("strength", new ComponentSlider({
			bg: "strength",
			label: "<br><br>relationship:",
			options: [1, -1],
			oninput: function(value){
				Edge.defaultStrength = value;
			}
		}));
		page.addComponent(new ComponentHTML({
			html: "(stronger relationship: draw multiple arrows)<br><br>" +
				"(delayed relationship: draw a longer arrow)"
		}));
		page.addComponent(new ComponentButton({
			label: "delete arrow",
			onclick: function(edge){
				edge.kill();
				self.showPage("Edit");
			}
		}));
		self.addPage("Edge", page);
	})();

	// Label!
	(function(){
		var page = new SidebarPage();
		page.addComponent(new ComponentButton({
			header: true,
			label: "back to top",
			onclick: function(){
				self.showPage("Edit");
			}
		}));
		page.addComponent("text", new ComponentInput({
			label: "<br><br>label:",
			textarea: true
		}));
		page.onshow = function(){
			page.getComponent("text").select();
		};
		page.onhide = function(){
			var label = page.target;
			if(!page.target) return;
			var text = label.text;
			if(/^\s*$/.test(text)){
				page.target = null;
				label.kill();
			}
		};
		page.addComponent(new ComponentButton({
			label: "delete label",
			onclick: function(label){
				label.kill();
				self.showPage("Edit");
			}
		}));
		self.addPage("Label", page);
	})();

	// Edit (landing) — fpc-branded
	(function(){
		var page = new SidebarPage();
		page.addComponent(new ComponentHTML({
			html: ""+

			"<div class='brand_block'>" +
			"<div class='brand_word'>fathom</div>" +
			"<div class='brand_tag'>see the system beneath the symptom</div>" +
			"</div>" +

			"<hr/>" +

			"<div class='hint_block'>" +
			"<b>get started</b><br><br>" +
			"&middot; load an example from the top bar<br>" +
			"&middot; or start drawing your own system<br><br>" +
			"<b>tools</b> (left side)<br><br>" +
			"&middot; <i>pencil</i> &mdash; draw nodes &amp; arrows<br>" +
			"&middot; <i>text</i> &mdash; add notes to the canvas<br>" +
			"&middot; <i>move</i> &mdash; reposition nodes<br>" +
			"&middot; <i>erase</i> &mdash; remove things<br><br>" +
			"<b>once you've drawn a node</b><br><br>" +
			"click on it to open this panel. Pick a colour, a shape, and " +
			"see how many connections flow into and out of it.<br><br>" +
			"</div>" +

			"<hr/>" +

			"<div class='credits_line'>" +
			"a tool by <a target='_blank' href='https://fpconsulting.com.au'>first person consulting</a>" +
			"</div>"
		}));
		self.addPage("Edit", page);
	})();

}

function SidebarPage(){

	var self = this;
	self.target = null;

	// DOM
	self.dom = document.createElement("div");
	self.show = function(){ self.dom.style.display="block"; self.onshow(); };
	self.hide = function(){ self.dom.style.display="none"; self.onhide(); };

	// Components
	self.components = [];
	self.componentsByID = {};
	self.addComponent = function(propName, component){

		// One or two args
		if(!component){
			component = propName;
			propName = "";
		}

		component.page = self; // tie to self
		component.propName = propName; // tie to propName
		self.dom.appendChild(component.dom); // add to DOM

		// remember component
		self.components.push(component);
		self.componentsByID[propName] = component;

		// return!
		return component;

	};
	self.getComponent = function(propName){
		return self.componentsByID[propName];
	};

	// Edit
	self.edit = function(object){
		self.target = object;
		for(var i=0;i<self.components.length;i++){
			self.components[i].show();
		}
		self.onedit();
	};

	// Callbacks
	self.onedit = function(){};
	self.onshow = function(){};
	self.onhide = function(){};

	self.hide();

}



/////////////////////////////////////////////////////////////////////////////////////////////
// COMPONENTS ///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function Component(){
	var self = this;
	self.dom = null;
	self.page = null;
	self.propName = null;
	self.show = function(){};
	self.getValue = function(){
		return self.page.target[self.propName];
	};
	self.setValue = function(value){
		publish("model/changed");
		self.page.target[self.propName] = value;
		self.page.onedit();
	};
}

function ComponentInput(config){

	var self = this;
	Component.apply(self);

	self.dom = document.createElement("div");
	var label = _createLabel(config.label);
	var className = config.textarea ? "component_textarea" : "component_input";
	var input = _createInput(className, config.textarea);
	input.oninput = function(event){
		self.setValue(input.value);
	};
	self.dom.appendChild(label);
	self.dom.appendChild(input);

	self.show = function(){
		input.value = self.getValue();
	};

	self.select = function(){
		setTimeout(function(){ input.select(); },10);
	};

}

function ComponentSlider(config){

	var self = this;
	Component.apply(self);

	self.dom = document.createElement("div");
	var label = _createLabel(config.label);
	self.dom.appendChild(label);
	var sliderDOM = document.createElement("div");
	sliderDOM.setAttribute("class","component_slider");
	self.dom.appendChild(sliderDOM);

	var slider = new Image();
	slider.draggable = false;
	slider.src = "css/sliders/"+config.bg+".png";
	slider.setAttribute("class","component_slider_graphic");
	var pointer = new Image();
	pointer.draggable = false;
	pointer.src = "css/sliders/slider_pointer.png";
	pointer.setAttribute("class","component_slider_pointer");
	sliderDOM.appendChild(slider);
	sliderDOM.appendChild(pointer);
	var movePointer = function(){
		var value = self.getValue();
		var optionIndex = config.options.indexOf(value);
		var x = (optionIndex+0.5) * (250/config.options.length);
		pointer.style.left = (x-7.5)+"px";
	};

	var isDragging = false;
	var onmousedown = function(event){
		isDragging = true;
		sliderInput(event);
	};
	var onmouseup = function(){
		isDragging = false;
	};
	var onmousemove = function(event){
		if(isDragging) sliderInput(event);
	};
	var sliderInput = function(event){
		var index = event.x/250;
		var optionIndex = Math.floor(index*config.options.length);
		var option = config.options[optionIndex];
		if(option===undefined) return;
		self.setValue(option);
		if(config.oninput){
			config.oninput(option);
		}
		movePointer();
	};
	_addMouseEvents(slider, onmousedown, onmousemove, onmouseup);

	self.show = function(){
		movePointer();
	};

	self.setBGColor = function(color){
		slider.style.background = color;
	};

}

function ComponentShapePicker(config){

	// One row per shape: [SVG preview] [type label] — silhouette is the
	// primary cue, the label gives a suggested category name without
	// imposing iceberg framing on the canvas.
	var self = this;
	Component.apply(self);

	self.dom = document.createElement("div");
	var label = _createLabel(config.label);
	self.dom.appendChild(label);

	var pickerCol = document.createElement("div");
	pickerCol.setAttribute("class", "shape_picker");
	self.dom.appendChild(pickerCol);

	// Inline SVG paths for each shape, inscribed in a 32×32 box (centre 16,16, radius 11)
	var SHAPE_SVGS = {
		"circle":   '<circle cx="16" cy="16" r="11"/>',
		"triangle": '<polygon points="16,5 25.5,21.5 6.5,21.5"/>',
		"rounded":  '<rect x="5" y="5" width="22" height="22" rx="6"/>',
		"hexagon":  '<polygon points="27,16 21.5,25.5 10.5,25.5 5,16 10.5,6.5 21.5,6.5"/>',
		"diamond":  '<polygon points="16,5 27,16 16,27 5,16"/>'
	};

	// Suggested category name per shape (purely a label, no enforcement)
	var SHAPE_NAMES = {
		"circle":   "general",
		"triangle": "events",
		"rounded":  "patterns",
		"hexagon":  "structures",
		"diamond":  "mental models"
	};

	var buttons = [];
	for(var i=0;i<Node.SHAPES.length;i++){
		(function(shapeName){
			var btn = document.createElement("div");
			btn.setAttribute("class", "shape_pick_btn");
			btn.setAttribute("title", SHAPE_NAMES[shapeName]);
			btn.innerHTML =
				'<svg viewBox="0 0 32 32" width="28" height="28">' +
				SHAPE_SVGS[shapeName] +
				'</svg>' +
				'<span class="shape_pick_label">' + SHAPE_NAMES[shapeName] + '</span>';
			btn.onclick = function(){
				self.setValue(shapeName);
				if(config.oninput) config.oninput(shapeName);
				highlight();
			};
			pickerCol.appendChild(btn);
			buttons.push({ btn: btn, value: shapeName });
		})(Node.SHAPES[i]);
	}

	var highlight = function(){
		var current = self.getValue() || "circle";
		for(var i=0;i<buttons.length;i++){
			if(buttons[i].value === current){
				buttons[i].btn.setAttribute("selected", "yes");
			} else {
				buttons[i].btn.removeAttribute("selected");
			}
		}
	};

	self.show = highlight;

}

function ComponentButton(config){

	var self = this;
	Component.apply(self);

	self.dom = document.createElement("div");
	var button = _createButton(config.label, function(){
		config.onclick(self.page.target);
	});
	self.dom.appendChild(button);

	if(config.header){
		button.setAttribute("header","yes");
	}

}

function ComponentHTML(config){

	var self = this;
	Component.apply(self);

	self.dom = document.createElement("div");
	self.dom.innerHTML = config.html;

}

function ComponentOutput(config){

	var self = this;
	Component.apply(self);

	self.dom = _createInput("component_output");
	self.dom.setAttribute("readonly", "true");
	self.dom.onclick = function(){
		self.dom.select();
	};

	self.output = function(string){
		self.dom.value = string;
	};

}
