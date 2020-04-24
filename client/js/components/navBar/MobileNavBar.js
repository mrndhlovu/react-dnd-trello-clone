import React from "react";
import styled from "styled-components";

import { Button, Icon } from "semantic-ui-react";
import UIWrapper from "../sharedComponents/UIWrapper";
import Logo from "./Logo";

const StyledButton = styled(Button)`
  background: transparent !important;
  padding: 3px 10px !important;
`;
const display = {
  width: "100%",
  justifyContent: "space-between",
  display: "flex",
};

const MobileNavBar = ({
  setVisible,
  isHomePage,
  history,
  setShowMobileMenu,
  mobile,
}) => {
  return (
    <UIWrapper display={display} padding="2px 0">
      <StyledButton
        onClick={() => (isHomePage ? setVisible() : history.push("/"))}
        icon={<Icon name={isHomePage ? "bars" : "arrow left"} size="large" />}
      />

      {!isHomePage ? (
        <StyledButton
          floated="right"
          size="tiny"
          icon={<Icon name="ellipsis vertical" size="large" />}
          onClick={() => setShowMobileMenu()}
        />
      ) : (
        <Logo mobile={mobile} history={history} />
      )}
    </UIWrapper>
  );
};

export default MobileNavBar;