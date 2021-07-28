interface ProjectDueObj {
  project_id: string;
  project_name: string;
  due_date: string;
}

interface ProjectTaskSummary {
  project_id: string;
  project_name: string;
  noOfTasks: number;
  noOfTasksCompleted: number;
  noOfTasksOverDue: number;
  noOfTasksDueIn7Days: number;
}
interface PlannedVsBurnedDetails {
  project_id: string;
  project_name: string;
  totalPlannedEffortInHours: string;
  totalBurnedEffortInHours: string;
  plannedVsBurnedPercent: string;
}
export interface TransformedData {
  plannedVsBurned: PlannedVsBurnedDetails[];
  projectsDueIn30Days: ProjectDueObj[];
  projectsOverDue: ProjectDueObj[];
  taskDetailsProjectWise: ProjectTaskSummary[];
}
// todo: create interfaces for above any values once the data structure is settled --ys

const createDateObjects = (dueDateString: string, additionalDays: number) => {
  const dueDate = new Date(dueDateString);
  // const _currentDate = new Date();
  const currentDate = new Date(new Date().toISOString().slice(0, 10));
  const dateAfterNDays = new Date(
    new Date(currentDate).setDate(currentDate.getDate() + additionalDays)
  );
  return {
    dueDate,
    currentDate,
    dateAfterNDays,
  };
};

const mutateIfProjectDue = (project: any, transformedData: TransformedData) => {
  const {
    dueDate: projectDueDate,
    currentDate,
    dateAfterNDays: dateAfter30Days,
  } = createDateObjects(project.end_date, 30);

  const projectObj: ProjectDueObj = {
    project_id: project._id,
    project_name: project.project_name,
    // note: custom function for formatting due date can be added here
    due_date: new Date(project.end_date).toISOString().slice(0, 10),
  };

  if (projectDueDate < currentDate) {
    transformedData.projectsOverDue.push(projectObj);
    return;
  }
  if (projectDueDate < dateAfter30Days) {
    transformedData.projectsDueIn30Days.push(projectObj);
    return;
  }
};

const mutateBasedOnTaskStatus = (task: any, taskDetailsProjectWise: any) => {
  const {
    currentDate,
    dateAfterNDays: dateAfter7Days,
    dueDate,
  } = createDateObjects(task.end_date, 7);

  taskDetailsProjectWise.noOfTasks += 1;
  if (task.completed) {
    taskDetailsProjectWise.noOfTasksCompleted += 1;
    return;
  }
  if (dueDate < currentDate) {
    taskDetailsProjectWise.noOfTasksOverDue += 1;
    return;
  }
  if (dueDate < dateAfter7Days) {
    taskDetailsProjectWise.noOfTasksDueIn7Days += 1;
    return;
  }
};

export const transformDataForAllProjects = (data: any) => {
  const transformedData: TransformedData = {
    plannedVsBurned: [],
    projectsDueIn30Days: [],
    projectsOverDue: [],
    taskDetailsProjectWise: [],
  };
  console.log('data: ', data);
  (<any>window).data = data;
  console.log('data.projects.entries(): ', data.projects.entries());
  data.projects.forEach((project: any) =>
    console.log('projecttttt: ', project)
  );
  // #useThisInstead
  let i = 0;
  for (const project of data.projects) {
    // for (const [i, project] of data.projects.entries()) {
    /* IMPORTANT NOTE:  tsc screws up this for of loop for some reason = this gets compiled to below line
    
      for (var _i = 0, _a = data.projects.entries(); _i < _a.length; _i++) {
    
      and it does not work!!!!! What is happening..???
      have to use "#useThisInstead" code instead..
        */
    console.log('project: ', project);
    let totalEffort = 0;
    let totalBurned = 0;
    transformedData.taskDetailsProjectWise[i] = {
      project_id: project._id,
      project_name: project.project_name,
      noOfTasks: 0,
      noOfTasksCompleted: 0,
      noOfTasksOverDue: 0,
      noOfTasksDueIn7Days: 0,
    };

    mutateIfProjectDue(project, transformedData);

    const allEntries = [];
    // for ( in project.features) {
    for (const feature of project.features) {
      allEntries.push({
        id: feature.id,
        star_date: feature.star_date,
        end_date: feature.end_date,
      });

      for (const task of feature.tasks) {
        allEntries.push({
          id: task.id,
          star_date: task.star_date,
          end_date: task.end_date,
          parent: feature.id,
        });
        totalEffort += +task.estimated_hour + +task.additional_hour;
        for (const timeEntryObj of task.time) {
          totalBurned += +timeEntryObj.time_hr;
        }
        mutateBasedOnTaskStatus(
          task,
          transformedData.taskDetailsProjectWise[i]
        );
      }
    }
    const plannedVsBurnedPercent = (totalBurned / totalEffort) * 100;
    console.log('plannedVsBurnedPercent: ', plannedVsBurnedPercent);
    transformedData.plannedVsBurned.push({
      project_id: project._id,
      project_name: project.project_name,
      totalPlannedEffortInHours: totalEffort.toString(),
      totalBurnedEffortInHours: totalBurned.toString(),
      plannedVsBurnedPercent: isNaN(plannedVsBurnedPercent)
        ? 'N/A'
        : plannedVsBurnedPercent.toFixed(2) + '%',
      // isNaN happens in case no tasks have been created
    });
    //#useThisInstead
    ++i;
  }
  return transformedData;
};

