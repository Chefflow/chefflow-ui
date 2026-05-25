# Requirements — <feature-id>

> Active spec slot. The spec-author fills this before any code is written.
> Status lives in `features.json`. When shipped, archive this set under `docs/tasks/`.

## Context

One paragraph: what user problem this solves and which area of the app it touches
(reference real files, e.g. `src/components/dashboard/PlanningTab/`).

## Requirements (EARS notation)

Write every requirement in EARS form so each maps to exactly one test/verification:

- **Ubiquitous** — The system shall \<action\>.
- **Event** — When \<trigger\>, the system shall \<action\>.
- **State** — While \<state\>, the system shall \<action\>.
- **Conditional** — If \<condition\>, then the system shall \<action\>.
- **Optional** — Where \<feature is present\>, the system shall \<action\>.

### Functional

- R1. When the user \<does X\>, the system shall \<observable result\>.
- R2. If \<invalid input\>, then the system shall \<error/toast via sonner\> and shall not \<bad effect\>.
- R3. While \<loading state\>, the system shall \<show skeleton/disabled control\>.

### Non-functional / constraints

- R-N1. The system shall keep all user-facing strings in `messages/{en,es,fr,de,it}.json`.
- R-N2. The system shall pass `./init.sh` (types + Biome) with no new errors.

## Out of scope

- List what this feature explicitly does NOT do.

## Acceptance / verification

Each Rn above must have a corresponding check the reviewer can run (manual steps,
component behavior, or a test). List them:

| Req | How it is verified |
|-----|--------------------|
| R1  | … |
| R2  | … |
