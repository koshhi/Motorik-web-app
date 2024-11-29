import React from 'react';
import styled from 'styled-components';

const Banner = ({ children }) => {
  return (
    <BannerContainer>
      {/* <BannerContent>{children}</BannerContent> */}
      {children}
    </BannerContainer>
  );
};

export default Banner;

const BannerContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 8px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  background: var(--bg-default-subtle, #FAFAFA);
`;