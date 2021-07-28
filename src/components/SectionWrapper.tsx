import React from 'react';
import classes from './SectionWrapper.module.scss';

const SectionWrapper = (props: {
  header: string;
  children: any;
  fullWidth?: boolean;
}) => {
  const { header, children, fullWidth } = props;
  return (
    <section className={'reports-section'}>
      <h2 className={classes['reports-section__header']}>
        {header} something else
      </h2>
      <div
        className={`${classes['reports-section__content']} ${
          fullWidth && classes['full-width']
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
