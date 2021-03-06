import React from "react";
import styled from "styled-components";

import BoardsSummary from "./BoardsSummary";
import HomeSideMenu from "./HomeSideMenu";
import UIWrapper from "../shared/UIWrapper";

const StyledContainer = styled.div`
  font-family: roboto, sans-serif;
  margin: 0 10px;
  height: 97vh;
  overflow-y: auto;
`;

const HomePage = ({ history }) => {
  return (
    <StyledContainer className="boards-container">
      <UIWrapper className="boards-grid-wrap">
        <UIWrapper className="boards-grid">
          <HomeSideMenu history={history} className="sidebar-wrap" />
          <BoardsSummary />
        </UIWrapper>
      </UIWrapper>
    </StyledContainer>
  );
};

export default HomePage;
