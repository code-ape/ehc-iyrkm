import re
import unittest

from google.appengine.api import users
from google.appengine.ext import testbed


def get_user_type(user):
    """Returns: 'student', 'faculty_staff', 'not_ehc', 'not_logged_in'
    """
    if not user:
        return 'not_logged_in'

    email = user.email()
    match_ehc = re.search('.+@ehc\.edu', email)
    if match_ehc:
        extracted_email = match_ehc.group(0)
        if extracted_email == email:
            username = email[:-8] # remove @ehc.edu
            match_student = re.search('\w+\d{2}', username)
            if match_student:
                return "student"
            else:
                return "faculty_staff"

    return 'not_ehc'


class ToolsTest(unittest.TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_app_identity_stub()

    def tearDown(self):
        self.testbed.deactivate()

    def test_get_user_type_for_not_logged_in(self):
        user = None
        resp = get_user_type(user)
        self.assertEqual("not_logged_in", resp)

    def test_get_user_type_for_not_ehc(self):
        user = users.User(email="user@gmail.com")
        resp = get_user_type(user)
        self.assertEqual("not_ehc", resp)

    def test_get_user_type_for_student(self):
        user = users.User(email="jdoe15@ehc.edu")
        resp = get_user_type(user)
        self.assertEqual("student", resp)

    def test_get_user_type_for_faculty(self):
        user = users.User(email="jdoe@ehc.edu")
        resp = get_user_type(user)
        self.assertEqual("faculty_staff", resp)

if __name__ == '__main__':
    unittest.main()
