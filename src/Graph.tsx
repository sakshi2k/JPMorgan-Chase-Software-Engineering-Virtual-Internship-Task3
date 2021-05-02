import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';
import { DataManipulator } from './DataManipulator';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      // stock: 'string',
      // top_ask_price: 'float',
      // top_bid_price: 'float',
      price_abc: 'float',
      price_def: 'float',
      ratio : 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', `["ratio","upper_bound","lower_bound","trigger_alert"]`);
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio : 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
        timestamp: 'distinct count'
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(
        [DataManipulator.generateRow(this.props.data)]
      );
    }
  }
}

export default Graph;
