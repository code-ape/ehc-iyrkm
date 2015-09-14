var survey = {
  "id": "SURVEY_ID",
  "type": "student",
  "version": "0.1.0",
  "start_name": "test",
  "end_name": "END",
  "questions": {
    "test": {
      "text": "I will select one from this list {select_one} and multiple from this list {select_all}.",
      "inject": "True",
      "option_list": [
        [
          "a", "b", "c", "d"
        ],
        [
          "e", "f", "g", "h"
        ]
      ],
      "next": "age"
    },
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





var Survey = React.createClass({
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
      back_button = <input type="button" onClick={this.back} value="Back" />;
    } else {
      back_button = "";
    }

    if (question["next"] == "END") {
      next_button = <input type="button" onClick={this.done} value="Done" />;
    } else {
      next_button = <input type="button" onClick={this.next} value="Next" />;
    }

    return (
      <div className="jumbotron">
        <div className="container">
          <Question text={question["text"]}
            optionList={question["option_list"]}
            onChoiceChange={this.onChoiceChange}
          />
          <p>{back_button}{next_button}</p>
        </div>
      </div>
    );
  },
  onChoiceChange: function(choices) {
    var state_change = {current_option_choices: choice_dict};

    var next_allowed_val = true;

    for (var index in choices) {
      var choice = choice_dict[index];
      var choice_type = choice["type"];
      var choice_value = choice["value"]
      if (value == null) {
        next_allowed_val = false;
      }
    }
    state_change.push({next_allowed: next_allowed_val});
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





var Question = React.createClass({
  onAnswerChange: function (answer_index, answer_value) {
    var answers = this.state.answers;
    var corresponding_answer = answers[answer_index];

    corresponding_answer["value"] = answer_value;
    answers[answer_index] = corresponding_answer;
    this.setState({answers: answers});

    console.log("Question.onAnswerChange called with index '"
                + answer_index + "' and value '" + answer_value
                + "'. Final answers value:", answers);

  },
  genOnChoiceChange: function(form_index) {
    var onAnswerChange = this.onAnswerChange;
    var f = function(event) {
      onAnswerChange(form_index, event.target.value);
    };
    return f;
  },
  componentWillReceiveProps: function(nextProps) {
    this.customSetState(nextProps);
  },
  componentWillMount: function() {
    this.customSetState(this.props);
  },
  customSetState: function(props) {
    var text = props.text;
    var blanks = (text.match(/\{select_(?:one|all)\}/g)||[]);
    var text_pieces = (text.split(/\{select_(?:one|all)\}/g)||[]);

    var answers = [];
    for (var index in blanks) {
      var blank = blanks[index];
      if (blank == "{select_one}") {
        answers.push({
          "type": "select_one",
          "value": null
        });
      } else {
        answers.push({
          "type": "select_all",
          "value": []
        });
      }
    }

    this.setState({
      blanks: blanks,
      option_list: props.optionList,
      text_pieces: text_pieces,
      answers: answers
    });

    console.log("blanks =", blanks);
    console.log("blanks.length=", blanks.length);
    console.log("option_list.length =", props.optionList.length);
    console.log("text_pieces =", text_pieces);
  },
  render: function () {
    var len_option_list = this.state.option_list.length;
    if (this.state.blanks.length != len_option_list) {
      console.log("SOMETHING IS WRONG WITH THIS QUESTION");
      return <b>There is an issue with this quetion, please email admin.</b>;
    }

    var text_html = [];
    var option_position = 0;
    for (var index in this.state.text_pieces) {
      var text = this.state.text_pieces[index];
      text_html.push(<span>{text}</span>);

      var option = this.state.option_list[option_position];
      if (len_option_list > option_position) {
        text_html.push(
          <DropDownList
            index={option_position}
            options={option}
            handleChange={this.genOnChoiceChange(option_position)}
            type={this.state.blanks[option_position]} />
        );
        option_position++;
      }
    }

    return (
      <p>{text_html}</p>
    );
  }
});





var DropDownList = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    this.customSetState(nextProps);
  },
  componentWillMount: function() {
    this.customSetState(this.props);
  },
  customSetState: function(props) {
    var answer;

    if (props.type == "{select_one}") {
      answer = null;
    } else {
      answer = [];
    }

    this.setState({
      answer: answer,

    });
  },
  genCheckBoxHandler: function(checkbox_value, index) {
    var f = function(event) {
      var checked = event.target.checked;
      var answer = this.state.answer;
      console.log("Checked for '" + checkbox_value + "' = " + checked);
      if (checked) {
        answer.push(checkbox_value);
      } else {
        var index_of_element = $.inArray(checkbox_value, answers);
        if (index_of_element < 0) {
          console.error("Tried to remove value '" + checkbox_value + "' but it isn't in answers!")
        } else {
          answers.splice(index_of_element, 1);
        }
      }
      this.setState({answer:answer});
    };
    return f;
  },
  createOptionChoiceOne: function (option_text, index=0) {
    var option;
    if (option_text == "select one" || option_text == "select all") {
      option = <option key={index} disabled selected>{option_text}</option>;
    } else {
      if (option_text == "select one") {
        option = <option key={index} value={option_text}>{option_text}</option>;
      } else {
        option = <option key={index} value={option_text}>{option_text}</option>;
      }
    }
    return option;
  },
  createOptionChoiceAll: function(option_text, index=0) {
    var check_box_handler = this.genCheckBoxHandler(option_text, index);
    return (<li><input type="checkbox" onChange={check_box_handler} />option_text</li>);
  },
  renderSelectOne: function() {
    var print_type = "select one";

    return (
      <select name={this.props.index}
          multiple={print_type=="select all"}
          onChange={this.props.handleChange}>
        {this.createOptionChoiceOne(print_type, true)}
        {this.props.options.map(this.createOptionChoiceOne)}
      </select>
    );
  },
  renderSelectAll: function() {
    var print_type = "select all";

    return (
      <span>
        <span class="anchor" name={this.props.index}>select all</span>
        <ul id="items" class="items">
          {this.props.options.map(this.createOptionChoiceOne)}
        </ul>
      </span>
    );
  },
  render: function() {
    if (this.props.type == "{select_one}") {
      return this.renderSelectOne();
    } else if (this.props.type == "{select_all}") {
      return this.renderSelectAll();
    }
  }
});



React.render(
  <Survey />,
  document.getElementById('react-content')
);
