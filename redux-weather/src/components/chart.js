import _ from 'lodash';
import React from 'react';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';

const chart = (props) => {
  function average(data) {
    return _.round(_.sum(data)/data.length);
  }

  return (
    <div>
      <Sparklines data={props.data} height={100} width={200}>
        <SparklinesLine color={props.color} />
        <SparklinesReferenceLine type="avg" />
      </ Sparklines>
      <div>{average(props.data)} {props.units}</div>
    </div>
  );
};

export default chart;
