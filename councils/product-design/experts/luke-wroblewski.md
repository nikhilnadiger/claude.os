---
expert: Luke Wroblewski (Global)
council: PRODUCT DESIGN
learnings: 25
---

# Luke Wroblewski (Global) — Full Learnings

## 1. Mobile-First Changes Everything

**Problem:** Desktop-first design. Mobile is shrunken desktop. Fails.
**Mainstream:** Design desktop. Adapt to mobile.
**Their approach:** Start mobile. Constraints of mobile force clarity and priority. Desktop is enhancement.
**Example:** Mobile form: 4 fields max per screen. Desktop: all fields visible. Mobile constraint improves desktop.

## 2. Single Column Layout Superiority

**Problem:** Multi-column layouts. Users overwhelmed by options.
**Mainstream:** Maximize screen usage. Show more columns.
**Their approach:** Single column on mobile guides user linearly. Clear reading order. Attention focused.
**Example:** Mobile form single column. On desktop: optional second column, but primary flow still single column.

## 3. Touch Targets Must Be Generous

**Problem:** Clickable elements too small. Users miss, get frustrated.
**Mainstream:** Efficient use of space. Small buttons.
**Their approach:** Touch target minimum 48x48 pixels. Larger enables interaction. Space isn't wasted; it enables interaction.
**Example:** Button that's 48x48 pixels feels generous. Button that's 16x16 feels impossible.

## 4. Input Type Matters

**Problem:** All input same. Date picker, number spinner, text field all look same.
**Mainstream:** Consistent input appearance.
**Their approach:** Input type should suggest how to input: slider for range, buttons for options, text for open-ended.
**Example:** Date input: should show date picker, not text field. Input type guides interaction.

## 5. Progressive Disclosure Simplifies

**Problem:** All options visible. Overwhelming.
**Mainstream:** Show capabilities. More options = more power.
**Their approach:** Show core options. Advanced options hidden. Reveal as needed. Complexity available but not forced.
**Example:** Settings screen: basic options visible, advanced settings hidden. User finds them when needed.

## 6. Thumb Zone Optimization

**Problem:** Small screens require reaching. Hard to tap top of screen.
**Mainstream:** Consistent layout regardless of reach.
**Their approach:** Optimize for natural thumb reach. Primary actions in thumb zone (bottom third of screen).
**Example:** Mobile keyboard: primary action button at bottom within thumb reach, not at top.

## 7. Sign-Up Form Friction

**Problem:** Sign-up requires 15 fields. Most users abandon.
**Mainstream:** Collect information you might need.
**Their approach:** Minimum viable sign-up: collect essential only. Collect more data after user invests in product.
**Example:** Sign-up: email, password only. Ask about preferences after they've used product.

## 8. Mobile Navigation Patterns

**Problem:** Navigation takes up space. Clutters mobile interface.
**Mainstream:** Navigation always visible.
**Their approach:** Mobile navigation hidden until needed: hamburger menu, bottom nav. Desktop: always visible.
**Example:** Navigation hidden in hamburger on mobile. Desktop: sidebar visible. Different patterns for different contexts.

## 9. Responsive Images Not Responsive

**Problem:** Same image on mobile and desktop. Bandwidth wasted.
**Mainstream:** Responsive design includes images.
**Their approach:** Optimize images for device: low-res on mobile, high-res on desktop. Save bandwidth, improve performance.
**Example:** Mobile: 320px image. Desktop: 1200px image. Same responsive code, different image served.

## 10. Form Label Placement

**Problem:** Labels above fields look right on desktop. Mobile takes space.
**Mainstream:** Consistent label placement.
**Their approach:** Mobile: labels above fields. Desktop: labels beside fields. Context determines best placement.
**Example:** Mobile form: label stacked above input. Desktop: label beside input. Same form, different layouts.

## 11. Gesture Ambiguity

**Problem:** Same gesture means different things. Confusing.
**Mainstream:** Consistent gesture behavior.
**Their approach:** Gestures should be unambiguous: swipe has specific meaning, tap has specific meaning. Clear mapping.
**Example:** Swipe right means 'like.' Swipe left means 'pass.' Consistent mapping across app.

## 12. Connection Speed Assumptions

