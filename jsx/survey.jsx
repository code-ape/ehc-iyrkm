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
      <div>
        <MenuBar />
        <div className="jumbotron">
          <div className="container">
            <Question text={question["text"]} optionList={question["option_list"]} />
            <p>{back_button}{next_button}</p>
          </div>
        </div>
        <div className="container">
          <Footer />
        </div>
      </div>
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

var Question = React.createClass({
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
      return <b>There is an issue with this quetion, please email admin.</b>;
    }

    var text_html = [];
    var option_position = 0;
    for (var index in text_pieces) {
      var text = text_pieces[index];
      text_html.push(<span>{text}</span>);

      var option = option_list[option_position];
      if (len_option_list > option_position) {
        text_html.push(
          <DropDownList index={option_position} options={option}
            type={blanks[option_position]} />
        );
        option_position++;
      }
    }
    console.log();
    console.log(text_html);
    return (
      <p>{text_html}</p>
    );
  }
});

var DropDownList = React.createClass({
  create_option_choice: function (option_text) {
    return <option value="{option_text}">{option_text}</option>;
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
      <select name={this.props.index}>
        {this.create_option_choice(print_type)}
        {this.props.options.map(this.create_option_choice)}
      </select>
    );
  }
});

var MenuBar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">E&H IKRKM Survey</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <form className="navbar-form navbar-right">
            </form>
          </div>
        </div>
      </nav>
    );
  }
});

var Footer = React.createClass({
  render: function() {
    return (
      <div>
        <hr />
        <footer>
          <p>© Emory & Henry College 2015</p>
        </footer>
      </div>
    );
  }
});

React.render(
  <Survey />,
  document.getElementById('react-content')
);
