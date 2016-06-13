import React, { Component, PropTypes } from 'react';
import GoogleAnalytics from '../GoogleAnalytics';
import TawkTo from '../TawkTo';
import Markup from '../Markup';
import { title, description } from '../../config';

class Html extends Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string.isRequired,
    debug: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{this.props.title || title}</title>
        <meta name="description" content={this.props.description || description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.3.15/slick.css" />
        <link rel="stylesheet" href="main.css" />
        <script src={'/app.js?' + new Date().getTime()}></script>
        <script src="//load.sumome.com/" data-sumo-site-id="4a5724c7a698d218000388ccab5de5e14b18825947972413358e296d3202620e" async="async"></script>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{__html: this.props.body}} />
        <GoogleAnalytics />
        <TawkTo />
        <script src="https://maps.googleapis.com/maps/api/js" async defer></script>
        <Markup />
      </body>
      </html>
    );
  }

}

export default Html;
