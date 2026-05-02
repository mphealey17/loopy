/**********************************

NODE!

**********************************/

// fpc brand-aligned palette
Node.COLORS = {
	0: "#0E4A55", // deep teal
	1: "#3FA9A1", // mid teal
	2: "#D75A2E", // rust
	3: "#F1B19A", // peach
	4: "#7FBFD9", // sky
	5: "#C9A86A"  // sand
};

// Iceberg layer colors — matches the four layers, top → bottom
// 0: events  1: patterns  2: structures  3: mental models
Node.LAYER_COLORS = {
	0: "#7FBFD9", // events — sky
	1: "#F1B19A", // patterns — peach
	2: "#D75A2E", // structures — rust
	3: "#0E4A55"  // mental models — deep teal
};
Node.LAYER_NAMES = {
	0: "events",
	1: "patterns",
	2: "structures",
	3: "mental models"
};

// Per-layer shape — gets more structured / angular as you go deeper.
// Unassigned ("none") nodes stay as circles, so the visual identity of
// "no layer chosen" is distinct from every assigned layer.
Node.LAYER_SHAPES = {
	0: "triangle", // events — surfacing, "tip of the iceberg" feel
	1: "rounded",  // patterns — recurring/blocky
	2: "hexagon",  // structures — rigid framework
	3: "diamond"   // mental models — cornerstone
};

// Trace a layer-shape path on the ctx with the given "radius" r.
// Leaves a fresh path on the ctx — caller decides fill / stroke / clip.
// All shapes are inscribed to roughly the same bounding circle (radius r)
// so swap-out is visually balanced.
Node._tracePath = function(ctx, shape, r){
	ctx.beginPath();
	if(shape === "triangle"){
		// Equilateral pointing-up triangle, vertices at distance r from origin
		var s32 = Math.sqrt(3) / 2;
		ctx.moveTo(    0, -r);
		ctx.lineTo( r*s32,  r/2);
		ctx.lineTo(-r*s32,  r/2);
		ctx.closePath();
	} else if(shape === "rounded"){
		var s = r * 2;
		var corner = r * 0.32;
		if(ctx.roundRect){
			ctx.roundRect(-r, -r, s, s, corner);
		} else {
			ctx.moveTo(-r + corner, -r);
			ctx.lineTo( r - corner, -r);
			ctx.arc(   r - corner, -r + corner, corner, -Math.PI/2, 0);
			ctx.lineTo( r,           r - corner);
			ctx.arc(   r - corner,   r - corner, corner, 0, Math.PI/2);
			ctx.lineTo(-r + corner,  r);
			ctx.arc(  -r + corner,   r - corner, corner, Math.PI/2, Math.PI);
			ctx.lineTo(-r,          -r + corner);
			ctx.arc(  -r + corner, -r + corner, corner, Math.PI, 3*Math.PI/2);
			ctx.closePath();
		}
	} else if(shape === "hexagon"){
		// Flat-top hexagon — vertex distance r, top/bottom edge height r * sqrt(3)/2
		var h = r * Math.sqrt(3) / 2;
		ctx.moveTo( r,    0);
		ctx.lineTo( r/2,  h);
		ctx.lineTo(-r/2,  h);
		ctx.lineTo(-r,    0);
		ctx.lineTo(-r/2, -h);
		ctx.lineTo( r/2, -h);
		ctx.closePath();
	} else if(shape === "diamond"){
		// Square rotated 45°, vertex distance r
		ctx.moveTo( 0, -r);
		ctx.lineTo( r,  0);
		ctx.lineTo( 0,  r);
		ctx.lineTo(-r,  0);
		ctx.closePath();
	} else {
		// circle — default
		ctx.arc(0, 0, r, 0, Math.TAU, false);
	}
};

Node.defaultValue = 0.5;
Node.defaultHue = 1; // mid teal as default
Node.defaultLayer = null;

Node.DEFAULT_RADIUS = 60;

