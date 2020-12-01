import React from 'react';
import styled from '@emotion/styled';

import QuestionTooltip from 'app/components/questionTooltip';
import space from 'app/styles/space';

type Props = {
  label: string;
  children: React.ReactNode;
  help?: React.ReactNode;
};

const Item = ({label, children, help}: Props) => (
  <Wrapper>
    <Label>
      {label}
      {help && <StyledQuestionTooltip title={help} size="xs" position="bottom" />}
    </Label>
    <Value>{children}</Value>
  </Wrapper>
);

const Wrapper = styled('div')``;

const Label = styled('div')`
  font-weight: 600;
  font-size: ${p => p.theme.fontSizeMedium};
  color: ${p => p.theme.gray400};
`;

const StyledQuestionTooltip = styled(QuestionTooltip)`
  margin-left: ${space(0.5)};
`;

const Value = styled('div')`
  font-size: ${p => p.theme.fontSizeLarge};
  color: ${p => p.theme.gray500};
`;

export default Item;
