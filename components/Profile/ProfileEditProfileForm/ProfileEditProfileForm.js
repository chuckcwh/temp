import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditProfileForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { USER_EDIT_SUCCESS, S3_UPLOAD_URL_SUCCESS, getS3UploadUrl, editUser } from '../../../actions';


const s3Url = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileEditProfileForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      avatar: this.props.avatar,
      newAvatar: null,
      newAvatarSelected: null,
    }
  }

  handleFile = (e) => {

    const reader = new FileReader();
    const file = e.target.files[0];

    let error;
    const allowedFileTypes = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
    const fileExtension = file.type.split('/').pop().toLowerCase();

    if (!window.FileReader) {
      error = 'The file API is not supported on this browser.';
    } else if (!e.target.files) {
      error = 'Wrong files property.';
    } else if (!file) {
      error = 'Please select a file.';
    } else if (file.size > 4194304) {
      error = 'File size is too big.';
    } else if (!(allowedFileTypes.indexOf(fileExtension) >= 0)) {
      error = 'File type is not supported';
    } else {
      error = null;
      reader.onload = (upload) => {
        this.setState({
          newAvatar: upload.target.result,
          newAvatarName: file.name,
          fileType: file.type,
        })
      }
      reader.readAsDataURL(file);
    }

    return this.setState({ fileErr: error })
  }

  _crop = () => {
    this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      this.setState({
        newAvatarSelected: blob,
      });
    }, this.state.fileType);
  };

  onHandleUpload = (e) => {
    e.preventDefault();
    this.setState({ processing: 'uploading...' });

    this.props.getS3UploadUrl({
      fileName: this.state.newAvatarName,
      fileType: this.state.newAvatarSelected.type,
    }).then((res) => {

      if (res && res.type === S3_UPLOAD_URL_SUCCESS) {
        const {signedRequest, url} = res.response;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);

        xhr.onload = () => {
          if (xhr.status === 200) {
            this.props.editUser({
              userId: this.props.userId,
              avatar: url,
            }).then(res => {
              if (res && res.type === USER_EDIT_SUCCESS) {
                this.setState({ processing: null });
              }
            })
          } else {
            this.setState({ processing: 'Server request error' })
          }
        }
        xhr.send(this.state.newAvatarSelected);
      } else {
        this.setState({ processing: 'Server request error' })
      }

    })
  };

  render() {
    const { avatar, newAvatar, newAvatarSelected, uploadCheck, fileErr, processing } = this.state;

    return (
      <div className={s.ProfileEditProfileForm}>

        {newAvatar ? (
          <div className={s.formCropperContainer}>
            <Cropper
              ref='cropper'
              src={newAvatar}
              style={{height: '100%', width: '100%'}}
              aspectRatio={1/1}
              guides={false}
              crop={this._crop}
            />
          </div>
        ): (
          <img src={avatar} className={s.profilePhotoDemo} />
        )}

        <p className={s.formUpload}>
          <span className={s.formUploadNote}>Note!</span> Max File Size: 4MB
        </p>

        <label for="file-upload" className={cx("btn", "btn-primary", s.inputLabel)}>
          <input type="file" className={s.inputfile} onChange={this.handleFile} />
          Choose a file
        </label>

        <span className={s.formError}>{fileErr}</span>

        <div className={s.formSubmit}>
          {newAvatar ? (
            <button className="btn btn-primary" onClick={this.onHandleUpload}>Save Changes</button>
          ): (
            <button className={"btn btn-primary"} onClick={this.onHandleUpload} disabled>Save Changes</button>
          )}
        </div>

        <span className={s.formError}>{processing}</span>

      </div>
    );
  }

}

ProfileEditProfileForm.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    userId: user && user._id,
    avatar: user && (user.avatar ? user.avatar : require('../../../assets/images/noimage.gif')),
  }
}

const mapDispatchToProps = (dispatch) => ({
  getS3UploadUrl: (params) => dispatch(getS3UploadUrl(params)),
  editUser: (params) => dispatch(editUser(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditProfileForm);
