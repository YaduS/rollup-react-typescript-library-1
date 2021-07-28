import React from 'react';
import { useLocation } from 'react-router-dom';
import sampleData from '../dummy-data/sampleDataSingleProject';
import { transformDataForProject } from './reports.helper';
import SectionWrapper from './SectionWrapper';
import Table from './Table';

const ProjectSummary = () => {
  const location = useLocation();
  const { pathname } = location;
  const projectId = pathname
    .slice(pathname.indexOf('/projects/') + 10)
    .replace('/', '');

  // todo: fetch data by triggering gql query with that projectId
  // Note: there is really no need to use State here as the state is static and does no change..? --ys
  // Mean we dont have to use useEffect..?  --ys
  const transformedData = transformDataForProject(sampleData.data.projects[0]);
  const fullWidth = true;

  return (
    <>
      <h1>Project ID: {projectId}</h1>
      <SectionWrapper header="Burned effort" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Burned Effort %', key: 'plannedVsBurnedPercent' },
          ]}
          data={[transformedData.plannedVsBurned]}
          keyName="project_id"
          {...{ fullWidth }}
          hideHeader={true}
        />
      </SectionWrapper>
      <SectionWrapper header="Tasks Summary" {...{ fullWidth }}>
        <Table
          fields={[
            { headerLabel: 'Total Tasks', key: 'noOfTasks' },
            { headerLabel: 'Completed Tasks', key: 'noOfTasksCompleted' },
            { headerLabel: 'Overdue Tasks', key: 'noOfTasksOverDue' },
            {
              headerLabel: 'Task Overdue in 7 Days',
              key: 'noOfTasksDueIn7Days',
            },
          ]}
          data={[transformedData.projectTaskDetails]}
          keyName="project_id"
          {...{ fullWidth }}
        />
      </SectionWrapper>
    </>
  );
};

export default ProjectSummary;
