import React from 'react';
import styled from '@emotion/styled';

import SelectControl from 'app/components/forms/selectControl';
import space from 'app/styles/space';
import {Organization, Project} from 'app/types';
import {
  IssueAlertRuleAction,
  IssueAlertRuleActionTemplate,
  IssueAlertRuleCondition,
  IssueAlertRuleConditionTemplate,
} from 'app/types/alerts';

import RuleNode from './ruleNode';

type Props = {
  project: Project;
  organization: Organization;
  /**
   * All available actions or conditions
   */
  nodes: IssueAlertRuleActionTemplate[] | IssueAlertRuleConditionTemplate[] | null;
  /**
   * actions/conditions that have been added to the rule
   */
  items: IssueAlertRuleAction[] | IssueAlertRuleCondition[];
  /**
   * Placeholder for select control
   */
  placeholder: string;
  disabled: boolean;
  error: React.ReactNode;
  selectType?: 'grouped';
  onPropertyChange: (ruleIndex: number, prop: string, val: string) => void;
  onAddRow: (value: string) => void;
  onDeleteRow: (ruleIndex: number) => void;
};

class RuleNodeList extends React.Component<Props> {
  getNode = (
    id: string
  ):
    | IssueAlertRuleActionTemplate
    | IssueAlertRuleConditionTemplate
    | null
    | undefined => {
    const {nodes} = this.props;
    return nodes ? nodes.find(node => node.id === id) : null;
  };

  render() {
    const {
      onAddRow,
      onDeleteRow,
      onPropertyChange,
      nodes,
      placeholder,
      items,
      organization,
      project,
      disabled,
      error,
      selectType,
    } = this.props;

    const shouldUsePrompt = project.features?.includes?.('issue-alerts-targeting');
    let enabledNodes = nodes ? nodes.filter(({enabled}) => enabled) : [];

    const createSelectOptions = nodes =>
      nodes.map(node => ({
        value: node.id,
        label: shouldUsePrompt && node.prompt?.length > 0 ? node.prompt : node.label,
      }));

    let options = !selectType ? createSelectOptions(enabledNodes) : [];

    if (selectType === 'grouped') {
      let grouped = enabledNodes.reduce(
        (acc, curr) => {
          if (curr.actionType === 'ticket') {
            acc['ticket'] ? acc['ticket'].push(curr) : (acc['ticket'] = [curr]);
          } else {
            acc['notify'].push(curr);
          }
          return acc;
        },
        {
          notify: [] as IssueAlertRuleActionTemplate[],
        }
      );

      options = Object.entries(grouped).map(([key, values]) => {
        let label = key === 'ticket' ? t('Create new...') : t('Send notifcation to...');
        let options = createSelectOptions(values);
        return {label, options};
      });
    }

    return (
      <React.Fragment>
        <RuleNodes>
          {error}
          {items.map((item, idx) => (
            <RuleNode
              key={idx}
              index={idx}
              node={this.getNode(item.id)}
              onDelete={onDeleteRow}
              data={item}
              onPropertyChange={onPropertyChange}
              organization={organization}
              project={project}
              disabled={disabled}
            />
          ))}
        </RuleNodes>
        <StyledSelectControl
          placeholder={placeholder}
          value={null}
          onChange={obj => onAddRow(obj ? obj.value : obj)}
          options={options}
          disabled={disabled}
        />
      </React.Fragment>
    );
  }
}

export default RuleNodeList;

const StyledSelectControl = styled(SelectControl)`
  width: 100%;
`;

const RuleNodes = styled('div')`
  display: grid;
  margin-bottom: ${space(1)};
  grid-gap: ${space(1)};

  @media (max-width: ${p => p.theme.breakpoints[1]}) {
    grid-auto-flow: row;
  }
`;
