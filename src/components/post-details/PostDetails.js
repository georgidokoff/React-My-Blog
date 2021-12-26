import { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  Modal,
  FormControl,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./PostDetails.css";

import useArticleState from "../../hooks/useArticleState";
import { ArticleContext, articleContextValues } from "../../context/articleContext";
import { useNotificationContext, types } from '../../context/NotificationContext';
import { isAuth } from "../../services/authService";
import { GetUserId } from "../../services/cookiesService";

function PostDetails() {
  const articleContext = useContext(ArticleContext);
  const { addNotification } = useNotificationContext();

  const navigate = useNavigate();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const handleEditClose = () => setShowEditDialog(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleDeleteClose = () => setShowDeleteDialog(false);

  const onChangeArticleHandler = (e) => {
    const value = e.target.value;
    setArticle({
      ...article,
      [e.target.name]: value,
    });
  };

  function onEditClickHandler(articleData) {
    setShowEditDialog(true);

    if (showEditDialog) {
      //console.log(userData);
      handleEditClose();

      // update the selected user
      articleContext.updateArticle(articleData).then((res) => {
        //console.log(res);
        if (res?.success) {
          addNotification(`You successfully update article with title ${res?.result.title}`, types.success);
        } else{
          addNotification('Something went wrong with update...', types.error);
        }
      }).catch((err)=>{
        addNotification('Something went wrong with user create...', types.error);
      });
    }
  }

  function onDeleteClickHandler(article) {
    setShowDeleteDialog(true);

    if (article) {
      handleDeleteClose();
      articleContext.deleteArticle(article?.id).then((res) => {
        //console.log(res);
        if (res?.success) {
          addNotification(`You successfully delete article.`, types.success);
        } else{
          addNotification('Something went wrong with update...', types.error);
        }
        navigate("/");
      }).catch((err)=>{
        addNotification('Something went wrong with user create...', types.error);
      });
    }
  }

  const { articleId } = useParams();
  const [article, setArticle] = useArticleState(articleId);
  
  return (
    <>
      <br />
      <Row key={article.id}>
        <Col>
          <Card.Body>
            <Card.Title>{article.title}</Card.Title>
            <Card.Text>{article.description}</Card.Text>
          </Card.Body>
        </Col>
        <Col>
          <Card className="pictureInPost">
            <Card.Img
              className="post-picture"
              variant="top"
              src={article.imageUrl}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Card.Footer>
          {article.creatorUserId == GetUserId() && (
            <>
              <Button
                id={article.id}
                variant="secondary"
                onClick={() => {
                  onEditClickHandler(article);
                  setArticle(article);
                }}
              >
                Edit
              </Button>{" "}
              <Button
                id={article.id}
                variant="danger"
                onClick={() => {
                  onDeleteClickHandler();
                  setArticle(article);
                }}
              >
                Dell
              </Button>
            </>
          )}
        </Card.Footer>
      </Row>

      <Modal show={showEditDialog} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text className="post-text-label" id="title">
              Title
            </InputGroup.Text>
            <FormControl
              placeholder="Enter title"
              defaultValue={article.title}
              name="title"
              aria-describedby="basic-addon1"
              onChange={onChangeArticleHandler}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className="post-text-label" id="imageUrl">
              Image Url
            </InputGroup.Text>
            <FormControl
              placeholder="Enter Image Url"
              defaultValue={article.imageUrl}
              type="text"
              name="imageUrl"
              aria-describedby="basic-addon1"
              onChange={onChangeArticleHandler}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className="post-text-label" id="description">
              Description
            </InputGroup.Text>
            <FormControl
              className="post-description"
              size="sm"
              as="textarea"
              name="description"
              placeholder="Enter description"
              defaultValue={article.description}
              aria-describedby="basic-addon1"
              onChange={onChangeArticleHandler}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onEditClickHandler(article)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteDialog} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure You want to delete current article: {article.title}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={() => onDeleteClickHandler(article)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostDetails;