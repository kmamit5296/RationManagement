import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const SearchElement = React.memo((props) => {
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(null);

  const inputChange = useCallback(val => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      props.valueChange(val);
    }, 500);
    setTimer(newTimer);
    setValue(val);
  }, [value, timer]);

  return (
    <Form.Control
      id="ration-search"
      size="sm"
      type={props.type}
      placeholder="search"
      value={value}
      onChange={e => inputChange(e.target.value)}
    />
  );
});

SearchElement.propTypes = {
  valueChange: PropTypes.func,
  type: PropTypes.string
};

SearchElement.defaultProps = {
  type: 'text'
}

export default SearchElement;
