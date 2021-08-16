import { action, makeObservable, observable } from 'mobx';
import RootStore from './RootStore';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';

export default class MapStore {
  rootStore: RootStore;
  map!: __esri.Map;
  noFlyLayer!: __esri.GraphicsLayer;
  sketchLayer!: __esri.GraphicsLayer;
  sketch!: __esri.Sketch;
  sketchState!: string;

  constructor(rootStore: RootStore) {
    // HINT: you can add additional observable properties to this class
    // https://mobx.js.org/observable-state.html
    makeObservable(this, { sketchState: observable, setSketchState: action });
    this.rootStore = rootStore;
    this.setSketchState('idle');
  }

  setSketchState(state: string) {
    this.sketchState = state;
  }

  constructMap(container: string) {
    this.sketchLayer = new GraphicsLayer();
    this.noFlyLayer = new GraphicsLayer();

    // Define a symbol
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-SimpleFillSymbol.html
    const symbol = {
      type: 'simple-fill',
      color: [51, 51, 204, 0.2],
      style: 'solid',
      outline: {
        color: 'white',
        width: 2,
      },
    };

    // Construct map graphic
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
    this.noFlyLayer.add(
      new Graphic({
        geometry: new Polygon({
          spatialReference: { wkid: 102100 },
          rings: [
            [
              [-9278977.502393615, 5196972.662366206],
              [-9278404.224681476, 5197240.191965203],
              [-9274505.936238931, 5195673.232885358],
              [-9275518.726863708, 5190055.1113064],
              [-9278881.956108259, 5189061.429938688],
              [-9280869.318843672, 5188660.135540191],
              [-9282646.479751302, 5192481.986954449],
              [-9278977.502393615, 5196972.662366206],
            ],
          ],
        }),
        symbol,
      })
    );

    // Create the map and add the graphics layer
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
    this.map = new ArcGISMap({
      basemap: 'streets-vector',
      layers: [this.noFlyLayer, this.sketchLayer],
    });

    // Set the map view, including location and zoom level
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html
    const view = new MapView({
      map: this.map,
      container,
      center: [-83.35447311401367, 42.23982914405], // Longitude, latitude
      zoom: 11,
    });

    // When the view finishes loading, add the sketch widget
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch.html
    view.when(() => {
      this.sketch = new Sketch({
        layer: this.sketchLayer,
        view,
        visibleElements: {
          createTools: { point: false, polygon: false, polyline: false },
          selectionTools: { 'lasso-selection': false, 'rectangle-selection': false },
          settingsMenu: false,
          undoRedoMenu: false,
        },
        creationMode: 'update', // graphic will be selected as soon as it is created
      });
      view.ui.add(this.sketch, 'top-right');

      this.sketch.on('create', this.sketchCreate);
    });
  }

  sketchCreate = async (event: __esri.SketchCreateEvent) => {
    this.setSketchState(event.state);
    if (event.state !== 'complete') return;

    // STEP 1: determine if the sketch's graphic intersects with the graphic in the faaLayer
    // STEP 2: if it intersects, compute the area of the intersection
    // STEP 3: create a new graphic with any possible intersection, and display it on the map

    // HINT: the event has a graphic property which has a geometry property
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html

    // HINT: you can use getItemAt to access one of the graphics of the faaLayer.
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Collection.html#getItemAt
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html

    // HINT: you can use the geometry engine to calculate the intersection of two geometries
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#intersect

    // HINT: you can use the geometry engine to calculate area of a polygon
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#geodesicArea

    // HINT: you can add a new Graphic to the view's graphics collection to display it on the map
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#graphics
  };

  cleanup() {
    // Todo, remove any listeners
    this.sketch.destroy();
    this.setSketchState('idle');
  }
}
