var Survey = React.createClass({
  render: function() {
    return (
      <div className="questionBox">
        Hello, world! I am a QuestionBox. survey_data["a"] = {survey_data["a"]}
      </div>
    );
  }
});

var QuestionBox = React.createClass({
  render: function() {
    return (
      <div className="questionBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

React.render(
  <Survey />,
  document.getElementById('react-content')
);
