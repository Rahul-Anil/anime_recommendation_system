import React from "react";
import { injectReducer } from "./store";

const withReducer = (key, reducer) => (WrappedComponent) =>
  // eslint-disable-next-line react/display-name
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      injectReducer(key, reducer);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default withReducer;
