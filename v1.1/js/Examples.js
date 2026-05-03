/**********************************

EXAMPLES — three preset systems.

Each system uses a vertical convention so the layout reads top-down,
but the shapes are now purely visual categorisation — nothing in the
engine prescribes meaning per shape. Use them however suits your context.

**********************************/

window.FATHOM_EXAMPLES = {

	// ================================================================
	// ENVIRONMENTAL — urban heat & vulnerable communities
	// ================================================================
	environmental: {
		nextID: 9,
		nodes: [
			{ id: 1, x: 280, y: 100, init: 0.5, label: "heatwave deaths",       hue: 2, shape: "triangle" },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "ER visits spike",       hue: 2, shape: "triangle" },
			{ id: 3, x: 280, y: 260, init: 0.5, label: "rising urban temps",    hue: 3, shape: "rounded"  },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "low tree cover",        hue: 1, shape: "rounded"  },
			{ id: 5, x: 280, y: 420, init: 0.5, label: "zoning policy",         hue: 0, shape: "hexagon"  },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "energy cost barrier",   hue: 0, shape: "hexagon"  },
			{ id: 7, x: 280, y: 600, init: 0.5, label: "AC is a luxury",        hue: 0, shape: "diamond"  },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "trees are cosmetic",    hue: 0, shape: "diamond"  }
		],
		edges: [
			{ from: 7, to: 6, arc: 0,  strength:  1 },
			{ from: 8, to: 5, arc: 0,  strength:  1 },
			{ from: 5, to: 4, arc: 0,  strength: -1 },
			{ from: 6, to: 3, arc: 0,  strength:  1 },
			{ from: 4, to: 3, arc: 0,  strength:  1 },
			{ from: 3, to: 1, arc: 0,  strength:  1 },
			{ from: 3, to: 2, arc: 0,  strength:  1 }
		],
		labels: []
	},

	// ================================================================
	// HEALTH — burnout in healthcare workers
	// ================================================================
	health: {
		nextID: 9,
		nodes: [
			{ id: 1, x: 280, y: 100, init: 0.5, label: "staff resigning",         hue: 2, shape: "triangle" },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "clinical errors",         hue: 2, shape: "triangle" },
			{ id: 3, x: 280, y: 260, init: 0.5, label: "high turnover",           hue: 3, shape: "rounded"  },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "chronic understaffing",   hue: 3, shape: "rounded"  },
			{ id: 5, x: 280, y: 420, init: 0.5, label: "throughput funding",      hue: 1, shape: "hexagon"  },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "no staff wellbeing",      hue: 1, shape: "hexagon"  },
			{ id: 7, x: 280, y: 600, init: 0.5, label: "tough it out culture",    hue: 0, shape: "diamond"  },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "patients before staff",   hue: 0, shape: "diamond"  }
		],
		edges: [
			{ from: 7, to: 6, arc: 0, strength:  1 },
			{ from: 8, to: 5, arc: 0, strength:  1 },
			{ from: 5, to: 4, arc: 0, strength:  1 },
			{ from: 6, to: 4, arc: 0, strength:  1 },
			{ from: 4, to: 3, arc: 0, strength:  1 },
			{ from: 4, to: 2, arc: 0, strength:  1 },
			{ from: 3, to: 1, arc: 0, strength:  1 }
		],
		labels: []
	},

	// ================================================================
	// SOCIAL — school disengagement
	// ================================================================
	social: {
		nextID: 9,
		nodes: [
			{ id: 1, x: 280, y: 100, init: 0.5, label: "absenteeism",            hue: 2, shape: "triangle" },
			{ id: 2, x: 620, y: 100, init: 0.5, label: "behaviour incidents",    hue: 2, shape: "triangle" },
			{ id: 3, x: 280, y: 260, init: 0.5, label: "disengaged students",    hue: 3, shape: "rounded"  },
			{ id: 4, x: 620, y: 260, init: 0.5, label: "teacher fatigue",        hue: 3, shape: "rounded"  },
			{ id: 5, x: 280, y: 420, init: 0.5, label: "test-driven curriculum", hue: 1, shape: "hexagon"  },
			{ id: 6, x: 620, y: 420, init: 0.5, label: "weak belonging",         hue: 1, shape: "hexagon"  },
			{ id: 7, x: 280, y: 600, init: 0.5, label: "failure is your fault",  hue: 0, shape: "diamond"  },
			{ id: 8, x: 620, y: 600, init: 0.5, label: "school isn't for me",    hue: 0, shape: "diamond"  }
		],
		edges: [
			{ from: 7, to: 5, arc: 0, strength:  1 },
			{ from: 8, to: 6, arc: 0, strength:  1 },
			{ from: 5, to: 4, arc: 0, strength:  1 },
			{ from: 5, to: 3, arc: 0, strength:  1 },
			{ from: 6, to: 3, arc: 0, strength:  1 },
			{ from: 3, to: 1, arc: 0, strength:  1 },
			{ from: 3, to: 2, arc: 0, strength:  1 },
			{ from: 4, to: 6, arc: 0, strength:  1 }
		],
		labels: []
	}

};
