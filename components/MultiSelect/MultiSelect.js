import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import s from './MultiSelect.css';

const MultiSelect = (props) => {
  const { onBlur, onChange, options, value, ...rest } = props;
  // const val = Array.isArray(value) ? value.map(JSON.stringify) : JSON.stringify(value);
  return (
    <div className={s.multiSelect}>
      <Select
        multi
        options={options}
        onBlur={() => onBlur(value)}
        onChange={event => onChange(event)}
        value={value}
        {...rest}
      />
    </div>
  );
};

MultiSelect.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
  })),
  value: PropTypes.any,
};

export default MultiSelect;
