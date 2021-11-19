import { action, makeObservable, observable } from 'mobx';
import RootStore from './RootStore';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Sketch from '@arcgis/core/widgets/Sketch';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
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
  flightStatus!: string;
  totalRestrictedArea!: number;
  flightZoneSketches!: Array<Graphic>;


  constructor(rootStore: RootStore) {
    // HINT: you can add additional observable properties to this class
    // https://mobx.js.org/observable-state.html
    makeObservable(this, { sketchState: observable, setSketchState: action });
    makeObservable(this, { flightStatus: observable, setFlightStatus: action });
    makeObservable(this, { flightZoneSketches: observable, setFlightZoneSketches: action });
    this.rootStore = rootStore;
    this.setSketchState('idle');
    this.setFlightStatus('unknown');
    this.setFlightZoneSketches([]);
  }

  setSketchState(state: string) {
    this.sketchState = state;
  }

  setFlightStatus(state: string) {
    this.flightStatus = state;
  }

  setFlightZoneSketches(state: Array<Graphic>) {
    this.flightZoneSketches = state;
  }

  // finds the smallest integer greater than zero not in an array
  findSmallestMissing(arr: Array<number>) {
    let count = 1;
    if(!arr?.length){
       return count;
    }
    while(arr.indexOf(count) !== -1){
       count++;
    }
    return count;
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
      this.sketch.on('update', this.sketchMove);
      this.sketch.on('delete', this.sketchDelete);
    });
  }

  sketchCreate = async (event: __esri.SketchCreateEvent) => {
    this.setSketchState(event.state);
    if (event.state !== 'complete') return;
    const eventGeometry = event.graphic.geometry
    const eventGraphic = event.graphic
    const existingSketchIds = this.sketchLayer.graphics.filter(graphic => graphic.sketchType == 'full-sketch').map(graphic => graphic.graphicId)

    // set the graphic id drawn to the lowest id that is not yet used (can re-use id's of graphics that have been deleted)
    eventGraphic.graphicId = this.findSmallestMissing(existingSketchIds)
    eventGraphic.sketchType = 'full-sketch' 
    eventGraphic.intersectionArea = 0

    // THERE ARE 3 STEPS TO SATISFYING THE BASE REQUIREMENTS FOR THE CHALLENGE
    // STEP 1: determine if the sketch's graphic intersects with the graphic in the noFlyLayer
    const noFlyZone = this.noFlyLayer.graphics.getItemAt(0).geometry

    const eventGeometryOverlaps = geometryEngine.overlaps(eventGeometry, noFlyZone)
    const flightStatusString = eventGeometryOverlaps ? 'denied' : 'approved'
    this.setFlightStatus(flightStatusString)
    // add current flight status to the graphic
    eventGraphic.flightStatus = flightStatusString

    // STEP 2: if it intersects, compute the area of the intersection, and display it
    if (eventGeometryOverlaps) {
      const eventGeometryIntersection = geometryEngine.intersect(eventGeometry, noFlyZone)
  
      // intersection area in square kilometers
      const intersectionArea = Number.parseFloat(geometryEngine.geodesicArea(eventGeometryIntersection, "square-kilometers"))
      eventGraphic.intersectionArea = intersectionArea
  
      // STEP 3: create a new graphic with any possible intersection, and display it on the map
      const overlapFillSymbol = {
        type: 'simple-fill',
        color: [255, 0, 0, 0.2],
        style: 'solid',
        outline: {
          width: 0,
        },
      };

      const overlapFillGraphic = new Graphic({
        geometry: eventGeometryIntersection,
        symbol: overlapFillSymbol,
        associatedGraphicId: eventGraphic.graphicId,
        sketchType: 'overlap'
      });

      // add restricted graphic to the sketch layer
      this.sketchLayer.add(overlapFillGraphic)
    }
    // add full sketch graphic to exposed variable
    const fullSketchGraphics = this.sketchLayer.graphics.items.filter(graphic => graphic.sketchType == 'full-sketch')
    this.setFlightZoneSketches(fullSketchGraphics.sort((a: number,b: number) => a.graphicId - b.graphicId))
  };

  sketchMove = async (event: __esri.SketchUpdateEvent) => {
    const eventInfo = event.toolEventInfo;
    if (eventInfo && eventInfo.type.includes("move")){
      const eventGeometry = event.graphics[0].geometry
      const eventGraphic = event.graphics[0]
      const noFlyZone = this.noFlyLayer.graphics.getItemAt(0).geometry

      const eventGeometryOverlaps = geometryEngine.overlaps(eventGeometry, noFlyZone)
      const flightStatusString = eventGeometryOverlaps ? 'denied' : 'approved'
      this.setFlightStatus(flightStatusString)
      eventGraphic.flightStatus = flightStatusString

      // cleans up left over restricted area when you move area out of no-fly zone
      if (!eventGeometryOverlaps) {
        const restrictedAreaGraphics = (this.sketchLayer.graphics.items).filter(graphic => graphic.sketchType == 'overlap'  && graphic.associatedGraphicId == eventGraphic.graphicId)
        this.sketchLayer.removeMany(restrictedAreaGraphics)
      }

      // if the geometry overlaps with a no-fly zone
      if (eventGeometryOverlaps) {
        const eventGeometryIntersection = geometryEngine.intersect(eventGeometry, noFlyZone)

        // set new intersection area
        const intersectionArea = Number.parseFloat(geometryEngine.geodesicArea(eventGeometryIntersection, "square-kilometers"))
        eventGraphic.intersectionArea = intersectionArea

        // create a new graphic with any possible intersection, and display it on the map
        const overlapFillSymbol = {
          type: 'simple-fill',
          color: [255, 0, 0, 0.2],
          style: 'solid',
          outline: {
            width: 0,
          },
          sketchType: 'full-sketch'
        };

        const overlapFillGraphic = new Graphic({
          geometry: eventGeometryIntersection,
          symbol: overlapFillSymbol,
          associatedGraphicId: eventGraphic.graphicId,
          sketchType: 'overlap'
        });

        const restrictedAreaGraphics = (this.sketchLayer.graphics.items).filter(graphic => graphic.sketchType == 'overlap'  && graphic.associatedGraphicId == eventGraphic.graphicId)
        // remove the any previous restricted graphics before adding the new one
        this.sketchLayer.removeMany(restrictedAreaGraphics)
        // add the new restricted graphic
        this.sketchLayer.add(overlapFillGraphic)
      }
      // add full sketch graphic to exposed variable
      const fullSketchGraphics = this.sketchLayer.graphics.items.filter(graphic => graphic.sketchType == 'full-sketch')
      this.setFlightZoneSketches(fullSketchGraphics.sort((a: number,b: number) => a.graphicId - b.graphicId))
    }
  }

  sketchDelete = async (event: __esri.SketchDeleteEvent) => {
    // remove the red restricted flight overlap graphic when the main graphic gets deleted
    const graphicIdsDeleted = event.graphics.map(graphic => graphic.graphicId)
    graphicIdsDeleted.forEach(deletedGraphicId => {
      const graphicsToBeDeleted = (this.sketchLayer.graphics.items).filter(graphic => graphic.sketchType == 'overlap'  && graphic.associatedGraphicId == deletedGraphicId)
      this.sketchLayer.removeMany(graphicsToBeDeleted)
    })
    // add full sketch graphic to exposed variable
    const fullSketchGraphics = this.sketchLayer.graphics.items.filter(graphic => graphic.sketchType == 'full-sketch')
    this.setFlightZoneSketches(fullSketchGraphics.sort((a: number,b: number) => a.graphicId - b.graphicId))
  }
  
  cleanup() {
    // Todo, remove any listeners
    this.sketch.destroy();
    this.setSketchState('idle');
    this.setFlightStatus('unknown')
    this.setFlightZoneSketches([])
  }
}
