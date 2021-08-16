import { createContext, useContext } from 'react';
import MapStore from './MapStore';

// Experimenting with mobx linting:
// https://mobx.js.org/configuration.html#linting-options
import { configure } from 'mobx';
configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

export default class RootStore {
  mapStore: MapStore;

  constructor() {
    this.mapStore = new MapStore(this);
  }
}

// Create a new store context
const store = new RootStore();
const storeContext = createContext(store);

// Hook to use store in any functional component
export const useStore = () => useContext(storeContext);
