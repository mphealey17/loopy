/**********************************

EXAMPLES — three preset systems framed through the iceberg lens.

Each system uses the same vertical convention:
    y ≈ 100   events
    y ≈ 250   patterns
    y ≈ 400   structures
    y ≈ 600   mental models

Layers (0..3) are tagged on every node so the layer accent ring shows
even before the user toggles the iceberg backdrop. Hue is used purely for
thematic colour-coding within a single example.

**********************************/

window.FATHOM_EXAMPLES = {

	// ================================================================
	// ENVIRONMENTAL — urban heat & vulnerable communities
	// ================================================================
	environmental: {
		nextID: 9,
		nodes: [
			// Events
			{ id: 1, x: 280, y: 100, init: 0.5, label: "heatwave deaths",       hue: 2, layer: 0 },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "ER visits spike",       hue: 2, layer: 0 },
			// Patterns
			{ id: 3, x: 280, y: 260, init: 0.5, label: "rising urban temps",    hue: 3, layer: 1 },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "low tree cover",        hue: 1, layer: 1 },
			// Structures
			{ id: 5, x: 280, y: 420, init: 0.5, label: "zoning policy",         hue: 0, layer: 2 },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "energy cost barrier",   hue: 0, layer: 2 },
			// Mental Models
			{ id: 7, x: 280, y: 600, init: 0.5, label: "AC is a luxury",        hue: 0, layer: 3 },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "trees are cosmetic",    hue: 0, layer: 3 }
		],
		edges: [
			// Mental models drive structures
			{ from: 7, to: 6, arc: 0,  strength:  1 },  // AC luxury → energy barrier
			{ from: 8, to: 5, arc: 0,  strength:  1 },  // trees cosmetic → zoning
			// Structures drive patterns
			{ from: 5, to: 4, arc: 0,  strength: -1 }, // zoning policy lowers tree cover
			{ from: 6, to: 3, arc: 0,  strength:  1 }, // energy barrier → temps in homes
			// Patterns drive events
			{ from: 4, to: 3, arc: 0,  strength:  1 }, // low tree cover → rising temps
			{ from: 3, to: 1, arc: 0,  strength:  1 }, // rising temps → deaths
			{ from: 3, to: 2, arc: 0,  strength:  1 }  // rising temps → ER visits
		],
		labels: [
			{ x: 850, y: 60,  text: "events you can see today" },
			{ x: 850, y: 220, text: "patterns building up" },
			{ x: 850, y: 380, text: "structures shaping the patterns" },
			{ x: 850, y: 560, text: "beliefs holding the structures in place" }
		]
	},

	// ================================================================
	// HEALTH — burnout in healthcare workers
	// ================================================================
	health: {
		nextID: 9,
		nodes: [
			// Events
			{ id: 1, x: 280, y: 100, init: 0.5, label: "staff resigning",         hue: 2, layer: 0 },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "clinical errors",         hue: 2, layer: 0 },
			// Patterns
			{ id: 3, x: 280, y: 260, init: 0.5, label: "high turnover",           hue: 3, layer: 1 },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "chronic understaffing",   hue: 3, layer: 1 },
			// Structures
			{ id: 5, x: 280, y: 420, init: 0.5, label: "throughput funding",      hue: 1, layer: 2 },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "no staff wellbeing",      hue: 1, layer: 2 },
			// Mental Models
			{ id: 7, x: 280, y: 600, init: 0.5, label: "tough it out culture",    hue: 0, layer: 3 },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "patients before staff",   hue: 0, layer: 3 }
		],
		edges: [
			{ from: 7, to: 6, arc: 0, strength:  1 }, // tough it out → no wellbeing support
			{ from: 8, to: 5, arc: 0, strength:  1 }, // patients>staff → throughput funding
			{ from: 5, to: 4, arc: 0, strength:  1 }, // throughput funding → understaffing
			{ from: 6, to: 4, arc: 0, strength:  1 }, // no wellbeing → understaffing (via burnout)
			{ from: 4, to: 3, arc: 0, strength:  1 }, // understaffing → turnover
			{ from: 4, to: 2, arc: 0, strength:  1 }, // understaffing → errors
			{ from: 3, to: 1, arc: 0, strength:  1 }  // turnover → resignations
		],
		labels: [
			{ x: 850, y: 60,  text: "events you can see today" },
			{ x: 850, y: 220, text: "patterns building up" },
			{ x: 850, y: 380, text: "structures shaping the patterns" },
			{ x: 850, y: 560, text: "beliefs holding the structures in place" }
		]
	},

	// ================================================================
	// SOCIAL — school disengagement
	// ================================================================
	social: {
		nextID: 9,
		nodes: [
			// Events
			{ id: 1, x: 280, y: 100, init: 0.5, label: "absenteeism",            hue: 2, layer: 0 },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "behaviour incidents",    hue: 2, layer: 0 },
			// Patterns
			{ id: 3, x: 280, y: 260, init: 0.5, label: "disengaged students",    hue: 3, layer: 1 },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "teacher fatigue",        hue: 3, layer: 1 },
			// Structures
			{ id: 5, x: 280, y: 420, init: 0.5, label: "test-driven curriculum", hue: 1, layer: 2 },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "weak belonging",         hue: 1, layer: 2 },
			// Mental Models
			{ id: 7, x: 280, y: 600, init: 0.5, label: "failure is your fault",  hue: 0, layer: 3 },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "school isn't for me",    hue: 0, layer: 3 }
		],
		edges: [
			{ from: 7, to: 5, arc: 0, strength:  1 }, // fault narrative → testing-driven curriculum
			{ from: 8, to: 6, arc: 0, strength:  1 }, // not-for-me belief → weak belonging
			{ from: 5, to: 4, arc: 0, strength:  1 }, // testing → teacher fatigue
			{ from: 5, to: 3, arc: 0, strength:  1 }, // testing → disengagement
			{ from: 6, to: 3, arc: 0, strength:  1 }, // weak belonging → disengagement
			{ from: 3, to: 1, arc: 0, strength:  1 }, // disengagement → absenteeism
			{ from: 3, to: 2, arc: 0, strength:  1 }, // disengagement → behaviour incidents
			{ from: 4, to: 6, arc: 0, strength:  1 }  // teacher fatigue → weak belonging (loop back up)
		],
		labels: [
			{ x: 850, y: 60,  text: "events you can see today" },
			{ x: 850, y: 220, text: "patterns building up" },
			{ x: 850, y: 380, text: "structures shaping the patterns" },
			{ x: 850, y: 560, text: "beliefs holding the structures in place" }
		]
	}

};
