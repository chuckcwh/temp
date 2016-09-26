import React from 'react';
import Loader from 'react-loader';
import s from './SessionAddressDetails.css';

const SessionAddressDetails = ({ address }) => {
  return (
    <div className={s.sessionAddressDetails}>
      <div className={s.sessionAddressDetailsTitle}>
        <h3>Location / Address</h3>
      </div>
      <Loader className="spinner" loaded={!!(address)}>
        {address && address.description &&
          <div className="TableRow">
            <div className="TableRowItem1">Address</div>
            <div className="TableRowItem3">
              {address && address.description}
            </div>
          </div>
        }
        {address && address.unit &&
          <div className="TableRow">
            <div className="TableRowItem1">Unit</div>
            <div className="TableRowItem3">
              {address && address.unit}
            </div>
          </div>
        }
        {address && address.postal &&
          <div className="TableRow">
            <div className="TableRowItem1">Postal Code</div>
            <div className="TableRowItem3">
              {address && address.postal}
            </div>
          </div>
        }
        <div className="TableRow">
          <div className="TableRowItem1">Region</div>
          <div className="TableRowItem3">
            {address && address.region}
          </div>
        </div>
      </Loader>
    </div>
  );
};

SessionAddressDetails.propTypes = {
  address: React.PropTypes.object.isRequired,
};

export default SessionAddressDetails;
