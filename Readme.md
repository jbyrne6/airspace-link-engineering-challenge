## README

### Current State

My approach for the initial version of this application is to demonstrate the basic functionality of determining flight approval. The current state of the application is able to tell you if your flight plan would be accepted or denied, and if it was denied how much area is in a restricted zone. You can create multiple polygons, move them around, and delete them. The flight status and restricted area (if applicable) in km^2 will update automatically as polygons are modified.

### Future additions to functionality
1. Add Flight Zone Id text to the graphics drawn.
2. Create API to handle "Can I Fly" logic.
3. Toggle visibility of the different geometries drawn.
4. Make restricted polygon not clickable.
5. Make info about areas show up on hover or implement a popup feature on click.
6. Clean up and expand on how the info of each zone is displayed.