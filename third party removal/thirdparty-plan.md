Build a 75 second, 1920x1080, 60fps animated explainer video called "Third Country / Removal Trace" for my blog post on DHS v. D.V.D., No. 26-426. Use Remotion (React) so every frame is deterministic and renders to MP4. Also export a 1080x1350 vertical cut.

LOOK AND FEEL
Match a dense, monochrome scientific HUD aesthetic: pure black background, thin white and grey linework, monospaced type (IBM Plex Mono or JetBrains Mono), tiny uppercase labels with wide letter spacing, faint scanlines, subtle film grain. Only two accent colors: red #ff3b30 means a country the person is legally protected from; pure white with glow means the actual destination. Everything else is greyscale. Fast pace: cuts and camera moves of 0.4 to 0.8 seconds with strong ease in and ease out (cubic or expo), never linear.

GLOBE
Render an orthographic globe with d3-geo on a canvas layer, plus an SVG overlay for arcs, pins, labels and rings. Use world-atlas countries-50m for coastlines and borders, and a faint 10 degree graticule. Animate projection rotate and scale to fly the camera: spin the globe toward a country, zoom in for detail, pull back for long arcs. Long hauls are bowed flight arcs with a glowing head and a fading trail. Add a soft bloom or blur copy under bright lines.

DATA
Read src/data/third-country/routes.json for all 229 documented routes (fields o, d, p, n; country lon and lat in countries). Read a new file animation-cases.json for the featured cases. Each case has: id, name, usLocation {label, lon, lat} or null, detained date, barred {country ISO3, protectionType, year} or null, destination ISO3, via ISO3 or null, date, outcome (removed, blocked, allowed, returned, sentOnHome), onwardTo ISO3 or null, quote, notes, sources [{label, url}]. Never invent a U.S. location; if null, put the pin on the U.S. centroid labeled LOCATION NOT PUBLIC. Every case card must show its source.

STRUCTURE
1. Cold open, 0 to 6s: black, then the globe spins in. All 229 routes draw on as faint white threads at 10 to 15 percent opacity, so the globe looks wrapped in a tangle of lines. Top bar counters animate in: PEOPLE 25,702, DESTINATIONS 34, HOME COUNTRIES 77, ROUTES 229. A timer counts up in the top right.
2. Three main cases, about 8s each: Junior Alves, Natalia E., Ansumana S.
3. Six rapid cases, about 3.5s each: South Sudan flight, Ghana Sept. 2025 with chain return, Lopez, Ibarra-Perez, E.D.Q.C., Orville Etoria.
4. Swarm, 12s: pull back to the full globe and fire every route in sequence, ordered by date, each a quick white streak. Line thickness follows the documented count (1 to 9, 10 to 49, 50 to 249, 250 or more); routes with no count are thin and dashed. Counters run up to their totals. Destination pins swell by people received.
5. End card, 5s: "25,702 people documented. 34 destinations. The Supreme Court hears argument December 9." Then sheldonbarnes.com.

THE CASE BEAT (repeat for each case)
a. Detained: fly to the U.S. location, drop a crosshair pin with two pulsing rings, type out a label (DETAINED / FLORIDA plus two short lines).
b. Barred: rotate to the barred country. Fill it red at 20 percent with diagonal hatching and a glowing red outline. Fire a dashed red line from the pin toward it that stops at a red ring and splinters into short strokes. Stamp a label: PROTECTED / JAMAICA, CAT 2016.
c. Sent: pull back so both ends are visible and launch a bright white bowed arc from the pin to the destination. The destination fills white with glow and two rings. Label it: SENT / ESWATINI with date and one line of detail.
d. Aftermath, only if the data has onwardTo: a dashed white arc from the destination back to the home country, labeled SENT ON TO HOME COUNTRY.
e. Blocked cases: the white arc stops mid-flight, holds 6 frames, then shatters into particles; a COURT ORDER tag snaps in beside it.
If via is set (South Sudan flight via Djibouti), the arc lands at via, holds with a "HELD 6 WEEKS" label, then continues.

BOTTOM PANELS
Eight panels in two rows of four, each a thin bordered box with an uppercase title:
CASE FILE, PROTECTION / BARRED COUNTRY, ROUTE / DISPATCH (with a segmented progress bar that fills as the arc flies), INVESTIGATION FEED (scrolling numbered log lines that type in and mirror the action, e.g. "005 flag CAT 2016 JAMAICA", "006 block route FL to JAM"), NOTICE CLOCK (hours of notice counting down; 24h, 6h, or 0h with diplomatic assurances; 16h for Ibarra-Perez), DESTINATION / ARRIVALS (one small square per person who arrived there: white still held, grey released, red sent on), COURT / OUTCOME, and RUNNING TALLY (a sparkline of transfers per month).
Panels update on every beat with a quick flicker, as if data is streaming in.

TOP BAR
Title "THIRD COUNTRY / REMOVAL TRACE", subtitle "DHS V. D.V.D. · NO. 26-426 · DATA THROUGH SEPT. 10, 2026", five counters, and a segmented progress bar showing which act we are in. The red counter reads PROTECTED AT HOME, SENT ELSEWHERE with CASE 03 / 12 style numbering.

SOUND (optional track)
Low pulse bed at about 120 bpm, a tick on each feed line, a rising whoosh on each arc launch, a muted thud on landing, a glass crack on blocked cases.

ACCURACY RULES
Only show facts that are in the case's sources. Use "documented" for counts, since they are minimums. Do not depict anyone's face. Keep names to people already named in court records or press reports.

