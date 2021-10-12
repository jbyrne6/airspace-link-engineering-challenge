## Description

Thanks to your [Part 107 Commercial Drone Pilot's license](https://www.faa.gov/uas/), you've been hired by an electrical company to inspect power lines using aerial drone videography. To understand if you are legally allowed to fly in this area, you've requested data from the FAA to indicate what airspace near your flight(s) - if any - is [controlled](https://www.faa.gov/uas/recreational_fliers/where_can_i_fly/airspace_101/) and thus not approved for drone flights. The FAA returned to you an array of coordinates in [geoJson](https://geojson.org/) representing a polygon of controlled airspace, which is a "no fly zone". Your job is to add functionality to an existing web application to provide this insight.

## Requirements

We have provided a starter web application that has just about everything you need to accomplish the task. The application setup instructions are below. Once you have the app up and running, you will see the polygon of controlled "no fly" airspace on the map. Using the sketch tool you can draw shapes of your various flight areas on the map. After a sketch is complete, your work should display which portion - if any - of the sketch is in controlled airspace (i.e. any area that intersects the controlled airspace polygon).

- Search the code for "HINT" - these will help you along
- Display a message in the `Info` component indicating whether this flight will be denied (**it intersects**) or approved (**it does not intersect**)
- Display the area (in sq meters or sq kilometers) of the intersection, if any
- It'd also be great to see the intersection shape highlighted with a different color so that it is easy to visualize

#### Notes

If you are applying for the Frontend Developer position, completing the above requirements will suffice. If you are applying for Full Stack Developer, you may want to show your backend skills by spinning up an API to handle the "Can I Fly?" logic. Whether you combine frontend and backend into one challenge is up to you.

At Airspace Link, we feel strongly about good communication. Make sure to provide a short `README.md` which explains your approach. Pay attention to grammar; good writing will always win us over. You also might include a list of ideas you'd love to tackle if you had infinite time to work on the app.

This challenge should not take more than 2-3 hours. You now have the base requirements, but we **strongly** encourage going above and beyond by choosing an extra credit idea below. This is your chance to show off your skills and creativity! We understand that doing your best work can often take significant time, but please try to finish within one week. When it's ready, send us a link to the completed project. Please make your repo private and give access to `fieldsco` and `ddbradshaw`.

#### Extra credit ideas

- Deploy your project to [GitHub Pages](https://pages.github.com/)
- Update the intersection graphic and computed area when the sketch is moved (i.e. clicked and dragged)
- Provide a layer control to toggle the visibility of your flight area
- Add unit/snapshot tests
- <insert your awesome idea here!>

## Setup instructions

It is assumed that you already have `node` and `yarn` installed on your machine. Google `how to install node` or `how to install yarn` if you need help setting up these environments.

### Clone the repo

`git clone https://github.com/airspace-link-inc/engineering-challenge.git`

### Initialize The Application

`yarn install`

### Start the application

`yarn start`

### Build a deployable version of the app

`yarn build`

### Lint your code

`yarn lint`

### Verify all TypeScripts are in good working order

`yarn tsc`

### Run tests

See documentation on writing tests at [Testing Library](https://testing-library.com/docs/)
`yarn test`

## Technologies included in this template

- [TypeScript](https://www.typescriptlang.org/): Extends JavaScript to adding data types
- [React](https://reactjs.org/): Rendering engine for interactive UIs. Includes setup with react-refresh for hot module reloading.
- [WebPack](https://webpack.js.org/): Bundles the various JavaScript/TypeScript files together into a final "bundled" version for the web server
- [AntD](https://ant.design/components/overview/): React based UI component library
- [Styled Components](https://styled-components.com/): Reusable and isolated component styling for React applications
- [Mobx](https://github.com/mobxjs/mobx): Full featured and reactive state management
- [SASS](https://sass-lang.com/): CSS Precompiler. Allows you to build css with variables and logic.
- [ESRI](https://developers.arcgis.com/javascript/latest/): Esri JavaScript map SDK
- [Babel](https://babeljs.io/): JavaScript "transpiler"
- [Jest](https://jestjs.io/): Jest is a delightful JavaScript Testing Framework with a focus on simplicity
- [Testing Library](https://testing-library.com/docs/): Simple and complete testing utilities that encourage good testing practices
