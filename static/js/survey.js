var Survey = React.createClass({displayName: "Survey",
  render: function() {
    return (
      React.createElement("div", {className: "questionBox"}, 
        "Hello, world! I am a QuestionBox. survey_data[\"a\"] = ", survey_data["a"]
      )
    );
  }
});

var QuestionBox = React.createClass({displayName: "QuestionBox",
  render: function() {
    return (
      React.createElement("div", {className: "questionBox"}, 
        "Hello, world! I am a CommentBox."
      )
    );
  }
});

React.render(
  React.createElement(Survey, null),
  document.getElementById('react-content')
);
