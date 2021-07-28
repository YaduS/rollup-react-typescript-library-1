import React from 'react';
import sampleData from '../dummy-data/sampleDataSliced';
import { transformDataForAllProjects } from './reports.helper';
import SectionWrapper from './SectionWrapper';
import Table from './Table';
export default function AllProjectsSummary() {
  // trigger gql query which will fetch data fro all projects
  console.log('sampleData: ', sampleData);
  const transformedData = transformDataForAllProjects(sampleData.data);
  console.log('transformedData: ', transformedData);
  const {
    plannedVsBurned,
    projectsDueIn30Days,
    projectsOverDue,
    taskDetailsProjectWise,
  } = transformedData;

  // change this variable to switch from full width to auto width for tables
  const fullWidth = true;

  return (
    <>
      <SectionWrapper header="Project wise effort" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Project Name', key: 'project_name' },
            { headerLabel: 'Burned Effort', key: 'plannedVsBurnedPercent' },
          ]}
          data={plannedVsBurned}
          keyName="project_id"
          {...{ fullWidth }}
        />
      </SectionWrapper>
      <SectionWrapper header="Project due in next 30 Days" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Project Name', key: 'project_name' },
            { headerLabel: 'Due Date', key: 'due_date' },
          ]}
          data={projectsDueIn30Days}
          keyName="project_id"
          {...{ fullWidth }}
        />
      </SectionWrapper>
      <SectionWrapper header="Projects overdue" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Project Name', key: 'project_name' },
            { headerLabel: 'Due Date', key: 'due_date' },
          ]}
          data={projectsOverDue}
          keyName="project_id"
          {...{ fullWidth }}
        />
      </SectionWrapper>
      <SectionWrapper header="Project wise task summary" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Project Name', key: 'project_name' },
            { headerLabel: 'Total Tasks', key: 'noOfTasks' },
            { headerLabel: 'Completed Tasks', key: 'noOfTasksCompleted' },
            { headerLabel: 'Overdue Tasks', key: 'noOfTasksOverDue' },
            {
              headerLabel: 'Task Overdue in 7 Days',
              key: 'noOfTasksDueIn7Days',
            },
          ]}
          data={taskDetailsProjectWise}
          keyName="project_id"
          {...{ fullWidth }}
        />
      </SectionWrapper>
      {/* <pre>{JSON.stringify(transformedData, null, 2)}</pre> */}
    </>
  );
}
