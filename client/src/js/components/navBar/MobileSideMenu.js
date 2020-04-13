import React from "react";
import styled from "styled-components";

import { Menu, Sidebar, Divider } from "semantic-ui-react";
import NavUserAvatar from "../sharedComponents/NavUserAvatar";
import HomeSideMenu from "../home/HomeSideMenu";

const AvatarWrapper = styled.div`
  background: #026aa7;
  padding: 10px;
  height: 20%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  position: relative;
  width: 70vw;
  height: 100vh;
`;

const Span = styled.span`
  font-size: 15px;
  text-align: left;
  padding: 10px 0;
`;

const MobileSideMenu = ({ visible, setVisible, auth }) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      onHide={() => setVisible()}
      vertical
      visible={visible}
    >
      <Container>
        <AvatarWrapper>
          <NavUserAvatar auth={auth} />
          <Span>
            {auth.user.fname}
            <br />
            <small> {auth.user.email}</small>
          </Span>
        </AvatarWrapper>
        <HomeSideMenu />
        <Divider />
      </Container>
    </Sidebar>
  );
};

export default MobileSideMenu;