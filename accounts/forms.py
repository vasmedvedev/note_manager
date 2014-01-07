from userena.forms import SignupForm
from django import forms

class MySignUpForm(SignupForm):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=50)
