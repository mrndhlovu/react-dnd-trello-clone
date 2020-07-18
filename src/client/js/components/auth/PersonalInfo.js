import React, { useState } from "react";

import { Header, Form, TextArea, Button } from "semantic-ui-react";

import { useMainContext, useAuth } from "../../utils/hookUtils";
import UIDivider from "../sharedComponents/UIDivider";
import UIWrapper from "../sharedComponents/UIWrapper";

const PersonalInfo = () => {
  const { alertUser, updateUserRequestHandler } = useMainContext();
  const { user } = useAuth();

  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState(null);

  const saveClickHandler = () => {
    const body = {
      username: username ? username : user.username,
      bio: bio ? bio : user.bio,
    };
    updateUserRequestHandler(body, null, () => {
      setLoading(false);
      alertUser("Saved", true);
    });
  };

  return (
    <>
      <Header as="h3" content="Manage your personal information" />
      <Header as="h5" content="About" />
      <UIDivider />

      <Form>
        <Form.Field
          defaultValue={user && user.username}
          label="Username"
          control="input"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Header content="Bio" as="h5" />
        <TextArea
          control="input"
          defaultValue={user && user.bio}
          placeholder="Bio"
          onChange={(e) => setBio(e.target.value)}
        />
        <UIWrapper padding="30px 0">
          <Button
            loading={loading}
            size="small"
            content="Done"
            fluid
            positive
            onClick={() => saveClickHandler()}
          />
        </UIWrapper>
      </Form>
    </>
  );
};

export default PersonalInfo;
