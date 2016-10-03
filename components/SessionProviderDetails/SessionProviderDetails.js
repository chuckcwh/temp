import React from 'react';
import Loader from 'react-loader';
import s from './SessionProviderDetails.css';

const imgPencil = require('../pencil.png');

const SessionProviderDetails = ({ provider }) => {
  return (
    <div className={s.sessionProviderDetails}>
      <div className={s.sessionProviderDetailsTitle}>
        <h3>Service Provider Details</h3>
      </div>
      <Loader className="spinner" loaded={!!(provider)}>
        <div className="TableRow">
        <div className="TableRowItem1">Name</div>
          <div className="TableRowItem3">
            {provider && provider.name}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Email</div>
          <div className="TableRowItem3">
            {provider && provider.email}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Contact Number</div>
          <div className="TableRowItem3">
            {provider && provider.contact}
          </div>
        </div>
      </Loader>
    </div>
  );
};

SessionProviderDetails.propTypes = {
  provider: React.PropTypes.object,
};

export default SessionProviderDetails;
