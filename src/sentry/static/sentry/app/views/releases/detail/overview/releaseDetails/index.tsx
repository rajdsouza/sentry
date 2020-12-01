import React from 'react';
import styled from '@emotion/styled';
import {Location} from 'history';

import Feature from 'app/components/acl/feature';
import Count from 'app/components/count';
import DeployBadge from 'app/components/deployBadge';
import TimeSince from 'app/components/timeSince';
import {t} from 'app/locale';
import space from 'app/styles/space';
import {Organization, Release, ReleaseProject} from 'app/types';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import EventView from 'app/utils/discover/eventView';
import {getAggregateAlias} from 'app/utils/discover/fields';
import {getTermHelp} from 'app/views/performance/data';

import {
  getSessionTermDescription,
  SessionTerm,
  sessionTerm,
} from '../../../utils/sessionTerm';

import Item from './item';

type Props = {
  organization: Organization;
  location: Location;
  releaseEventView: EventView;
  project: Required<ReleaseProject>;
} & Pick<Release, 'lastDeploy' | 'dateCreated' | 'newGroups'>;

function ReleaseDetails({
  organization,
  location,
  lastDeploy,
  releaseEventView,
  project,
  newGroups,
  dateCreated,
}: Props) {
  const {hasHealthData} = project;
  const {sessionsCrashed} = project.healthData;

  return (
    <Wrapper>
      <Item label={t('Date Created')}>
        <TimeSince date={lastDeploy?.dateFinished || dateCreated} />
      </Item>
      <ReleaseStats>
        {lastDeploy?.dateFinished && (
          <Item label={t('Last Deploy')}>
            <StyledDeployBadge deploy={lastDeploy} />
          </Item>
        )}
        <Feature features={['release-performance-views']}>
          <Item label={t('Apdex')} help={getTermHelp(organization, 'apdex')}>
            <DiscoverQuery
              eventView={releaseEventView}
              location={location}
              orgSlug={organization.slug}
            >
              {({isLoading, error, tableData}) => {
                if (isLoading || error || !tableData || tableData.data.length === 0) {
                  return '\u2014';
                }
                return (
                  <Count
                    value={
                      tableData.data[0][
                        getAggregateAlias(`apdex(${organization.apdexThreshold})`)
                      ]
                    }
                  />
                );
              }}
            </DiscoverQuery>
          </Item>
        </Feature>
        {hasHealthData && (
          <Item
            label={sessionTerm.crashes}
            help={getSessionTermDescription(SessionTerm.CRASHES, project.platform)}
          >
            <Count value={sessionsCrashed} />
          </Item>
        )}
        <Item label={t('New Issues')}>
          <Count value={newGroups} />
        </Item>
      </ReleaseStats>
    </Wrapper>
  );
}

export default ReleaseDetails;

const Wrapper = styled('div')`
  display: grid;
  grid-gap: ${space(4)};
`;

const ReleaseStats = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: ${space(4)};
`;

const StyledDeployBadge = styled(DeployBadge)`
  margin-left: ${space(1)};
  bottom: ${space(0.25)};
`;
