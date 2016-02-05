import React, { Component } from 'react';
import Container from '../components/Container/Container';

const gmapsCode = { __html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7965194576377!2d103.78447491475404!3d1.29674169905421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a4fd6a29643%3A0x1cbb8a56dd8c9ccf!2s71+Ayer+Rajah+Crescent%2C+Singapore+139951!5e0!3m2!1sen!2ssg!4v1454553406755" width="100%" height="600" frameborder="0" style="border:0" allowfullscreen></iframe>' };

export default class extends Component {

  render() {
    return (
      <div>
        <Container>
          <div>
            <h1 className="text-center">Contact eBeeCare</h1>
            <div dangerouslySetInnerHTML={gmapsCode} />
          </div>
        </Container>
      </div>
    );
  }

}
