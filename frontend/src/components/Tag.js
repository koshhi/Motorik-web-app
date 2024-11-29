import React from 'react';
import styled from 'styled-components';

const Tag = ({ children }) => {
  return (
    <TagContainer>
      {children}
    </TagContainer>
  );
};

export default Tag;

const TagContainer = styled.div`
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  background: var(--bg-default-subtle, #FAFAFA);
  color: var(--text-icon-default-main, #292929);
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */
`;