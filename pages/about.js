import React, { Component } from 'react';
import Container from '../components/Container';

export default class extends Component {

  render() {
    return (
      <div>
        <Container>
          <div>
            <h1 className="text-center">About eBeeCare</h1>
            <h2 className="">The idea behind <strong>eBeeCare</strong></h2>
            <p>“Many years back (almost a decade); the founder’s dad had a stroke when he was still serving in the army. His whole world changed with a role reversal – from being cared for to caring for his dad. To say the truth, he was very lost. His mother, being the primary caregiver, had a very hard time for the first few years as they were not supported by any organisation.</p>
            <p>After a few years, his dad’s condition deteriorated. He was thankful that he had graduated from NUS Nursing when that happened. He was then able to apply what he have learnt to care for his dad instead of hiring home care. Being a low-middle income family, engaging home care would be very expensive.</p>
            <p>Those made him realize that improvements can be made to the current home care system. Everyone eventually becomes a caregiver or plays that part at some point in their lives.”</p>
          </div>
          <hr/>
          <div>
            <h2>How We Are Fixing It</h2>
            <p>Through all that, eBeeCare was born. eBeeCare serves as a trusted online nurse-caregiver co-ordination platform within the community, to provide holistic care seamlessly as a service provider – a world’s first. We understand the constraints in life. We feel what you are going through and know the best solution. Let’s work together to care for your loved ones and YOUR well-being. Caregiving is truly a test of one’s character strength, perseverance and unconditional love but it should never become a burden.</p>
          </div>
          <hr/>
          <div>
            <h2>Our Vision</h2>
            <p>A Family Caregiver for Every Needing Family</p>
          </div>
          <div>
            <h2>Our Mission</h2>
            <p>To enable ageing in place by providing support to caregivers</p>
          </div>
          <div>
            <h2>Our Core Values</h2>
            <p>Flexibility | Quality | Holistic | Continuity of Care</p>
          </div>
        </Container>
      </div>
    );
  }

}
