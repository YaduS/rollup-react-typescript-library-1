import React, { useEffect, useState } from 'react';
import sampleData from '../dummy-data/sampleDataSliced';
import sampleUsers from '../dummy-data/sampleUsers';
import {
  monthsArray,
  transformToWorkLoadSummary,
  WorkloadTransformedData,
} from './reports.helper';
import Select from './Select';
import classes from './WorkloadSummary.module.scss';
import WorkloadTable from './WorkloadTable';

const defaultYear = new Date().getFullYear();
const defaultMonth = new Date().getMonth();
// creating last 5 years in a list
const yearsArray = new Array(5)
  .fill(0)
  .map((_, i) => ({ value: defaultYear - i, label: defaultYear - i }));

type SelectChangeHandlerType = React.ChangeEventHandler<HTMLSelectElement>;

const ALL_PROJECTS_ID = 'ALL_PROJECTS';
const WorkloadSummary = () => {
  const [workloadData, setWorkloadData] = useState<WorkloadTransformedData[]>(
    []
  );
  // todo: change "any" when there is time
  const [projectsList, setProjectsList] = useState<any>([]);
  const [usersData, setUsersData] = useState<any[]>([]); // todo: fetch these from APIs  --ys
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS_ID);
  const [holidays, setHolidays] = useState<any[]>([]);

  useEffect(() => {
    //todo: check if
    // todo: call APIs and set data here;
    setUsersData(sampleUsers.data);
    setProjectsData(sampleData.data.projects);
    setHolidays([]);
  }, []);

  useEffect(() => {
    const projectList: any[] = projectsData.map((project: any) => ({
      label: project.project_name,
      value: project._id,
      lead: project.project_lead,
    }));
    projectList.unshift({ label: 'All Projects', value: ALL_PROJECTS_ID });
    setProjectsList(projectList);
  }, [projectsData]);

  useEffect(() => {
    //todo: don't execute when usersData or projectData is missing.. so check that here
    let selectedProjectData: any[] = projectsData;
    if (selectedProject !== ALL_PROJECTS_ID) {
      selectedProjectData = [
        projectsData.find((project) => project._id === selectedProject),
      ];
    }
    // console.log('selectedProjectData: ', selectedProjectData); // tbr --ys
    console.time('transform-time');
    const transformedWorkLoadData = transformToWorkLoadSummary(
      usersData,
      selectedProjectData,
      selectedMonth,
      selectedYear,
      holidays // can pass holidays here
    );
    console.timeEnd('transform-time');
    setWorkloadData(transformedWorkLoadData);
  }, [
    projectsData,
    usersData,
    holidays,
    selectedMonth,
    selectedProject,
    selectedYear,
  ]);

  const handleMonthChange: SelectChangeHandlerType = (event) =>
    setSelectedMonth(+event.target.value);
  const handleYearChange: SelectChangeHandlerType = (event) =>
    setSelectedYear(+event.target.value);
  const handleProjectChange: SelectChangeHandlerType = (event) =>
    setSelectedProject(event.target.value);

  return (
    <section>
      <h2>Workload Summary</h2>
      <form className={classes['form']}>
        <Select
          options={monthsArray}
          defaultValue={defaultMonth}
          id="workloadMonth"
          onChange={handleMonthChange}
          label="Month"
          style={{ width: '200px' }}
        ></Select>
        <Select
          options={yearsArray}
          defaultValue={defaultYear}
          id="workloadYear"
          onChange={handleYearChange}
          label="Year"
        ></Select>
        <Select
          options={projectsList}
          defaultValue={ALL_PROJECTS_ID}
          id="project"
          onChange={handleProjectChange}
          label="Project"
          style={{ 'min-width': '400px' }}
        ></Select>
      </form>
      <div className={classes['table-container']}>
        <WorkloadTable data={workloadData} />
      </div>
    </section>
  );
};

export default WorkloadSummary;
