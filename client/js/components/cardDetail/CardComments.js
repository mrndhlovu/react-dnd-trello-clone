import React, { useState, useEffect, Fragment } from "react";

import { emptyFunction, resetForm } from "../../utils/appUtils";
import { requestCreateComment } from "../../apis/apiRequests";
import CardCommentInput from "../sharedComponents/CardCommentInput";
import Comment from "./Comment";

const CardComments = ({
  handleBoardUpdate,
  activeCard,
  id,
  listPosition,
  saveCardChanges,
  getSourceList,
  board,
  ...props
}) => {
  const [newComment, setNewComment] = useState(null);

  const saveComment = (comment) => setNewComment(comment);

  useEffect(() => {
    if (!newComment) return emptyFunction();
    const body = {
      comment: newComment,
      cardId: activeCard.position,
      listId: listPosition,
    };

    const createComment = async () => {
      await requestCreateComment(body, id).then((res) => {
        setNewComment(null);
        try {
          saveCardChanges(res.data);
          resetForm("comment-input");
          console.log("comment: ", res.data);
        } catch (error) {}
      });
    };

    createComment();
  }, [newComment, id, listPosition, activeCard, saveCardChanges]);

  return (
    <Fragment>
      <CardCommentInput saveComment={saveComment} {...props} />

      {activeCard.comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          getSourceList={getSourceList}
          listPosition={listPosition}
          activeCard={activeCard}
          handleBoardUpdate={handleBoardUpdate}
          board={board}
          saveCardChanges={saveCardChanges}
        />
      ))}
    </Fragment>
  );
};

export default CardComments;