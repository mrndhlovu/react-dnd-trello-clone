import React, {
  useContext,
  useState,
  useEffect,
  memo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Modal, Button, Grid } from "semantic-ui-react";

import {
  BoardListsContext,
  MainContext,
  BoardContext,
} from "../../utils/contextUtils";
import {
  checkDuplicate,
  emptyFunction,
  findArrayItem,
} from "../../utils/appUtils";
import { requestCardUpdate } from "../../apis/apiRequests";
import Attachments from "./Attachments";
import CardModalActivities from "./CardModalActivities";
import CardModalDescription from "./CardModalDescription";
import CardModalSidebar from "./CardModalSidebar";
import ModalHeader from "./ModalHeader";
import CardLabels from "./CardLabels";
import CheckLists from "./CheckLists";
import { useAuth } from "../../utils/hookUtils";

const DueDate = lazy(() => import("./DueDate"));
const ModalImageCover = lazy(() => import("./ModalImageCover"));

const ModalContent = styled(Modal.Content)``;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
`;

const LeftSideContent = styled(Modal.Description)``;

const Container = styled.div`
  padding: 25px;
`;

const StyledIcon = styled(Button)`
  border-radius: 50px !important;
`;

const CardDetailModal = ({ sourceId, match, modalOpen, history }) => {
  const {
    activeCard,
    board,
    getSourceList,
    handleBoardUpdate,
    handleCardClick,
    handleUploadAttachment,
    sourceTitle,
  } = useContext(BoardListsContext);
  const { saveBoardChanges } = useContext(BoardContext);
  const { user } = useAuth();
  const { device } = useContext(MainContext);
  const { id } = match.params;

  const [activeCover, setActiveCardCover] = useState(null);
  const [card, setCard] = useState(activeCard);
  const [deleteAttachment, setDeleteAttachment] = useState(null);
  const [hideActivities, setHideActivities] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newAttachment, setNewAttachment] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  const hasLabel = card && card.labels.length !== 0;
  const hasChecklist = card && card.checklists.length !== 0;
  const hasMembers = board && board.members.length !== 0;
  const hasCover = card && card.cardCover.localeCompare("") !== 0;

  const saveCardChanges = (changes) => setCard(changes);

  const handleMakeCover = (coverUrl) => setNewCover(coverUrl);

  const handleDeleteAttachment = (imgUrl) => {
    setDeleteAttachment(imgUrl);
    setIsLoading(true);
  };

  const addCardAttachment = useCallback(
    (attachment, callback) => {
      const duplicate = checkDuplicate(
        card.attachments.images,
        attachment.imgUrl
      );
      if (!duplicate) {
        card.attachments.images.push(attachment);
        !card.cardCover && { ...card, cardCover: attachment.imgUrl };

        const sourceList = findArrayItem(board.lists, sourceId, "_id");

        sourceList.cards.splice(sourceList.cards.indexOf(card), 1, card);
        board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);

        setNewAttachment(board);
      }
      callback();
    },
    [card, board, sourceId]
  );

  useEffect(() => {
    if (!newAttachment) return emptyFunction();

    handleBoardUpdate(newAttachment, "lists", "addAttachment");
    setNewAttachment(false);
  }, [handleBoardUpdate, newAttachment]);

  const handleLoadingAttachment = (loading) => {
    setIsLoading(loading);
  };
  const handleRemoveCover = () => {
    setRemoveCover(true);
    handleLoadingAttachment(true);
  };

  useEffect(() => {
    if (!removeCover) return;

    const removeCardCover = async () => {
      const body = {
        cardId: card._id,
        listId: sourceId,
        newCard: { ...card, cardCover: "" },
      };
      await requestCardUpdate(body, id).then((res) => {
        setCard({ ...card, cardCover: "" });
        saveBoardChanges(res.data);
        setRemoveCover(false);
        handleLoadingAttachment(false);
        setActiveCardCover(null);
      });
    };
    removeCardCover();
  }, [card, id, sourceId, handleBoardUpdate, removeCover, saveBoardChanges]);

  useEffect(() => {
    if (!newCover) return emptyFunction();

    const attachCardCover = async () => {
      let newCard = { ...card, cardCover: newCover };

      const body = {
        newCard,
        listId: sourceId,
      };

      await requestCardUpdate(body, id).then((res) => {
        setCard(newCard);
        saveBoardChanges(res.data);
        setActiveCardCover(newCard.cardCover);
      });
    };
    attachCardCover();
    return () => setNewCover(null);
  }, [
    card,
    id,
    sourceId,
    handleBoardUpdate,
    setNewCover,
    newCover,
    newAttachment,
    saveBoardChanges,
  ]);

  useEffect(() => {
    if (newCover) return;
    setActiveCardCover(card.cardCover);
  }, [card, newCover]);

  useEffect(() => {
    if (!deleteAttachment) return emptyFunction();

    const removeAttachment = async () => {
      card.attachments.images.splice(
        card.attachments.images.indexOf(deleteAttachment),
        1
      );

      const body = {
        newCard: card,
        listId: sourceId,
      };

      await requestCardUpdate(body, id).then((res) => {
        setCard(body.newCard);
        saveBoardChanges(res.data);
        setIsLoading(false);
      });
    };
    removeAttachment();
    setDeleteAttachment(null);
  }, [
    activeCover,
    deleteAttachment,
    card,
    id,
    sourceId,
    saveBoardChanges,
    newCover,
  ]);

  return (
    <Modal
      className="card-detail-container"
      closeOnDocumentClick={true}
      centered={false}
      open={card && modalOpen}
      closeOnRootNodeClick={false}
      closeIcon={
        <ButtonWrapper>
          <StyledIcon
            onClick={() => handleCardClick()}
            icon="delete"
            size="tiny"
          />
        </ButtonWrapper>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ModalImageCover
          activeCard={card}
          cardCover={activeCover}
          handleCardClick={handleCardClick}
          hasCover={hasCover}
          id={id}
          isLoading={isLoading && (newCover || removeCover)}
          sourceId={sourceId}
          saveCardChanges={saveCardChanges}
          saveBoardChanges={saveBoardChanges}
          handleRemoveCover={handleRemoveCover}
          handleMakeCover={handleMakeCover}
        />
      </Suspense>
      <Container>
        <ModalHeader
          title={card.title}
          cardPosition={card._id}
          sourceId={sourceId}
          sourceTitle={sourceTitle}
          cardCover={card.cardCover}
        />

        <Grid columns={2} divided stackable>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <ModalContent image>
                <LeftSideContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    {card.dueDate && card.dueDate.date && (
                      <DueDate
                        activeCard={card}
                        handleBoardUpdate={handleBoardUpdate}
                        getSourceList={getSourceList}
                        sourceId={sourceId}
                        board={board}
                        saveCardChanges={saveCardChanges}
                      />
                    )}
                  </Suspense>
                  {hasLabel && (
                    <CardLabels
                      board={board}
                      handleBoardUpdate={handleBoardUpdate}
                      activeCard={card}
                      sourceId={sourceId}
                      getSourceList={getSourceList}
                    />
                  )}

                  <CardModalDescription
                    board={board}
                    handleBoardUpdate={handleBoardUpdate}
                    sourceId={sourceId}
                    getSourceList={getSourceList}
                    activeCard={card}
                  />
                  {hasChecklist &&
                    card.checklists.map((list, index) => (
                      <CheckLists
                        key={list._id}
                        activeCard={card}
                        checklistName={list.name}
                        checklist={list}
                        handleBoardUpdate={handleBoardUpdate}
                        board={board}
                        getSourceList={getSourceList}
                        sourceId={sourceId}
                        match={match}
                        saveBoardChanges={saveBoardChanges}
                        saveCardChanges={saveCardChanges}
                        mobile={device.mobile}
                        id={id}
                        listIndex={index}
                      />
                    ))}

                  <Attachments
                    activeCover={activeCover}
                    activeCard={card}
                    isLoading={isLoading && (newAttachment || deleteAttachment)}
                    handleMakeCover={handleMakeCover}
                    handleRemoveCover={handleRemoveCover}
                    handleDeleteAttachment={handleDeleteAttachment}
                  />

                  <CardModalActivities
                    activeCard={card}
                    handleBoardUpdate={handleBoardUpdate}
                    board={board}
                    getSourceList={getSourceList}
                    handleShowDetails={() => setHideActivities(!hideActivities)}
                    hideActivities={hideActivities}
                    id={id}
                    sourceId={sourceId}
                    saveCardChanges={saveCardChanges}
                    user={user.fname}
                  />
                </LeftSideContent>
              </ModalContent>
            </Grid.Column>
            <Grid.Column width={4}>
              <CardModalSidebar
                activeCard={card}
                addCardAttachment={addCardAttachment}
                board={board}
                boardMembers={board.members}
                getSourceList={getSourceList}
                handleBoardUpdate={handleBoardUpdate}
                handleLoadingAttachment={handleLoadingAttachment}
                handleMakeCover={handleMakeCover}
                handleRemoveCover={handleRemoveCover}
                handleUploadAttachment={handleUploadAttachment}
                hasChecklist={hasChecklist}
                hasCover={hasCover}
                hasDueDate={card.dueDate && card.dueDate.date}
                hasMembers={hasMembers}
                sourceId={sourceId}
                mobile={device.mobile}
                saveBoardChanges={saveBoardChanges}
                saveCardChanges={saveCardChanges}
                id={id}
                history={history}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Modal>
  );
};

export default withRouter(memo(CardDetailModal));