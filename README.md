# fathom

> see the system beneath the symptom

A tool by [First Person Consulting](https://fpconsulting.com.au) for mapping
problems as systems and exploring where to intervene.

`fathom` is built for workshops, strategy sessions and capability-building.
Sketch a problem as a network of nodes and arrows, categorise the nodes by
shape and colour however suits your context, and use the in/out connection
counts to spot leverage points.

## Using fathom

The app is designed to be embedded as an iframe in another site (a workshop
landing page, an internal LMS, a client deliverable). Drop it into a host page:

```html
<iframe src="https://your-host/fathom/v1.1/" width="100%" height="800" frameborder="0"></iframe>
```

Inside the tool you can:

- **Load a starter system** — pick from environmental, health or social systems.
- **Draw your own** — pencil in nodes, drag arrows between them, click an arrow to flip its polarity (`+` or `−`).
- **Pick a shape and colour for each node** — five shapes (circle, triangle, rounded square, hexagon, diamond) and six colours, free-form so you can apply your own conventions.
- **Read leverage at a glance** — every node shows in/out degree counts. High out-degree usually means a leverage point.
- **Simulate** — hit play and push values up or down on a node to watch the system respond.

## Layout

```
v1.1/
├── index.html          # the lean iframe-friendly entry point
├── css/loopy.css       # fpc-brand styling
├── js/
│   ├── Loopy.js        # main app
│   ├── Model.js        # system model + connectivity helpers
│   ├── Node.js         # node with shape + degree badge
│   ├── Edge.js         # arrow with polarity
│   ├── Sidebar.js      # right-hand panel + shape picker
│   ├── Toolbar.js      # left-hand drawing tools
│   ├── Examples.js     # the three preset systems
│   └── ...
└── pages/              # legacy howto/examples/credits content (unused, kept for archival)
```

## Credits & licence

`fathom` builds on the open-source simulation engine of
[**LOOPY**](https://ncase.me/loopy/) by Nicky Case (released to the public
domain under [CC0](http://creativecommons.org/publicdomain/zero/1.0/)).

The fpc-brand styling, shape categorisation, in/out degree analysis,
preset systems and instructions panel are added on top.

This repo, like LOOPY, is public domain.
