import re
import os
import json

import cgi
import urllib

from google.appengine.ext import ndb
from google.appengine.api import users

import webapp2
import jinja2

import tools

jinja_path = os.path.join(os.path.dirname(__file__), "templates")
jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(jinja_path),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class User(ndb.Model):
    """Models a user"""
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    date_created = ndb.DateTimeProperty(auto_now_add=True)
    # surveys_taken = ndb.StructuredProperty(SurveyCompletion, repeated=True)

# class Survey(ndb.Model):
#     version = ndb.StringProperty()
#     question_data = ndb.JsonProperty()
#     date_created = ndb.DateTimeProperty(auto_now_add=True)
#     questions = ndb.StructuredProperty(SurveyQuestion, repeated=True)
#
# class SurveyQuestion(ndb.Model):
#     question = ndb.StringProperty()
#     option_list = nsb.JsonProperty()
#
# class SurveyCompletionRecord(ndb.Model):
#     survey = ndb.StructuredProperty(Survey)
#     user = ndb.StructuredProperty(User)
#     date_completed = ndb.DateTimeProperty(auto_now_add=True)
#
# class SurveyRecord(ndb.Model):
#     date_completed = ndb.DateTimeProperty(auto_now_add=True)
#     data = ndb.StructuredProperty()
#
# class SurveyAnswer(ndb.Model):
#     survey = re


class MainPage(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template('main_page.html')
        self.response.write(template.render())


class TakeSurvey(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        user_kind = tools.get_user_type(user)

        if user_kind == "not_logged_in":
            login_url = users.create_login_url(self.request.uri)
            self.redirect(login_url)
            return

        if user_kind == "student":
            template = jinja_env.get_template('survey.html')
            template_data = {"survey": json.dumps({"a":"b"})}
            self.response.write(template.render(template_data))
            # self.response.write('<a href="{}">Logout</a>'.format(users.create_logout_url(self.request.uri)))
            return

        else:
            self.response.out.write('<p>This is not an E&H student email account</p>')
            self.response.out.write(
                '<a href={}>Click here to logout then log back in with student account</a>'.format(
                    users.create_logout_url(self.request.uri)
                )
            )
            return



    def post(self):
        # We set the parent key on each 'Greeting' to ensure each guestbook's
        # greetings are in the same entity group.
        vote_value = self.request.get("vote_value")
        vote = Vote(choice=vote_value)
        vote.put()

class SurveyPreface(webapp2.RequestHandler):
    def get(self):
        return "DONE"

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/survey_preface', SurveyPreface),
    ('/take_survey', TakeSurvey)
])
