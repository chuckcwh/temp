import React, { Component, PropTypes } from 'react';
import GoogleAnalytics from '../GoogleAnalytics';
import TawkTo from '../TawkTo';
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
        <script src={'/app.js?' + new Date().getTime()}></script>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{__html: this.props.body}} />
        <GoogleAnalytics />
        <TawkTo />
        <script src="https://maps.googleapis.com/maps/api/js"></script>
        <script type="application/ld+json">
        {
          "@context" : "http://schema.org",
          "@type" : "Organization",
          "name" : "eBeeCare",
          "legalName" : "eBeeCare Pte. Ltd.",
          "duns" : "659244417",
          "url" : "https://www.ebeecare.com",
          "address": "71 Ayer Rajah Crescent, #04-11, Singapore 139951",
          "contactPoint" : [{
            "@type" : "ContactPoint",
            "telephone" : "+65-65149729",
            "email" : "contact@ebeecare.com",
            "contactType" : "customer service"
          }]
        }
        </script>
      </body>
      </html>
    );
  }

}

export default Html;
