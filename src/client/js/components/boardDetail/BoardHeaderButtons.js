import React, { Fragment, useState } from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";

import { Dropdown, Button, Icon, List } from "semantic-ui-react";

import { ACCESS_LEVELS } from "../../constants/constants";
import { useBoardContext } from "../../utils/hookUtils";
import NavButton from "../sharedComponents/NavButton";
import UIContainer from "../sharedComponents/UIContainer";
import UIFormInput from "../sharedComponents/UIFormInput";
import UIMessage from "../sharedComponents/UIMessage";
import UIWrapper from "../sharedComponents/UIWrapper";

const StyledDiv = styled.div`
  justify-self: ${(props) => (props.mobile ? "center" : "end")};
  display: flex;
  flex-direction: ${(props) => props.mobile && "row"};
  align-items: ${(props) => props.mobile && "flex-start"};
`;

const StyledButton = styled(Button)`
  background-color: #ffffff3d !important;
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  min-width: 180px !important;
`;

const StyledDescription = styled(List.Description)`
  font-size: 9px;
  color: #000;
`;

export default function BoardHeaderButtons({ mobile, isStarred }) {
  const {
    board,
    changeBoardAccessLevel,
    handleBoardStarClick,
    handleInviteClick,
    handleShowMenuClick,
    inviteDone,
  } = useBoardContext();
  const { accessLevel } = board;
  let permission;

  const [inviteEmail, setInviteEmail] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => setInviteEmail(e.target.value);

  const validateEmail = () => {
    const validEmail = isEmail(inviteEmail);

    if (!validEmail) return setError("Email provided is invalid");
    handleInviteClick(inviteEmail);
  };

  Object.keys(accessLevel).forEach((key, index) => {
    const active = ACCESS_LEVELS[index].option.toLowerCase();
    if (accessLevel[active]) return (permission = ACCESS_LEVELS[index]);
  });

  return (
    <StyledDiv mobile={mobile}>
      <StyledButton className="board-header-button" size="tiny">
        {!mobile && <Icon name={permission.icon} />}
        <Dropdown icon={false} text={permission.option}>
          <StyledDropdownMenu>
            {ACCESS_LEVELS.map((key) => (
              <Fragment key={key.option}>
                <Dropdown.Item
                  icon={
                    <Icon
                      name={key.icon}
                      size={
                        accessLevel[key.option.toLowerCase()]
                          ? "large"
                          : "small"
                      }
                      color={
                        accessLevel[key.option.toLowerCase()] ? "red" : "black"
                      }
                    />
                  }
                  text={key.option}
                  onClick={() =>
                    changeBoardAccessLevel(key.option.toLowerCase())
                  }
                />

                <UIContainer>
                  <StyledDescription>{key.description}</StyledDescription>
                </UIContainer>
              </Fragment>
            ))}
          </StyledDropdownMenu>
        </Dropdown>
      </StyledButton>
      <NavButton
        iconName="star outline"
        buttonColor={isStarred ? "yellow" : "grey"}
        redirect={() => handleBoardStarClick()}
        forceText={true}
      />
      <StyledButton size="tiny">
        <Dropdown
          text="Invite"
          icon={false}
          closeOnChange={false}
          direction="left"
          className="board-header-button"
        >
          <StyledDropdownMenu>
            {error ? (
              <Dropdown.Header>
                <UIMessage
                  message={error}
                  error={true}
                  handleDismiss={() => setError(null)}
                />
              </Dropdown.Header>
            ) : (
              <Dropdown.Header content="Add an invite email" />
            )}

            <Dropdown.Divider />

            <UIWrapper className="user-invite-wrap">
              <UIFormInput
                id="invite-input"
                onChange={(e) => handleChange(e)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => (e.key === "Enter" ? validateEmail() : null)}
                placeholder={
                  inviteDone
                    ? "Invite Sent"
                    : "Add invite email and press Enter"
                }
                icon={inviteDone && <Icon name="check" color="green" />}
              />
            </UIWrapper>
          </StyledDropdownMenu>
        </Dropdown>
      </StyledButton>
      {!mobile && (
        <NavButton
          className="board-header-button"
          iconName={!mobile ? "ellipsis horizontal" : false}
          size="tiny"
          buttonText="Show Menu"
          redirect={() => handleShowMenuClick()}
          forceText={true}
          float="right"
        />
      )}
    </StyledDiv>
  );
}
