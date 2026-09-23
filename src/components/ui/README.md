# `components/ui` — RFP Buddy primitives

A small, custom set of generic UI primitives. They are **not** Untitled UI React
components. We build them ourselves with Tailwind CSS v4 and React Aria
Components, and style them to loosely follow Untitled UI's look. Icons come from
`@untitledui/icons`.

| Primitive                                                                        | Built on                                  | Notes                                                                                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Button`, `LinkButton`                                                           | `react-aria-components` `Button` / `Link` | Use `LinkButton` when the action changes the URL.                                                                     |
| `Badge`                                                                          | `<span>`                                  | Tone-based label chip.                                                                                                |
| `Input`                                                                          | `react-aria-components` `TextField`       | Always requires a `label`; `hideLabel` keeps it for screen readers only.                                              |
| `Table` (+ `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`) | Semantic `<table>`                        | Styling only. Move to the React Aria `Table` if we need selection, sorting, or grid keyboard navigation.              |
| `Tabs` (+ `TabList`, `Tab`, `TabPanel`)                                          | `react-aria-components` `Tabs`            | The tab list scrolls horizontally when it doesn't fit. Callers decide whether selection is local state or URL-driven. |
| `Select`                                                                         | `react-aria-components` `Select`          | Typed string-union values.                                                                                            |

## Rules

- Keep these generic. They must not import from `features/`, `lib/constants/rfp`, or
  anything else about RFPs. Domain mapping, like RFP status to badge tone, goes in
  `components/rfp` or the feature.
- Every interactive primitive must have an accessible name and a visible
  keyboard-focus style (`data-focus-visible:` / `data-focused:`).
- Add a primitive only once a working screen needs it. Don't build ahead.
- Import official Untitled UI React source only under its license, and update
  `CLAUDE.md` and `docs/architecture.md` when you do.
