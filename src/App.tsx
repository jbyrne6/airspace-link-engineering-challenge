import React from 'react';
import Map from './components/Map';
import { useStore } from './stores/RootStore';
import { observer } from 'mobx-react-lite';

const App = () => {
  return <Map />;
};

// Component must be mobx observed to rerender
export default observer(App);
