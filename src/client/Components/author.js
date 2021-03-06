import React, { useEffect } from "react";
import { Row, Col, Container, Jumbotron, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../Redux/actions";

function Author(props) {
  const dispatch = useDispatch();
  const propsFromStore = useSelector(state => {
    return {
      user: state.userInfo.user,
      articles: state.userInfo.articles,
      loading: state.userInfo.loading,
      error: state.userInfo.error
    };
  });
  const { user, articles, loading, error } = propsFromStore;
  const {
    match: { params }
  } = props;

  useEffect(() => {
    fetchUserInfo(params.authorId)(dispatch);
  }, [dispatch, params.authorId]);

  if (loading) {
    return (
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <p className="lead" style={{ fontWeight: "bold" }}>
                <h1>Loading ......</h1>
              </p>
            </Jumbotron>
            <br />
          </Col>
        </Row>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <p className="lead" style={{ fontWeight: "bold" }}>
                <h1>Error fetching author info and activity..</h1>
              </p>
            </Jumbotron>
            <br />
          </Col>
        </Row>
      </Container>
    );
  }
  if (user && (user.firstName || user.lastName)) {
    return (
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">{`${user.firstName},${user.lastName}`}</h1>
              <hr className="my-2" />
              <p className="lead">{user.bioDescription}</p>
            </Jumbotron>
          </Col>
        </Row>
        {articles.map(article => {
          return (
            <Row>
              <Col>
                <Jumbotron>
                  <p className="lead" style={{ fontWeight: "bold" }}>
                    {article.title}
                  </p>
                  <hr className="my-2" />
                  <p>
                    {!article.description || article.description.length < 200
                      ? article.description
                      : `${article.description.substring(0, 200)}...`}
                  </p>
                  <p className="lead">
                    <Button
                      color="primary"
                      onClick={() => {
                        // eslint-disable-next-line no-underscore-dangle
                        props.history.push(`/article/${article._id}`, article);
                      }}
                    >
                      Learn more
                    </Button>
                  </p>
                </Jumbotron>
              </Col>
            </Row>
          );
        })}
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <Jumbotron>
            <p className="lead" style={{ fontWeight: "bold" }}>
              <h1>......</h1>
            </p>
          </Jumbotron>
          <br />
        </Col>
      </Row>
    </Container>
  );
}

const loadData = (store, match) => {
  return store.dispatch(fetchUserInfo(match.params.authorId));
};

export default { component: Author, loadData };
