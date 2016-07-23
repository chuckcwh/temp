import React, { Component } from 'react';
import Container from '../../components/Container';
import { title, html } from './index.md';

class FaqPage extends Component {

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

export default FaqPage;