DELIVERABLES
Remotion project with compositions Main16x9 and Vertical4x5, the data loader, a single theme file for colors and type, and a README with render commands. First render a 10 second test of one case beat (Alves) so I can approve the look before building the rest.Build a 75 second, 1920x1080, 60fps animated explainer video called "Third Country / Removal Trace" for my blog post on DHS v. D.V.D., No. 26-426. Use Remotion (React) so every frame is deterministic and renders to MP4. Also export a 1080x1350 vertical cut.

LOOK AND FEEL
Match a dense, monochrome scientific HUD aesthetic: pure black background, thin white and grey linework, monospaced type (IBM Plex Mono or JetBrains Mono), tiny uppercase labels with wide letter spacing, faint scanlines, subtle film grain. Only two accent colors: red #ff3b30 means a country the person is legally protected from; pure white with glow means the actual destination. Everything else is greyscale. Fast pace: cuts and camera moves of 0.4 to 0.8 seconds with strong ease in and ease out (cubic or expo), never linear.

GLOBE
Render an orthographic globe with d3-geo on a canvas layer, plus an SVG overlay for arcs, pins, labels and rings. Use world-atlas countries-50m for coastlines and borders, and a faint 10 degree graticule. Animate projection rotate and scale to fly the camera: spin the globe toward a country, zoom in for detail, pull back for long arcs. Long hauls are bowed flight arcs with a glowing head and a fading trail. Add a soft bloom or blur copy under bright lines.

DATA
Read src/data/third-country/routes.json for all 229 documented routes (fields o, d, p, n; country lon and lat in countries). Read a new file animation-cases.json for the featured cases. Each case has: id, name, usLocation {label, lon, lat} or null, detained date, barred {country ISO3, protectionType, year} or null, destination ISO3, via ISO3 or null, date, outcome (removed, blocked, allowed, returned, sentOnHome), onwardTo ISO3 or null, quote, notes, sources [{label, url}]. Never invent a U.S. location; if null, put the pin on the U.S. centroid labeled LOCATION NOT PUBLIC. Every case card must show its source.

STRUCTURE
1. Cold open, 0 to 6s: black, then the globe spins in. All 229 routes draw on as faint white threads at 10 to 15 percent opacity, so the globe looks wrapped in a tangle of lines. Top bar counters animate in: PEOPLE 25,702, DESTINATIONS 34, HOME COUNTRIES 77, ROUTES 229. A timer counts up in the top right.
2. Three main cases, about 8s each: Junior Alves, Natalia E., Ansumana S.
3. Six rapid cases, about 3.5s each: South Sudan flight, Ghana Sept. 2025 with chain return, Lopez, Ibarra-Perez, E.D.Q.C., Orville Etoria.
4. Swarm, 12s: pull back to the full globe and fire every route in sequence, ordered by date, each a quick white streak. Line thickness follows the documented count (1 to 9, 10 to 49, 50 to 249, 250 or more); routes with no count are thin and dashed. Counters run up to their totals. Destination pins swell by people received.
5. End card, 5s: "25,702 people documented. 34 destinations. The Supreme Court hears argument December 9." Then sheldonbarnes.com.

THE CASE BEAT (repeat for each case)
a. Detained: fly to the U.S. location, drop a crosshair pin with two pulsing rings, type out a label (DETAINED / FLORIDA plus two short lines).
b. Barred: rotate to the barred country. Fill it red at 20 percent with diagonal hatching and a glowing red outline. Fire a dashed red line from the pin toward it that stops at a red ring and splinters into short strokes. Stamp a label: PROTECTED / JAMAICA, CAT 2016.
c. Sent: pull back so both ends are visible and launch a bright white bowed arc from the pin to the destination. The destination fills white with glow and two rings. Label it: SENT / ESWATINI with date and one line of detail.
d. Aftermath, only if the data has onwardTo: a dashed white arc from the destination back to the home country, labeled SENT ON TO HOME COUNTRY.
e. Blocked cases: the white arc stops mid-flight, holds 6 frames, then shatters into particles; a COURT ORDER tag snaps in beside it.
If via is set (South Sudan flight via Djibouti), the arc lands at via, holds with a "HELD 6 WEEKS" label, then continues.

BOTTOM PANELS
Eight panels in two rows of four, each a thin bordered box with an uppercase title:
CASE FILE, PROTECTION / BARRED COUNTRY, ROUTE / DISPATCH (with a segmented progress bar that fills as the arc flies), INVESTIGATION FEED (scrolling numbered log lines that type in and mirror the action, e.g. "005 flag CAT 2016 JAMAICA", "006 block route FL to JAM"), NOTICE CLOCK (hours of notice counting down; 24h, 6h, or 0h with diplomatic assurances; 16h for Ibarra-Perez), DESTINATION / ARRIVALS (one small square per person who arrived there: white still held, grey released, red sent on), COURT / OUTCOME, and RUNNING TALLY (a sparkline of transfers per month).
Panels update on every beat with a quick flicker, as if data is streaming in.

TOP BAR
Title "THIRD COUNTRY / REMOVAL TRACE", subtitle "DHS V. D.V.D. · NO. 26-426 · DATA THROUGH SEPT. 10, 2026", five counters, and a segmented progress bar showing which act we are in. The red counter reads PROTECTED AT HOME, SENT ELSEWHERE with CASE 03 / 12 style numbering.

SOUND (optional track)
Low pulse bed at about 120 bpm, a tick on each feed line, a rising whoosh on each arc launch, a muted thud on landing, a glass crack on blocked cases.

ACCURACY RULES
Only show facts that are in the case's sources. Use "documented" for counts, since they are minimums. Do not depict anyone's face. Keep names to people already named in court records or press reports.

DELIVERABLES
Remotion project with compositions Main16x9 and Vertical4x5, the data loader, a single theme file for colors and type, and a README with render commands. First render a 10 second test of one case beat (Alves) so I can approve the look before building the rest.