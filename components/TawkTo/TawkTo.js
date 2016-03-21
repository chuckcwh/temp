import React, { Component } from 'react';

const trackingCode = { __html:
  `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();` +
  `(function(){` +
  `var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];` +
  `s1.async=true;` +
  `s1.src='https://embed.tawk.to/56c54a98d11175f079724e76/default';` +
  `s1.charset='UTF-8';` +
  `s1.setAttribute('crossorigin','*');` +
  `s0.parentNode.insertBefore(s1,s0);` +
  `})();`,
};

class TawkTo extends Component {

  render() {
    return <script dangerouslySetInnerHTML={trackingCode} />;
  }

}

export default TawkTo;
