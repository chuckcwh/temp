import React, { Component } from 'react';

const markupCode = { __html:
  `{` +
  `  "@context" : "http://schema.org",` +
  `  "@type" : "Organization",` +
  `  "name" : "eBeeCare",` +
  `  "legalName" : "eBeeCare Pte. Ltd.",` +
  `  "duns" : "659244417",` +
  `  "url" : "https://www.ebeecare.com",` +
  `  "address": "71 Ayer Rajah Crescent, #04-11, Singapore 139951",` +
  `  "contactPoint" : [{` +
  `    "@type" : "ContactPoint",` +
  `    "telephone" : "+65-65149729",` +
  `    "email" : "contact@ebeecare.com",` +
  `    "contactType" : "customer service"` +
  `  }]` +
  `}`,
};

class Markup extends Component {

  render() {
    return <script type="application/ld+json" dangerouslySetInnerHTML={markupCode} />;
  }

}

export default Markup;
