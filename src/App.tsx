import React from 'react';
import Map from './components/Map';
import styled from 'styled-components';
import { useStore } from './stores/RootStore';
import { observer } from 'mobx-react-lite';
import { Row, Col } from 'antd';

const Info = styled.p`
  position: absolute;
  z-index: 100;
  top: 15px;
  left: 60px;
  background-color: black;
  color: white;
  padding: 10px;
  height: 300px;
  width: 275px;
  overflow: auto;
  font-size: medium;
`;

const App = () => {
  const { mapStore } = useStore();
  return (
    <>
      {/* HINT: you can bind to properties in the map store like this: */}
      <Info>
        {mapStore.flightZoneSketches.map((graphic, index) => {
          return (
            <Col>
              <Row>{`Flight Zone ID: ${graphic.graphicId}`}</Row>
              <Row>{`Flight Status: ${graphic.flightStatus}`}</Row>
              <Row>{`Restricted Zone Area: ${graphic.intersectionArea.toFixed(2)} ${'\u33A2'}`}</Row>
              <Row>{index == mapStore.flightZoneSketches.length - 1 ? '' : '\n___________________________________'}</Row>
            </Col>
          )
        })}
      </Info>
      <Map />
    </>
  );
};

// Component must be mobx observed to rerender
export default observer(App);
