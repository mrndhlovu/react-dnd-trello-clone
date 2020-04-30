import React, { useState, useEffect, useContext } from "react";

import UIContainer from "../sharedComponents/UIContainer";
import { MainContext } from "../../utils/contextUtils";
import TabPaneHeader from "./TabPaneHeader";
import TabProfileContent from "./TabProfileContent";

const displayStyle = {
  height: "97vh",
  display: "flex",
  flexDirection: "column",
};

const UserProfile = ({ auth }) => {
  const [user, setUser] = useState(null);
  const { getNavData } = useContext(MainContext);

  useEffect(() => {
    setUser(auth.data.data);
    auth.authenticated && getNavData(auth.data.data);
  }, [auth, getNavData]);

  return (
    <UIContainer padding="0" display={displayStyle}>
      <TabPaneHeader user={user} />
      <TabProfileContent user={user} />
    </UIContainer>
  );
};

export default UserProfile;