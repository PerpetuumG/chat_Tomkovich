import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Main.module.css';

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
};

function Main(props) {
  const { NAME, ROOM } = FIELDS;

  const [values, setValues] = useState({ [NAME]: '', [ROOM]: '' });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const handleClick = e => {
    const isDisabled = Object.values(values).some(value => !value);

    if (isDisabled) e.preventDefault();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name={'name'}
              value={values[NAME]}
              placeholder={'Your name'}
              className={styles.input}
              onChange={handleChange}
              autoComplete={'off'}
              required
            />
          </div>

          <div className={styles.group}>
            <input
              type="text"
              name={'room'}
              value={values[ROOM]}
              placeholder={'Room'}
              className={styles.input}
              onChange={handleChange}
              autoComplete={'off'}
              required
            />
          </div>

          <Link
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
            onClick={handleClick}
            className={styles.group}
          >
            <button type={'submit'} className={styles.button}>
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Main;