interface ProjectTransformedData {
  plannedVsBurned: PlannedVsBurnedDetails;
  projectTaskDetails: ProjectTaskSummary;
}

export const transformDataForProject = (project: any) => {
  // Q: is using "as" here the right approach..?
  let transformedData: ProjectTransformedData = {} as ProjectTransformedData;

  let totalEffort = 0;
  let totalBurned = 0;
  transformedData.projectTaskDetails = {
    project_id: project._id,
    project_name: project.project_name,
    noOfTasks: 0,
    noOfTasksCompleted: 0,
    noOfTasksOverDue: 0,
    noOfTasksDueIn7Days: 0,
  };
  //todo: code repeated here.. scope for refactoring..
  for (const feature of project.features) {
    for (const task of feature.tasks) {
      totalEffort += +task.estimated_hour + +task.additional_hour;
      for (const timeEntryObj of task.time) {
        totalBurned += +timeEntryObj.time_hr;
      }
      mutateBasedOnTaskStatus(task, transformedData.projectTaskDetails);
    }
  }

  const plannedVsBurnedPercent = (totalBurned / totalEffort) * 100;
  transformedData.plannedVsBurned = {
    project_id: project._id,
    project_name: project.project_name,
    totalPlannedEffortInHours: totalEffort.toString(),
    totalBurnedEffortInHours: totalBurned.toString(),
    plannedVsBurnedPercent: isNaN(plannedVsBurnedPercent)
      ? 'N/A'
      : plannedVsBurnedPercent.toFixed(2) + '%',
    // isNaN happens in case no tasks have been created
  };

  return transformedData;
};

