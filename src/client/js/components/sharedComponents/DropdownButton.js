import React, { useState, Fragment, useEffect } from "react";
import styled from "styled-components";

import { Header, Dropdown, Icon } from "semantic-ui-react";
import { X } from "react-feather";
import UIDivider from "./UIDivider";

const StyledDropdown = styled(Dropdown)`
  margin-bottom: 10px !important;
  padding-bottom: 15px;
  background: ${(props) => props.color} !important;
  text-align: left !important;
  font-size: 13px !important;
  font-weight: 500 !important;
`;

const HeaderWrapper = styled(Dropdown.Header)`
  display: flex !important;
  justify-content: space-between !important;
  flex-direction: row !important;
  width: 100% !important;
`;

const DropdownButton = ({
  buttonText,
  children,
  icon,
  header,
  color = "#091e420a",
  size = "tiny",
  fluid = true,
  labeled = true,
  button = true,
  direction = "left",
  upward = false,
  as = "h5",
  callback = () => {},
  closeOnSelect = false,
  hasHeader = true,
  pointing,
  className,
  compact = true,
  close,
  notificationCount,
  iconColor,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = (callback) => {
    callback && callback();
    return setOpen(false);
  };

  useEffect(() => {
    close && handleClose();
  }, [close]);

  return (
    <StyledDropdown
      upward={upward}
      lazyLoad
      button={button}
      className={`${className || ""} icon`}
      color={color}
      compact={compact}
      floating
      fluid={fluid}
      icon={
        icon && (
          <>
            {notificationCount && (
              <span className="notifications-count">{notificationCount}</span>
            )}
            <Icon name={icon} color={iconColor} />
          </>
        )
      }
      labeled={labeled}
      onClick={() => setOpen(true)}
      open={open}
      size={size}
      text={buttonText}
      direction={direction}
      pointing={pointing}
      onBlur={() => (closeOnSelect ? handleClose(callback) : () => {})}
    >
      <Dropdown.Menu
        className="sidebar-dropdown-button"
        onClick={(e) => !closeOnSelect && e.stopPropagation()}
      >
        {hasHeader && (
          <Fragment>
            <HeaderWrapper>
              <Header size="small" as={as} content={header} />
              {!closeOnSelect && <X onClick={() => handleClose(callback)} />}
            </HeaderWrapper>
            <UIDivider />
          </Fragment>
        )}
        {children}
      </Dropdown.Menu>
    </StyledDropdown>
  );
};

export default DropdownButton;
