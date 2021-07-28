import React from 'react';
// import classes from './Table.module.scss';

// todo: figure out how to pass generics to function components so that type of "data" can be made dynamic
// i,e something like => interface TableProps<DataType> {

interface TableProps {
  data: any[];
  keyName: string;
  fields: {
    headerLabel: string;
    key: string;
  }[];
  fullWidth?: boolean;
  hideHeader?: boolean;
}

const Table = (props: TableProps) => {
  const {
    fields,
    data,
    keyName: keyLabel,
    fullWidth,
    hideHeader = false,
  } = props;

  return (
    <table className={`${'table'} ${fullWidth && 'full-width'}`}>
      {!hideHeader && (
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field.headerLabel}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data?.map((item) => (
          <tr key={item[keyLabel]}>
            {fields.map((field) => (
              <td /* style={{ minWidth: '400px' }} */ key={field.key}>
                {item[field.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// todo : check the scope attribute => https://www.w3schools.com/tags/att_scope.asp

export default Table;
