import React, { forwardRef } from 'react';
// import classes from './Select.module.scss';

// todo: check if there is aliasing available for interfaces like there is for types
interface selectComponentProps {
  defaultValue?: string | number;
  id?: string | string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  options: { value: any; label: string | number }[];
  label?: string | number;
  style?: any;
  value?: string | number;
}

const Select = forwardRef<HTMLSelectElement, selectComponentProps>(
  (props: selectComponentProps, ref) => {
    const { options, label, ...selectProps } = props;

    return (
      <div className={'select-container'}>
        {label && <label>{label}</label>}
        <select ref={ref} {...selectProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default Select;
