# fathom

> see the system beneath the symptom

A tool by [First Person Consulting](https://fpconsulting.com.au) for framing
problems as systems and finding intervention points.

`fathom` is built for workshops, strategy sessions and capability-building.
Use it to map a problem through the **iceberg model** — events at the surface,
patterns underneath, structures below those, and mental models at the bottom —
then look at how nodes connect to spot where the highest-leverage intervention
points sit.

## Using fathom

The app is designed to be embedded as an iframe in another site (a workshop
landing page, an internal LMS, a client deliverable). Drop it into a host page:

```html
<iframe src="https://your-host/fathom/v1.1/" width="100%" height="800" frameborder="0"></iframe>
```

Inside the tool you can:

- **Load a starter system** — pick from environmental, health or social systems pre-mapped onto the iceberg layers.
- **Draw your own** — pencil in nodes, drag arrows between them, click an arrow to flip its polarity (`+` or `−`).
- **Tag each node with an iceberg layer** — the right-hand panel has a four-button picker.
- **Read leverage at a glance** — every node shows in/out degree counts. High out-degree at deeper layers usually means high leverage.
- **Simulate** — hit play and push values up or down on a node to watch the system respond.
- **Use the iceberg view** — toggle the layered backdrop on or off in the top bar.

## Layout

```
v1.1/
├── index.html          # the lean iframe-friendly entry point
├── css/loopy.css       # fpc-brand styling
├── js/
│   ├── Loopy.js        # main app
│   ├── Model.js        # system model + iceberg backdrop + connectivity helpers
│   ├── Node.js         # node with iceberg layer + degree badge
│   ├── Edge.js         # arrow with polarity
│   ├── Sidebar.js      # right-hand panel + layer picker
│   ├── Toolbar.js      # left-hand drawing tools
│   ├── Examples.js     # the three preset systems
│   └── ...
└── pages/              # legacy howto/examples/credits content (unused, kept for archival)
```

## Credits & licence

`fathom` builds on the open-source simulation engine of
[**LOOPY**](https://ncase.me/loopy/) by Nicky Case (released to the public
domain under [CC0](http://creativecommons.org/publicdomain/zero/1.0/)).

The iceberg framing, fpc-brand styling, in/out degree analysis,
preset systems and instructions panel are added on top.

This repo, like LOOPY, is public domain.
