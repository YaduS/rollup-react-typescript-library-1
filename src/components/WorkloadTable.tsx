import React from 'react';
import { DaysMap, monthsArray } from './reports.helper';
// import classes from './WorkloadTable.module.scss';

// todo: update this interface
interface WorkloadTableProps {
  data: any[];
}

const MAX_HOURS = 8;

// note: can use a library instead if conversion to different formats required in many places
const formatDate = (d: string | number | Date) => {
  const date = new Date(d);
  let newDateString = date.getDate().toString() + ' ';
  newDateString += monthsArray
    .find((e) => e.value === date.getMonth())
    ?.label.slice(0, 3)
    .toUpperCase();
  return newDateString;
};

const WorkloadTable = (props: WorkloadTableProps) => {
  const { data: workLoadData } = props;
  if (!workLoadData.length) {
    return null;
  }
  const daysArray = workLoadData[0].taskSplits.map(
    (taskSplit: { date: Date; dateString: string }) => ({
      dayFirstChar: DaysMap[taskSplit.date.getDay()].slice(0, 1),
      dateString: taskSplit.dateString,
    })
  );
  // console.log('workLoadData: ', workLoadData); // tbr --ys
  // console.log('daysArray: ', daysArray);   // tbr --ys
  return (
    <table className={'workload-table'}>
      <thead>
        <tr>
          <th>Name</th>
          {daysArray.map((dayObj: any) => (
            <th
              data-tooltip={formatDate(dayObj.dateString)}
              key={dayObj.dateString}
            >
              {dayObj.dayFirstChar}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {workLoadData.map((userLoad) => (
          <tr key={userLoad.userId}>
            <td>{userLoad.userName}</td>
            {userLoad.taskSplits.map((taskSplit: any) => {
              let classNames = '';
              if (taskSplit.isHoliday) classNames += 'holiday';
              else if (taskSplit.totalHours > MAX_HOURS)
                classNames += 'overload';
              else classNames += 'safe';

              return (
                <td key={taskSplit.dateString} className={classNames}>
                  <div className={'estimated-effort'}>
                    {parseFloat(taskSplit.totalHours.toFixed(2))}
                  </div>
                  <div className={'actual-effort'}>
                    <i>({parseFloat(taskSplit.burnedHours.toFixed(2))})</i>
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkloadTable;
