import React, { useState } from "react";
import styled from "styled-components";

import { Button } from "semantic-ui-react";

import { useBoardContext, useMainContext } from "../../utils/hookUtils";
import BoardMembersList from "../sharedComponents/BoardMembersList";
import CreateInput from "../sharedComponents/CreateInput";
import EditCardButton from "../sharedComponents/EditCardButton";
import MoveCardDialog from "./MoveCardDialog";
import PickDueDate from "../sharedComponents/PickDueDate";
import UIModal from "../sharedComponents/UIModal";

const Wrapper = styled.div`
  display: flex;
  vertical-align: top;
  justify-content: space-evenly;
`;

const StyledModalContent = styled.div`
  background: transparent !important;
  padding-bottom: 10px;
  padding-left: 10px;
  width: fit-content;
`;

const StyledModalActions = styled.div`
  background: transparent !important;
  display: flex;
  flex-direction: column;
  margin-top: 10px !important;
  width: fit-content;
`;

const EditCardModal = ({
  cardItem,
  handleDeleteCard,
  openCardModal,
  setOpenCardModal,
  sourceListId,
}) => {
  const { board, history, cardUpdateRequestHandler } = useBoardContext();
  const { alertUser } = useMainContext();

  const [close, setClose] = useState(false);
  const [newTitle, setNewTitle] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const handleChange = (e) => setNewTitle(e.target.value);

  const archiveCardHandler = () => {
    cardUpdateRequestHandler({ ...cardItem, title: newTitle }, sourceListId);
  };

  const saveCardHandler = () => {
    cardUpdateRequestHandler({ ...cardItem, archived: true }, sourceListId);
    setNewTitle(null);
  };

  const boardMembersHandler = (boardMember) => {
    const isInAssigneeList = cardItem.assignees.some(
      (member) => member._id === boardMember._id
    );

    isInAssigneeList
      ? cardItem.assignees.splice(cardItem.assignees.indexOf(boardMember), 1)
      : cardItem.assignees.push(boardMember);

    cardUpdateRequestHandler(cardItem, sourceListId);
  };

  const dueDateHandler = (remove) => {
    const newCard = {
      ...cardItem,
      dueDate: remove ? "" : { date: `${startDate}`, complete: false },
    };
    cardUpdateRequestHandler(
      newCard,
      sourceListId,
      alertUser("Due Date Updated", true)
    );
  };

  const EDIT_CARD_MODAL_STYLE = {
    top: "6%",
    left: "28%",
    bottom: "1%",
    padding: "0px",
    width: "45%",
    border: "none",
    backgroundColor: "transparent",
  };

  return (
    <UIModal
      className="create-cardItem-modal"
      isOpen={openCardModal}
      bgColor="transparent"
      modalStyle={EDIT_CARD_MODAL_STYLE}
    >
      <Wrapper className="edit-cardItem-actions">
        <StyledModalContent>
          <CreateInput
            close={() => setOpenCardModal(false)}
            defaultValue={cardItem.title}
            buttonText="Save"
            placeholder="Update cardItem title"
            handleCreateClick={() => saveCardHandler()}
            handleChange={handleChange}
          />
        </StyledModalContent>
        <StyledModalActions>
          <EditCardButton
            header="Delete"
            closeOnSelect={true}
            color="#000000de"
            buttonText="Delete"
            icon="delete"
          >
            <Button
              content="Delete Card"
              negative
              compact
              size="tiny"
              onClick={() => handleDeleteCard()}
              fluid
            />
          </EditCardButton>
          <EditCardButton
            close={close}
            buttonText="Move"
            header="Move"
            icon="right arrow"
          >
            <MoveCardDialog
              originalBoard={board}
              originalCard={cardItem}
              history={history}
              sourceListId={sourceListId}
              setClose={() => setClose(true)}
            />
          </EditCardButton>
          <EditCardButton
            buttonText="Change Members"
            icon="users"
            closeOnSelect={true}
          >
            <BoardMembersList
              boardMembers={board.members}
              handleBoardMemberClick={boardMembersHandler}
              activeCard={cardItem}
            />
          </EditCardButton>

          <EditCardButton buttonText="Change Due Date" icon="clock">
            <PickDueDate
              startDate={startDate}
              setStartDate={setStartDate}
              handleUpdateDueDate={dueDateHandler}
            />
          </EditCardButton>
          <EditCardButton
            buttonText="Archive"
            icon="archive"
            closeOnSelect={true}
          >
            <Button
              content="Archive"
              negative
              compact
              fluid
              onClick={() => archiveCardHandler()}
            />
          </EditCardButton>
        </StyledModalActions>
      </Wrapper>
    </UIModal>
  );
};

export default EditCardModal;
