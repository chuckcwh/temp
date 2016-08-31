import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './Profile.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import { isProvider, getUserName } from '../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
// sub components
import ProfileBase from './ProfileBase/ProfileBase';
import ProfileEdit from './ProfileEdit/ProfileEdit';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaBook from 'react-icons/lib/fa/book';
import FaBriefcase from 'react-icons/lib/fa/briefcase';
import FaTrophy from 'react-icons/lib/fa/trophy';


class Profile extends Component {

  render() {
    const { edit } = this.props.params;
    const {
      user,
      name,
      provider: {
        skills,
        educations,
        experiences,
        achievements,
      },
    } = this.props;
    console.log('experiences', skills);
    return (
      <div className={s.profile}>
        <Header title={`${name}'s Profile`} />
        <Container>

          {user && edit && (<ProfileEdit />)}

          {user && !edit && (
            <div>

              <ProfileBase />

              {isProvider(user) && (
                <Grid fluid className={s.providerSection}>

                  <Row>
                    <Col xs={12} sm={12} className={s.skillContainer}>
                      <hr className={s.providerSegment} />
                      <h3 className={s.title}><FaPlus /> Provider Skills</h3>
                      <p>
                        {!skills.length && (
                          <span className={s.noSkill}>
                            Not Entered. <a href="/profile/edit">Add a skill.</a>
                          </span>
                        )}
                        {skills && skills.map(item => (
                          <span className={s.eachSkill}>{item}</span>
                        ))}
                      </p>
                    </Col>

                    <Col xs={12} sm={3} className={s.educationContainer}>
                      <h3 className={s.title}><FaBook /> Education History</h3>
                      {!educations && (
                        <div>
                          Not Entered. <a href="/profile/edit" className={s.link}>Add an education record.</a>
                        </div>
                      )}
                      {educations && educations.map(item => (
                        <div key={item._id} className={s.educationBody}>
                          <div className={s.flag}>
                            <div className={s.flagCert}>{item.typeOfCert}</div>
                            <div className={s.flagDate}>{moment(item.gradDate).format('MMM YYYY')}</div>
                          </div>
                          <p className={s.bodyCourse}>{item.course}</p>
                          <p className={s.bodyInstitute}>{item.institute}{item.institute && item.country && ', '}{item.country}</p>
                        </div>
                      ))}
                    </Col>

                    <Col xs={12} sm={5} className={s.experienceContainer}>
                      <h3 className={s.title}><FaBriefcase /> Work Experience</h3>
                      {!experiences && (
                        <div>
                          Not Entered. <a href="/profile/edit">Add a work experience.</a>
                        </div>
                      )}
                      <div className={s.experienceBody}>
                        {experiences && experiences.map(item => (
                          <div key={item._id} className={s.experienceEach}>
                            <div className={s.timeFlag}>{moment(item.startDate).format(`MMM 'YY`)}{`- ${moment(item.endDate).format("MMM 'YY")}`}</div>
                            <div className={s.timeDot}></div>

                            <div className={s.experienceContent}>
                              <p>{item.employer} ({item.country})</p>
                              <div className={s.experiencePos}>
                                <p>{item.position}</p>
                                <p>{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Col>

                    <Col xs={12} sm={4} className={s.achievementContainer}>
                      <h3><FaTrophy /> Achievements</h3>
                      {!achievements && (
                        <div>
                          Not Entered. <a href="/profile/edit">Add an achievement.</a>
                        </div>
                      )}
                      {achievements && achievements.map(item => (
                        <div key={item._id} className={s.achievementBody}>
                          <div className={s.flag}>
                            <div className={s.flagCert}>{item.title}</div>
                            <div className={s.flagDate}>{moment(item.dateObtained).format('MMM YYYY')}</div>
                          </div>
                          <p className={s.bodyOrg}>{item.organization}</p>
                          <p className={s.bodyDes}>{item.description}</p>
                        </div>
                      ))}
                    </Col>
                  </Row>
                </Grid>
              )}

            </div>
          )}
        </Container>
      </div>
    )
  }

}

Profile.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    name: user && user.name,
    provider: {
      skills: user && user.skills,
      educations: user && user.educations,
      experiences: user && user.experiences,
      achievements: user && user.achievements,
    },
    user,
}};

export default connect(mapStateToProps)(Profile);
