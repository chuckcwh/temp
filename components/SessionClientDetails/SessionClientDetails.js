import React from 'react';
import Loader from 'react-loader';
import s from './SessionClientDetails.css';

const SessionClientDetails = ({ client }) => {
  return (
    <div className={s.sessionClientDetails}>
      <Loader className="spinner" loaded={!!(client)}>
        <div className="TableRow">
          <div className="TableRowItem1">Name</div>
          <div className="TableRowItem3">{client && client.name}</div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Email</div>
          <div className="TableRowItem3">{client && client.email}</div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Contact</div>
          <div className="TableRowItem3">{client && client.contact}</div>
        </div>
      </Loader>
    </div>
  );
};

SessionClientDetails.propTypes = {
  client: React.PropTypes.object.isRequired,
};

export default SessionClientDetails;
