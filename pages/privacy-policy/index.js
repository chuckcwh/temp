import React, { Component } from 'react';
import Container from '../../components/Container';
import { title, html } from './index.md';

class PrivacyPolicyPage extends Component {

  componentDidMount() {
    document.title = `eBeeCare | ${title}`;
  }

  render() {
    return (
      <div>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Container>
      </div>
    );
  }

}

export default PrivacyPolicyPage;
