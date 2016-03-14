import React, { Component } from 'react';
import Container from '../components/Container/Container';

export default class extends Component {

  render() {
    return (
      <div>
        <Container>
          <div>
            <h1 className="text-center">FAQ</h1>
            <ol>
              <li>
                <b>Can registered and enrolled nurses take up part time nursing assignments in Singapore?</b>
                <br/>
                <p><i>Yes, there are no restrictions for part time work for RNs and ENs in Singapore.</i></p>    
              </li>
              <li>
                <b>Are nurses allowed to provide nursing services on their own directly?</b>
                <br/>
                <p><i>Section 52 of the Nurses and Midwives Regulations states that:</i></p>
                <p><i>(1) No registered nurse or enrolled nurse may practise nursing on his own account or in partnership with another except with the prior written consent of the Board.</i></p>
                <p><i>(2) No registered midwife may practise midwifery on his own account or in partnership with another except with the prior written consent of the Board.</i></p>
              </li>
              <li>
                <b>Is eBeeCare a registered private nurses' agency?</b>
                <br/>
                <p><i>eBeeCare is a registered Home Healthcare service provider in Singapore. We are able to provide home/private nursing services as well as therapy and allied health services for families in their home premises.</i></p>
              </li>
              <li>
                <b>Do other nursing agencies use part-time nurses too?</b>
                <br/>
                <p><i>Yes, almost all government and private agencies and nursing service providers use part-time nurses.</i></p>
              </li>
              <li>
                <b>Are eBeeCare nurses qualified to provide home nursing?</b>
                <br/>
                <p><i>Yes, all our nurses are registered nurses or enrolled nurses with Singapore Nursing Board. They have at least 2 years of experience. We do not accept foreign nurses at the moment.</i></p>
              </li>
              <li>
                <b>Are eBeeCare caregivers trained and qualified to provide home social care?</b>
                <br/>
                <p><i>Yes, our caregivers have certificates issued by WDA/AIC and have undergone at least 40 hours of training.</i></p>
              </li>
            </ol>
          </div>
        </Container>
      </div>
    );
  }

}
