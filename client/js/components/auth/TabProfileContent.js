import React, { useState } from "react";

import { Tab } from "semantic-ui-react";

import PersonalInfo from "./PersonalInfo";
import TabContainer from "../sharedComponents/TabContainer";
import UIContainer from "../sharedComponents/UIContainer";
import ChangePassword from "./ChangePassword";

const TabProfileContent = ({ user, device }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayStyle = {
    marginTop: "-43px",
    height: "80vh",
  };

  const style = [
    `margin-left: ${device.mobile ? "2% !important;" : "41% !important;"}`,
    `margin-right: ${device.mobile ? "2% !important;" : "41% !important;"}`,
    "width: 0%;",
    "border-bottom: 1px solid grey !important;",
  ];

  const panes = [
    {
      menuItem: "Profile and Visibility",
      render: () => (
        <TabContainer mobile={device.mobile}>
          <Tab.Pane className="tab-container">
            <PersonalInfo user={user} device={device} />
          </Tab.Pane>
        </TabContainer>
      ),
    },
    {
      menuItem: "Settings",
      render: () => (
        <TabContainer mobile={device.mobile}>
          <Tab.Pane className="tab-container">
            <ChangePassword />
          </Tab.Pane>
        </TabContainer>
      ),
    },
    {
      menuItem: "Recovery",
      render: () => (
        <TabContainer mobile={device.mobile}>
          <Tab.Pane className="tab-container">Tab 3 Content</Tab.Pane>
        </TabContainer>
      ),
    },
  ];

  return (
    <UIContainer
      nested={{ element: "div div:first-child.tabular", style }}
      display={displayStyle}
      padding="0"
    >
      <Tab
        className="tab-header"
        as="div"
        defaultActiveIndex={activeIndex}
        onTabChange={() => setActiveIndex()}
        panes={panes}
      />
    </UIContainer>
  );
};

export default TabProfileContent;
