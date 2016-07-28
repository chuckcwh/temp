import React from 'react';
import s from './Logo.css';
import Link from '../Link';

const image = require('./logo.png');

const Logo = () => (
  <div className={s.logo}>
    <Link to="/">
      <img src={image} alt="eBeeCare" />
    </Link>
  </div>
);

export default Logo;