**Problem:** Design assumes fast connection. Fails on slow networks.
**Mainstream:** Design for average connection.
**Their approach:** Design for slow connection. Test on 3G. Optimize for worst case.
**Example:** App that loads in 2 seconds on WiFi but 20 seconds on 3G. Redesign for 3G baseline.

## 13. Fat Finger Syndrome

**Problem:** Small targets assume precise interaction. Users have fingers.
**Mainstream:** Precise UI. Users need precision.
**Their approach:** Buttons should be easy to hit without precision. Generously sized targets.
**Example:** Close button: 44x44 minimum so user can tap without precision.

## 14. Avoid Content on Hover

**Problem:** Desktop patterns assume hover. Mobile has no hover.
**Mainstream:** Hover reveals content. Works everywhere.
**Their approach:** Content shouldn't require hover. If it's important, show it. If hidden, make discoverable without hover.
**Example:** Tooltip only on hover: hidden on mobile. Show important tooltips always, or make accessible on tap.

## 15. Prioritization by Context

**Problem:** All features equally prominent. Most users need few.
**Mainstream:** Feature parity. Show all.
**Their approach:** Features prioritized by context and user: mobile core features, desktop full feature set.
**Example:** Mobile: send email. Desktop: send email, schedule, add attachments, create signature, etc.

## 16. The Fold Is Dead (But Space Is Real)

**Problem:** Below the fold, content ignored. But it's mobile; infinite scroll.
**Mainstream:** Above the fold is critical.
**Their approach:** Below the fold matters on mobile (scroll is natural). But don't bury critical info too deep.
**Example:** Call-to-action can be below fold on mobile (scroll is expected). Place thoughtfully.

## 17. Orientation Change Gracefully

**Problem:** Rotate phone. Layout breaks.
**Mainstream:** Design for one orientation.
**Their approach:** Both orientations work. Layout adapts. No content lost in transition.
**Example:** Portrait: list view. Landscape: grid. Both layouts coherent.

## 18. Back Button Behavior

**Problem:** Back button confusing. Unclear what 'back' means.
**Mainstream:** Back button goes to previous page.
**Their approach:** Back button behavior should be predictable: previous page in app, not browser history, not previous app.
**Example:** Back button: return to list. Not browser back (leaves app).

## 19. Loading States Matter

**Problem:** Action triggered. Nothing happens for seconds. Broken?
**Mainstream:** Show loading spinner.
**Their approach:** Loading state should communicate: something is happening, progress, estimate of time.
**Example:** Skeleton loading shows content shape. User knows what's coming. Better than spinner.

## 20. Confirmation for Destructive Actions

**Problem:** User accidentally deletes. No way to recover.
**Mainstream:** Allow action immediately.
**Their approach:** Destructive actions (delete, charge) should confirm. Second chance to reconsider.
**Example:** Delete button: asks 'Are you sure?' Tap again to confirm.

## 21. Preference for Buttons Over Links

**Problem:** Touch targets with links tiny. Hard to tap.
**Mainstream:** Links are efficient. Buttons take space.
**Their approach:** Mobile: buttons (large touch targets). Desktop: links acceptable but buttons better.
**Example:** Primary action: button not link. Link harder to tap on mobile.

## 22. Avoid Auto-Play Media

**Problem:** Video auto-plays. Sound blares. Annoying.
**Mainstream:** Auto-play engages users.
**Their approach:** User-initiated media only. Respect user's context and attention.
**Example:** Video: plays only when tapped, not on page load.

## 23. Scrolling as Interaction

**Problem:** Scrolling seen as passive. It's interaction.
**Mainstream:** Swipe for big changes. Scroll for viewing.
**Their approach:** Scrolling is primary mobile interaction. Design with scrolling as central, not swipe.
**Example:** Long list: scrolling, not swiping between screens.

## 24. Thumb vs. Index Finger

**Problem:** Interaction assumes one type of touch. Wrong.
**Mainstream:** Consistent interaction style.
**Their approach:** Different interactions suit different touch types: thumb for swiping, index for precise tapping.
**Example:** Thumb swiping: larger targets. Index tapping: can be smaller.

## 25. Test on Real Devices

**Problem:** Design looks good in browser. Fails on real phone.
**Mainstream:** Design in browser. Should translate to device.
**Their approach:** Test on actual devices: real screen size, real touch, real network speed, real conditions.
**Example:** App that works in simulator but fails on old iPhone. Real device testing reveals issues.