//>=============================== CODE FOR MONTHLY WORKLOAD STARTS ===============================<
export enum DAYS {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const DaysMap: {
  [index: number]: string;
} = {
  [DAYS.SUNDAY]: 'Sunday',
  [DAYS.MONDAY]: 'Monday',
  [DAYS.TUESDAY]: 'Tuesday',
  [DAYS.WEDNESDAY]: 'Wednesday',
  [DAYS.THURSDAY]: 'Thursday',
  [DAYS.FRIDAY]: 'Friday',
  [DAYS.SATURDAY]: 'Saturday',
};

export const monthsArray = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

export const checkDateInListedDays = (date: Date, listedDays: Date[]) => {
  const isInListedDays = listedDays.some(
    (holiday) =>
      holiday.toLocaleDateString('en-US') === date.toLocaleDateString('en-US')
  );
  return isInListedDays;
};

const checkDateInDateRange = (date: Date, startDate: Date, endDate: Date) =>
  date >= startDate && date <= endDate;

const checkIsHoliday = (date: Date, holidays: Date[]) =>
  date.getDay() === DAYS.SUNDAY ||
  date.getDay() === DAYS.SATURDAY ||
  checkDateInListedDays(date, holidays);

// todo: below function is poorly optimized, update when possible
const splitTasks = (
  task: any,
  monthDatesArray: Date[],
  holidays: Date[] = []
) => {
  const endDate = new Date(task.end_date);
  let date = new Date(task.start_date);
  const taskSplits: { date: Date; hours?: number }[] = [];
  while (date <= endDate) {
    if (checkIsHoliday(date, holidays)) {
      date.setDate(date.getDate() + 1);
      continue;
    }
    taskSplits.push({ date: new Date(date) });
    date.setDate(date.getDate() + 1);
  }
  const totalTaskHours = +task.estimated_hour + +task.additional_hour;
  const taskHoursPerDay = totalTaskHours / taskSplits.length;
  taskSplits.forEach((taskSplit) => (taskSplit.hours = taskHoursPerDay));

  const monthStartDate = monthDatesArray[0];
  const monthEndDate = monthDatesArray[monthDatesArray.length - 1];
  const firstIndex = taskSplits.findIndex((taskSplit) =>
    checkDateInDateRange(taskSplit.date, monthStartDate, monthEndDate)
  );
  const lastIndex =
    taskSplits.length -
    1 -
    taskSplits
      .slice()
      .reverse()
      .findIndex((taskSplit) =>
        checkDateInDateRange(taskSplit.date, monthStartDate, monthEndDate)
      );
  const filteredTaskSplits = taskSplits.slice(firstIndex, lastIndex + 1);
  return filteredTaskSplits;
};

const createMonthDatesArray = (monthIndex: number, year: number) => {
  const firstDateOfMonth = new Date(year, monthIndex, 1);
  const day = firstDateOfMonth;
  const monthDatesArray: any[] = [];
  while (day.getMonth() === monthIndex) {
    monthDatesArray.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return monthDatesArray;
};

let timeLogMap: any = {};
let userTasksMap: any = {};

const monthlyTaskEstimateReducer = (
  finalMonthlySplit: any,
  currentTaskSplit: any
) => {
  const requiredDateSplit = finalMonthlySplit.find(
    (e: any) =>
      e.date.toLocaleDateString('en-US') ===
      currentTaskSplit.date.toLocaleDateString('en-US')
  );
  requiredDateSplit.totalHours += currentTaskSplit.hours;
  requiredDateSplit.burnedHours =
    timeLogMap?.[requiredDateSplit.userId]?.[requiredDateSplit.dateString]
      ?.totalBurned || 0;
  return finalMonthlySplit;
};
export interface WorkloadTransformedData {
  userId: string;
  taskSplits: {
    date: Date;
    dateString: string;
    totalHours: number;
    burnedHours: number;
  }[];
}

const separateTasksForUsers: (
  allUsers: any[],
  monthIndex: number,
  year: number,
  holidays: any[]
) => WorkloadTransformedData[] = (allUsers, monthIndex, year, holidays) => {
  const monthDatesArray = createMonthDatesArray(monthIndex, year);
  const result = allUsers.map((user) => ({
    userId: user.userId,
    userName: user.name,
    // the way data is present in the backend now, userName is the primary field which is used for filtering tasks
    // this is probably not a good practice but doing it here anyway since its will be a breaking change otherwise
    taskSplits: (userTasksMap[user.name] || [])
      .filter((task: any) => {
        const taskStartDate = new Date(task.start_date);
        const taskEndDate = new Date(task.end_date);
        const monthStartDate = monthDatesArray[0];
        const monthEndDate = monthDatesArray[monthDatesArray.length - 1];
        const isTaskInDateRange =
          (taskStartDate >= monthStartDate && taskStartDate <= monthEndDate) ||
          (taskEndDate >= monthStartDate && taskEndDate <= monthEndDate) ||
          (taskStartDate <= monthStartDate && taskEndDate >= monthEndDate);
        return isTaskInDateRange;
      })
      .flatMap((task: any) => splitTasks(task, monthDatesArray, holidays))
      .reduce(
        monthlyTaskEstimateReducer,
        monthDatesArray.map((date) => ({
          date,
          dateString: date.toLocaleDateString('en-US'),
          isHoliday: checkIsHoliday(date, holidays),
          totalHours: 0,
          burnedHours: 0,
          userId: user.userId,
        }))
      ),
  }));
  return result;
};

export const transformToWorkLoadSummary: (
  allUsers: any[],
  projectData: any[],
  monthIndex: number,
  year?: number,
  holidays?: any[]
) => WorkloadTransformedData[] = (
  allUsers,
  projectData,
  monthIndex,
  year?,
  holidays?
) => {
  year = year || new Date().getFullYear();
  // console.log('inside transformFn'); // tbr --ys
  // console.log('monthIndex: ', monthIndex); // tbr --ys
  // console.log('year: ', year); // tbr --ys
  holidays = holidays || [];
  // console.log('allUsers: ', allUsers); // tbr    --ys

  timeLogMap = {}; // maybe use map for this instead..?
  userTasksMap = {};
  projectData.forEach(({ features }: any) =>
    features.forEach(({ tasks }: any) =>
      tasks.forEach((task: any) => {
        task.time.forEach((timeEntry: any) => {
          const userTimeEntryObj = (timeLogMap[timeEntry.user_id] =
            timeLogMap[timeEntry.user_id] || {});
          const dateStringKey = new Date(
            timeEntry.working_date
          ).toLocaleDateString('en-US');
          const dateSpecificTimeEntryObj = (userTimeEntryObj[dateStringKey] =
            userTimeEntryObj[dateStringKey] || {});
          dateSpecificTimeEntryObj.totalBurned =
            dateSpecificTimeEntryObj.totalBurned || 0;
          dateSpecificTimeEntryObj.totalBurned += +timeEntry.time_hr;
        });

        //NOTE: using username here because the data is inserted that way from excel sheets and what not..
        // This is so bad..
        const userTaskMapObj = (userTasksMap[task.task_assigned_to.user_name] =
          userTasksMap[task.task_assigned_to.user_name] || []);
        userTaskMapObj.push({
          task_code: task.task_code,
          task_name: task.task_name,
          estimated_hour: task.estimated_hour,
          additional_hour: task.additional_hour,
          start_date: task.start_date,
          end_date: task.end_date,
          task_assigned_to_id: task.task_assigned_to.user_id,
          task_assigned_to_name: task.task_assigned_to.user_name,
        });
      })
    )
  );
  // console.log('userTasksMap: ', userTasksMap);   tbr --ys
  // console.log('timeLogMap: ', timeLogMap); // tbr --ys
  const userSpecificTasks = separateTasksForUsers(
    allUsers,
    monthIndex,
    year,
    holidays
  );
  // console.log('userSpecificTasks: ', userSpecificTasks); // tbr --ys
  return userSpecificTasks;
};

//>=============================== CODE FOR MONTHLY WORKLOAD ENDS ===============================<
// todo: refactor date.toLocaleDateString('en-US') to be a separate function to reduce code duplication
