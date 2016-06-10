import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import './MultiSelect.scss';

class MultiSelect extends Component {

  render() {
    const { onBlur, onChange, options, value, ...rest } = this.props
    const parse = event => {
      // console.log(event);
      return event;
    }
    const val = Array.isArray(value) ? value.map(JSON.stringify) : JSON.stringify(value)
    return (
      <div className="MultiSelect">
        <Select 
          multi={true}
          options={options}
          onBlur={event => onBlur(parse(value))}
          onChange={event => onChange(parse(event))}
          value={value}
          {...rest}
        />
      </div>
    )
  }
}

MultiSelect.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  })),
  value: PropTypes.any // array or individual value
};

export default MultiSelect;
