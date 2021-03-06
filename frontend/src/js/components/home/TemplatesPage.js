import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Header, Button } from "semantic-ui-react";

import { useMainContext } from "../../utils/hookUtils";
import BoardContainer from "../../containers/BoardContainer";
import UISmall from "../shared/UISmall";
import UIWrapper from "../shared/UIWrapper";

const TemplatesPage = ({ templates, handleUseTemplate }) => {
  const [template, setTemplate] = useState(null);

  const { setActiveBoard } = useMainContext();

  useEffect(() => {
    if (!template) setActiveBoard(undefined);
  }, [template, setActiveBoard]);

  return !template ? (
    <UIWrapper className="template-page">
      <Header content="Templates" className="templates-header" />
      <UIWrapper className="templates-wrap">
        {templates.map((item, index) => {
          item.lists[0] === null && item.lists.splice(0, 1);
          return (
            <UIWrapper className="template-individual" key={index}>
              <img
                className="template-image"
                onClick={() => setTemplate(item)}
                src={item.styleProperties.image}
                alt={item.title}
              />
              <span className="template-text">{item.title}</span>
              <small className="template-small">{item.description}</small>
              <Button
                positive
                content="View template"
                floated="left"
                onClick={() => setTemplate(item)}
              />
              <UISmall
                handleClick={() => handleUseTemplate(item)}
                className="use-template"
                content={`Category ${item.category}: Use Template`}
              />
            </UIWrapper>
          );
        })}
      </UIWrapper>
    </UIWrapper>
  ) : (
    <UIWrapper className="template-container">
      <BoardContainer templateBoard={template} />
      <Button
        compact
        content="Close Template"
        className="close-template-demo"
        onClick={() => setTemplate(null)}
      />
    </UIWrapper>
  );
};

TemplatesPage.propTypes = {
  handleUseTemplate: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      lists: PropTypes.arrayOf(PropTypes.object),
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      styleProperties: PropTypes.shape({
        image: PropTypes.string,
        color: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
};

export default TemplatesPage;
