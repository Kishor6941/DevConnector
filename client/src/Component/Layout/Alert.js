import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// Get the alert state from store // mapping the redux state to props to component
const mapStateToProps = (state) => ({
  alerts: state.alert, // get the state from rootreducer
});
export default connect(mapStateToProps)(Alert);
