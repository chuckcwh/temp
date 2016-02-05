import React, { Component, PropTypes } from 'react';
import GoogleAnalytics from '../GoogleAnalytics';
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css" />
        <link rel="stylesheet" href="proxima-nova.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script src={'/app.js?' + new Date().getTime()}></script>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{__html: this.props.body}} />
        <GoogleAnalytics />
      </body>
      </html>
    );
  }

}

export default Html;
