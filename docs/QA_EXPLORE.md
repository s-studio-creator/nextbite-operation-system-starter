# QA Checklist: Explore Screen

Run through this checklist before closing Sprint 002.

## Location Permission

- [ ] App requests foreground location permission on first launch
- [ ] Permission dialog shows the correct usage description
- [ ] Permission granted → map loads with user location puck visible
- [ ] Permission denied → "Enable Location" button appears
- [ ] Tapping "Enable Location" re-requests permission
- [ ] Loading spinner shown while permission is being determined

## Map

- [ ] Map tiles render correctly (Apple Maps / Google Maps via react-native-maps)
- [ ] Map is centered on user location (when granted)
- [ ] Map is centered on Hong Kong (when denied)
- [ ] User location puck appears after permission granted
- [ ] Camera follows user when "Near me" hasn't been deactivated
- [ ] Map rotates are disabled
- [ ] Compass and toolbar are hidden

## Restaurant Markers

- [ ] 5-8 markers appear on the map near user location
- [ ] Healthy pick markers show in green
- [ ] Default markers show in brand red

## Marker Selection

- [ ] Tap a marker → marker scales up (52px) and turns darker red
- [ ] Tap a marker → camera animates to center on that restaurant
- [ ] Tap a marker → bottom sheet slides up
- [ ] Tap another marker → previous marker deselects, new one selects
- [ ] Tap map background → marker deselects, bottom sheet slides down

## Bottom Sheet

- [ ] Slides up with spring animation when restaurant is selected
- [ ] Slides down when deselected
- [ ] Shows restaurant image (or placeholder colour)
- [ ] Shows restaurant name and cuisine type
- [ ] Shows rating badge (★ X.X format)
- [ ] Shows three metrics: Calories, Protein, Walk
- [ ] "Walk There" button is visible and tappable
- [ ] Tapping "Walk There" animates camera closer to restaurant

## "Near Me" Button

- [ ] Visible at top-right of screen
- [ ] Tapping recenters map on user location
- [ ] Disabled (dimmed) when user location is unavailable
- [ ] Re-enables camera follow mode

## Performance

- [ ] No blocking runtime errors
- [ ] Markers render within 3 seconds of map load
- [ ] Bottom sheet animation runs at 60fps
- [ ] Location permission request does not block the UI thread
