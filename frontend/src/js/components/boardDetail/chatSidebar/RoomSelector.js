import React, { Fragment } from "react";
import styled from "styled-components";

import { Dropdown } from "semantic-ui-react";
import { getFormattedDate } from "../../../utils/appUtils";
import UIDivider from "../../shared/UIDivider";

const StyledDiv = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const defaultRoom = [
  {
    key: "Public",
    text: "Public",
    value: "public",
    icon: "home",
  },
  {
    key: "Current board",
    text: "Current board",
    value: "current-board",
    icon: "circle",
  },
];

const RoomSelector = ({
  rooms = defaultRoom,
  handleSelectRoom,
  onlineCount,
}) => (
  <StyledDiv>
    <UIDivider
      horizontal={true}
      inverted={true}
      content={
        <Fragment>
          {onlineCount === 0 ? (
            <span className="chat-room-counter">
              {getFormattedDate(Date.now(), "LLL")}
            </span>
          ) : (
            <span className="chat-room-counter"> Online {onlineCount}</span>
          )}
        </Fragment>
      }
    />
    <Dropdown
      placeholder="Select Room"
      fluid
      selection
      options={rooms}
      onChange={(e, { value }) => handleSelectRoom(e, value)}
    />
  </StyledDiv>
);

export default RoomSelector;