function Node(model, config){

	var self = this;
	self._CLASS_ = "Node";

	// Mah Parents!
	self.loopy = model.loopy;
	self.model = model;
	self.config = config;

	// Default values...
	_configureProperties(self, config, {
		id: Node._getUID,
		x: 0,
		y: 0,
		init: Node.defaultValue, // initial value!
		label: "?",
		hue: Node.defaultHue,
		layer: Node.defaultLayer, // iceberg layer: 0..3 or null
		radius: Node.DEFAULT_RADIUS
	});

	// Value: from 0 to 1
	self.value = self.init;
	// TODO: ACTUALLY VISUALIZE AN INFINITE RANGE
	self.bound = function(){ // bound ONLY when changing value.
		/*var buffer = 1.2;
		if(self.value<-buffer) self.value=-buffer;
		if(self.value>1+buffer) self.value=1+buffer;*/
	};

	// MOUSE.
	var _controlsVisible = false;
	var _controlsAlpha = 0;
	var _controlsDirection = 0;
	var _controlsSelected = false;
	var _controlsPressed = false;	
	var _listenerMouseMove = subscribe("mousemove", function(){

		// ONLY WHEN PLAYING
		if(self.loopy.mode!=Loopy.MODE_PLAY) return;

		// If moused over this, show it, or not.
		_controlsSelected = self.isPointInNode(Mouse.x, Mouse.y);
		if(_controlsSelected){
			_controlsVisible = true;
			self.loopy.showPlayTutorial = false;
			_controlsDirection = (Mouse.y<self.y) ? 1 : -1;
		}else{
			_controlsVisible = false;
			_controlsDirection = 0;
		}

	});
	var _listenerMouseDown = subscribe("mousedown",function(){

		if(self.loopy.mode!=Loopy.MODE_PLAY) return; // ONLY WHEN PLAYING
		if(_controlsSelected) _controlsPressed = true;

		// IF YOU CLICKED ME...
		if(_controlsPressed){

			// Change my value
			var delta = _controlsDirection*0.33; // HACK: hard-coded 0.33
			self.value += delta;

			// And also PROPAGATE THE DELTA
			self.sendSignal({
				delta: delta
			});

		}

	});
	var _listenerMouseUp = subscribe("mouseup",function(){
		if(self.loopy.mode!=Loopy.MODE_PLAY) return; // ONLY WHEN PLAYING
		_controlsPressed = false;
	});
	var _listenerReset = subscribe("model/reset", function(){
		self.value = self.init;
	});

	//////////////////////////////////////
	// SIGNALS ///////////////////////////
	//////////////////////////////////////

	var shiftIndex = 0;
	self.sendSignal = function(signal){
		var myEdges = self.model.getEdgesByStartNode(self);
		myEdges = _shiftArray(myEdges, shiftIndex);
		shiftIndex = (shiftIndex+1)%myEdges.length;
		for(var i=0; i<myEdges.length; i++){
			myEdges[i].addSignal(signal);
		}
	};

	self.takeSignal = function(signal){

		// Change value
		self.value += signal.delta;

		// Propagate signal
		self.sendSignal(signal);
		// self.sendSignal(signal.delta*0.9); // PROPAGATE SLIGHTLY WEAKER

		// Animation
		// _offsetVel += 0.08 * (signal.delta/Math.abs(signal.delta));
		_offsetVel -= 6 * (signal.delta/Math.abs(signal.delta));

	};


	//////////////////////////////////////
	// UPDATE & DRAW /////////////////////
	//////////////////////////////////////

	// Update!
	var _offset = 0;
	var _offsetGoto = 0;
	var _offsetVel = 0;
	var _offsetAcc = 0;
	var _offsetDamp = 0.3;
	var _offsetHookes = 0.8;
	self.update = function(speed){

		// When actually playing the simulation...
		var _isPlaying = (self.loopy.mode==Loopy.MODE_PLAY);

		// Otherwise, value = initValue exactly
		if(self.loopy.mode==Loopy.MODE_EDIT){
			self.value = self.init;
		}

		// Cursor!
		if(_controlsSelected) Mouse.showCursor("pointer");

		// Keep value within bounds!
		self.bound();

		// Visually & vertically bump the node
		var gotoAlpha = (_controlsVisible || self.loopy.showPlayTutorial) ? 1 : 0;
		_controlsAlpha = _controlsAlpha*0.5 + gotoAlpha*0.5;
		if(_isPlaying && _controlsPressed){
			_offsetGoto = -_controlsDirection*20; // by 20 pixels
			// _offsetGoto = _controlsDirection*0.2; // by scale +/- 0.1
		}else{
			_offsetGoto = 0;
		}
		_offset += _offsetVel;
		if(_offset>40) _offset=40
		if(_offset<-40) _offset=-40;
		_offsetVel += _offsetAcc;
		_offsetVel *= _offsetDamp;
		_offsetAcc = (_offsetGoto-_offset)*_offsetHookes;

	};

	// Draw
	var _circleRadius = 0;
	self.draw = function(ctx){

		// Retina
		var x = self.x*2;
		var y = self.y*2;
		var r = self.radius*2;
		var color = Node.COLORS[self.hue];

		// Translate!
		ctx.save();
		ctx.translate(x,y+_offset);
		
		// Determine the per-layer shape (defaults to circle when unassigned)
		var hasLayer = (self.layer!==null && self.layer!==undefined);
		var shape = hasLayer ? Node.LAYER_SHAPES[self.layer] : "circle";

		// DRAW HIGHLIGHT — follows the shape so selection still feels cohesive
		if(self.loopy.sidebar.currentPage.target == self){
			Node._tracePath(ctx, shape, r+40);
			ctx.fillStyle = HIGHLIGHT_COLOR;
			ctx.fill();
		}

		// Layer decoration — explicit visual cue when a layer is assigned.
		// Stacks three signals so it's unmistakable:
		//   1. soft outer halo (translucent, shape-following)
		//   2. crisp accent ring (bold, shape-following)
		//   3. labelled chip above the node with the layer name
		if(hasLayer){
			var layerColor = Node.LAYER_COLORS[self.layer];
			var layerName  = Node.LAYER_NAMES[self.layer];

			// Soft outer halo
			Node._tracePath(ctx, shape, r+18);
			ctx.lineWidth = 14;
			ctx.strokeStyle = layerColor;
			ctx.globalAlpha = 0.22;
			ctx.stroke();

			// Crisp accent ring
			Node._tracePath(ctx, shape, r+10);
			ctx.lineWidth = 8;
			ctx.strokeStyle = layerColor;
			ctx.globalAlpha = 1;
			ctx.stroke();

			// Layer chip above the node (always a rounded rect — text must be readable)
			ctx.font = "600 28px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			var nameWidth = ctx.measureText(layerName).width;
			var chipPadX = 22;
			var chipW = nameWidth + chipPadX*2;
			var chipH = 40;
			var chipY = -r - 38;
			var chipR = 14;

			ctx.beginPath();
			if(ctx.roundRect){
				ctx.roundRect(-chipW/2, chipY - chipH/2, chipW, chipH, chipR);
			} else {
				ctx.rect(-chipW/2, chipY - chipH/2, chipW, chipH);
			}
			ctx.fillStyle = layerColor;
			ctx.fill();

			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgba(14,74,85,0.25)";
			ctx.stroke();

			ctx.fillStyle = (self.layer===0 || self.layer===1) ? "#0E4A55" : "#fff";
			ctx.fillText(layerName, 0, chipY);
		}

		// White interior + colored border, in the layer's shape
		Node._tracePath(ctx, shape, r-2);
		ctx.fillStyle = "#fff";
		ctx.fill();
		ctx.lineWidth = 6;
		ctx.strokeStyle = color;
		ctx.stroke();
		
		// Circle radius
		// var _circleRadiusGoto = r*(self.value+1);
		// _circleRadius = _circleRadius*0.75 + _circleRadiusGoto*0.25;

		// RADIUS IS (ATAN) of VALUE?!?!?!
		var _r = Math.atan(self.value*5);
		_r = _r/(Math.PI/2);
		_r = (_r+1)/2;

		// INFINITE RANGE FOR RADIUS
		// linear from 0 to 1, asymptotic otherwise.
		var _value;
		if(self.value>=0 && self.value<=1){
			// (0,1) -> (0.1, 0.9)
			_value = 0.1 + 0.8*self.value;
		}else{
			if(self.value<0){
				// asymptotically approach 0, starting at 0.1
				_value = (1/(Math.abs(self.value)+1))*0.1;
			}
			if(self.value>1){
				// asymptotically approach 1, starting at 0.9
				_value = 1 - (1/self.value)*0.1;
			}
		}

		// Colored value pulse — clipped to the layer shape so it can't overflow
		// non-circular silhouettes (hexagon, diamond) at high values.
		var _circleRadiusGoto = r*_value;
		_circleRadius = _circleRadius*0.8 + _circleRadiusGoto*0.2;
		ctx.save();
		Node._tracePath(ctx, shape, r-2);
		ctx.clip();
		ctx.beginPath();
		ctx.arc(0, 0, _circleRadius, 0, Math.TAU, false);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.restore();

		// Text!
		var fontsize = 40;
		ctx.font = "normal "+fontsize+"px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#000";
		var width = ctx.measureText(self.label).width;
		while(width > r*2 - 30){ // -30 for buffer. HACK: HARD-CODED.
			fontsize -= 1;
			ctx.font = "normal "+fontsize+"px sans-serif";
			width = ctx.measureText(self.label).width;
		}
		ctx.fillText(self.label, 0, 0);

		// In/out degree badge — small leverage signal next to each node.
		// Only shown in EDIT mode so it doesn't clutter playback.
		if(self.loopy.mode==Loopy.MODE_EDIT && self.loopy.showDegree){
			var inD = self.model.getInDegree(self);
			var outD = self.model.getOutDegree(self);
			ctx.font = "normal 22px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#0E4A55"; // deep teal
			ctx.globalAlpha = 0.85;
			ctx.fillText("→"+inD+"  "+outD+"→", 0, r+30);
			ctx.globalAlpha = 1;
		}

		// WOBBLE CONTROLS
		var cl = 40;
		var cy = 0;
		if(self.loopy.showPlayTutorial && self.loopy.wobbleControls>0){
			var wobble = self.loopy.wobbleControls*(Math.TAU/30);
			cy = Math.abs(Math.sin(wobble))*10;
		}

		// Controls!
		ctx.globalAlpha = _controlsAlpha;
		ctx.strokeStyle = "rgba(0,0,0,0.8)";
		// top arrow
		ctx.beginPath();
		ctx.moveTo(-cl,-cy-cl);
		ctx.lineTo(0,-cy-cl*2);
		ctx.lineTo(cl,-cy-cl);
		ctx.lineWidth = (_controlsDirection>0) ? 10: 3;
		if(self.loopy.showPlayTutorial) ctx.lineWidth=6;
		ctx.stroke();
		// bottom arrow
		ctx.beginPath();
		ctx.moveTo(-cl,cy+cl);
		ctx.lineTo(0,cy+cl*2);
		ctx.lineTo(cl,cy+cl);
		ctx.lineWidth = (_controlsDirection<0) ? 10: 3;
		if(self.loopy.showPlayTutorial) ctx.lineWidth=6;
		ctx.stroke();

		// Restore
		ctx.restore();

	};

	//////////////////////////////////////
	// KILL NODE /////////////////////////
	//////////////////////////////////////

	self.kill = function(){

		// Kill Listeners!
		unsubscribe("mousemove",_listenerMouseMove);
		unsubscribe("mousedown",_listenerMouseDown);
		unsubscribe("mouseup",_listenerMouseUp);
		unsubscribe("model/reset",_listenerReset);

		// Remove from parent!
		model.removeNode(self);

		// Killed!
		publish("kill",[self]);

	};

	//////////////////////////////////////
	// HELPER METHODS ////////////////////
	//////////////////////////////////////

	self.isPointInNode = function(x, y, buffer){
		buffer = buffer || 0;
		return _isPointInCircle(x, y, self.x, self.y, self.radius+buffer);
	};

	self.getBoundingBox = function(){
		return {
			left: self.x - self.radius,
			top: self.y - self.radius,
			right: self.x + self.radius,
			bottom: self.y + self.radius
		};
	};

}

////////////////////////////
// Unique ID identifiers! //
////////////////////////////

Node._UID = 0;
Node._getUID = function(){
	Node._UID++;
	return Node._UID;
};
