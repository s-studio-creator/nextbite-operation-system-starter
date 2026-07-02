# Design System

## Design Language

NextBite should feel premium, friendly, calm, playful, and timeless. The interface supports food and exploration rather than competing with them.

Core rule:

- Usability over decoration.
- Timeless over trendy.
- Clarity over complexity.

## Colors

Current implementation tokens live in `constants/theme.ts`.

- Primary Red: `#E73D2F`
- Primary Pressed: `#C92F24`
- Accent Yellow: `#F2B84B`
- Healthy Green: `#41A765`
- Background: `#FFF8F1`
- Surface: `#FFFFFF`
- Card: `#FFFDF9`
- Border: `#D9D0C8`
- Primary Text: `#201A17`
- Secondary Text: `#6E625D`
- Error: `#D93838`

Avoid:

- Beauty-app pastels.
- Medical green-heavy UI.
- Fast-food branding.
- Enterprise dashboards.

## Typography

Use a clean modern sans-serif through the platform stack.

Hierarchy direction:

- Large, confident screen titles.
- Comfortable body text.
- Compact labels for metadata.
- No decorative fonts.
- No negative letter spacing.

## Radius

Current radius scale:

- Small: `8`
- Medium: `16`
- Large: `24`
- Extra large: `32`
- Full: `999`

Use larger radii for cards, bottom sheets, and food-led surfaces.

## Spacing

Current spacing scale:

- `8`
- `16`
- `24`
- `32`
- `48`

Use generous spacing. Avoid dense restaurant-directory layouts.

## Elevation

Current elevation tokens:

- Card shadow.
- Floating shadow.

Use elevation for:

- Cards.
- Floating controls.
- Bottom sheets.

Avoid heavy borders and stacked card-within-card layouts.

## Components

Current component direction:

- Map markers should be clear and minimal.
- Restaurant cards should prioritize food and decision details.
- Bottom sheets should contain focused restaurant decision information.
- Discovery cards should feel collectible and decisive.
- Navigation should require little thought.

Future reusable components should include:

- Primary Button.
- Secondary Button.
- Floating Action Button.
- Bottom Navigation.
- Restaurant Card.
- Discovery Card.
- Map Marker.
- Bottom Sheet.
- Search Bar.
- Chips.
- Tags.
- Badges.
- Avatar.
- Challenge Card.
- Achievement Card.

## Motion Principles

Motion should be:

- Smooth.
- Physical.
- Short.
- Helpful.

Use motion to:

- Open and close bottom sheets.
- Reveal Draw cards.
- Clarify state changes.

Avoid flashy animation that competes with food or map interaction.

## Icon Guidelines

- Use one consistent rounded icon family.
- Current icon package: `lucide-react-native`.
- Icons should clarify actions.
- Do not mix icon styles.
- Prefer known symbols over text-only controls when meaning is clear.
