var survey = {
  "id": "SURVEY_ID",
  "type": "student",
  "version": "0.1.0",
  "start_name": "age",
  "end_name": "END",
  "questions": {
    "age": {
      "text": "I am {select_one} years old.",
      "inject": "True",
      "option_list": [
        [
          "under 18",
          "18",
          "19",
          "20",
          "21",
          "22",
          "between 22 and 30",
          "between 31 and 40",
          "over 40"
        ]
      ],
      "next": "gender"
    },
    "gender": {
      "text": "I identify my gender as {select_one}.",
      "inject": "True",
      "option_list": [
        [
          "male",
          "female",
          "trans"
        ]
      ],
      "next": "race"
    },
    "race": {
      "text": "I identify my race as {select_one}.",
      "inject": "True",
      "option_list": [
        [
          "Asian",
          "Black or African American",
          "Caucasian or White",
          "Hispanic or Latino/Latina",
          "not listed"
        ]
      ],
      "next": "LGBT"
    },

    "LGBT": {
      "text": "I {select_one} consider myself part of the LGBT community.",
      "inject": "True",
      "option_list": [
        [
          "do",
          "do not"
        ]
      ],
      "next": "END"
    }
  }
}



var Survey = React.createClass({displayName: "Survey",
  getInitialState: function() {
    return {
      survey: survey,
      answers: {},
      question_number: 1,
      question_name: survey["start_name"],
      initial_question: survey["start_name"],
      next_allowed: false,
      current_option: ""
    };
  },
  render: function() {
    var question = this.state.survey.questions[this.state.question_name];
    console.log("this.state.survey =", this.state.survey)
    console.log("this.state.question_name =", this.state.question_name)
    console.log("question =", question)

    var back_button;
    var next_button;

    if (this.state.question_number > 1) {
      back_button = React.createElement("input", {type: "button", onClick: this.back, value: "Back"});
    } else {
      back_button = "";
    }

    if (question["next"] == "END") {
      next_button = React.createElement("input", {type: "button", onClick: this.done, value: "Done"});
    } else {
      next_button = React.createElement("input", {type: "button", onClick: this.next, value: "Next"});
    }

    return (
      React.createElement("div", null, 
        React.createElement(MenuBar, null), 
        React.createElement("div", {className: "jumbotron"}, 
          React.createElement("div", {className: "container"}, 
            React.createElement(Question, {text: question["text"], optionList: question["option_list"]}), 
            React.createElement("p", null, back_button, next_button)
          )
        ), 
        React.createElement("div", {className: "container"}, 
          React.createElement(Footer, null)
        )
      )
    );
  },
  onChoiceChange: function(choice) {
    var state_change = {current_option: choice};
    if (choice != "select one" && choice != "select all") {
      state_change.push({next_allowed: true});
    }
    this.setState(state_change);
  },
  next: function () {
    console.log("NEXT");
    var question = this.state.survey.questions[this.state.question_name];
    var new_question_number = this.state.question_number + 1;
    this.setState({question_name: question["next"], question_number: new_question_number});
    console.log("this.state.question_name =", this.state.question_name);
  },
  back: function () {
    console.log("BACK");
  },
  done: function () {
    console.log("DONE");
  }
});

var Question = React.createClass({displayName: "Question",
  render: function () {
    var text = this.props.text;
    var option_list = this.props.optionList;

    var blanks = (text.match(/\{select_(?:one|all)\}/g)||[]);
    var text_pieces = (text.split(/\{select_(?:one|all)\}/g)||[]);
    var num_blanks = blanks.length;
    var len_option_list = option_list.length;
    console.log(blanks);
    console.log(num_blanks);
    console.log(len_option_list);
    console.log("text_pieces =", text_pieces);

    if (num_blanks != len_option_list) {
      console.log("SOMETHING IS WRONG WITH THIS QUESTION");
      return React.createElement("b", null, "There is an issue with this quetion, please email admin.");
    }

    var text_html = [];
    var option_position = 0;
    for (var index in text_pieces) {
      var text = text_pieces[index];
      text_html.push(React.createElement("span", null, text));

      var option = option_list[option_position];
      if (len_option_list > option_position) {
        text_html.push(
          React.createElement(DropDownList, {index: option_position, options: option, 
            type: blanks[option_position]})
        );
        option_position++;
      }
    }
    console.log();
    console.log(text_html);
    return (
      React.createElement("p", null, text_html)
    );
  }
});

var DropDownList = React.createClass({displayName: "DropDownList",
  create_option_choice: function (option_text) {
    return React.createElement("option", {value: "{option_text}"}, option_text);
  },
  onChange: function() {

  },
  render: function() {
    var print_type;
    if (this.props.type == "{select_one}") {
      print_type = "select one";
    } else if (this.props.type == "{select_all}") {
      print_type = "select all";
    }
    return (
      React.createElement("select", {name: this.props.index}, 
        this.create_option_choice(print_type), 
        this.props.options.map(this.create_option_choice)
      )
    );
  }
});

var MenuBar = React.createClass({displayName: "MenuBar",
  render: function() {
    return (
      React.createElement("nav", {className: "navbar navbar-inverse navbar-fixed-top"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "navbar-header"}, 
            React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar"}, 
              React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
              React.createElement("span", {className: "icon-bar"}), 
              React.createElement("span", {className: "icon-bar"}), 
              React.createElement("span", {className: "icon-bar"})
            ), 
            React.createElement("a", {className: "navbar-brand", href: "#"}, "E&H IKRKM Survey")
          ), 
          React.createElement("div", {id: "navbar", className: "navbar-collapse collapse"}, 
            React.createElement("form", {className: "navbar-form navbar-right"}
            )
          )
        )
      )
    );
  }
});

var Footer = React.createClass({displayName: "Footer",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("hr", null), 
        React.createElement("footer", null, 
          React.createElement("p", null, "© Emory & Henry College 2015")
        )
      )
    );
  }
});

React.render(
  React.createElement(Survey, null),
  document.getElementById('react-content')
);
