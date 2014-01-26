import json
import uuid
import re
from django import forms
from django.core import serializers
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.template import RequestContext
from django.utils import timezone
from userena.forms import SignupForm
from accounts.models import Notes

@ensure_csrf_cookie
def index(request):
    return render_to_response('accounts/index.html')


@ensure_csrf_cookie
def signup(request):
    form = SignupForm()
    return render_to_response('accounts/signup.html')

def signup_form(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('index')
        else:
            return HttpResponse('Data is not valid')

@csrf_protect
def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        if request.user.is_authenticated():
            request.session.flush()
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('home')
            else:
                return HttpResponse('Account is disabled')
        else:
            return HttpResponse('Invalid login')
    else:
        return HttpResponse('Forbidden 403', status=403)

@login_required
@ensure_csrf_cookie
def home(request):
    return render_to_response('accounts/home.html', {'username': request.user.get_username()}, context_instance=RequestContext(request))

@login_required
@ensure_csrf_cookie
def get_user_notes(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST['username']
        notes = Notes.objects.filter(owner=username)
        json = '{notes:%s,count:%s}' % (serializers.serialize('json', notes, use_natural_keys=True), notes.count())
        return HttpResponse(json, content_type='application/json')

@login_required
@ensure_csrf_cookie
def add_new_note(request):
    return render_to_response('accounts/add_new_note.html', {'username': request.user.get_username()}, context_instance=RequestContext(request))

@login_required
def submit_new_note(request):
    if request.method == 'POST':
        username = request.POST['username']
        category_switch = lambda x: {'1':'N','2':'TD', '3':'R', '4':'L'}.get(x)
        category = category_switch(request.POST['category'])
        title = request.POST['title']
        text = request.POST['text']
        Notes.objects.create(owner=username, title=title, text=text, category=category, favorite=False, uuid=str(uuid.uuid4()), published=False)
    return HttpResponseRedirect('home')

@login_required
def logout(request):
    request.session.flush()
    return HttpResponseRedirect('index')

@login_required
def delete_note(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST['username']
        uuid = request.POST['uuid']
        Notes.objects.filter(owner=username, uuid=uuid).delete()
        return HttpResponse(status=200)
    else:
        return HttpResponse('Request is invalid')

@login_required
def mark_favorite(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST['username']
        uuid = request.POST['uuid']
        note = Notes.objects.get(owner=username, uuid=uuid)
        if Notes.objects.get(owner=username, uuid=uuid).favorite:
            note.favorite = False
        else:
            note.favorite = True
        note.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse('Request is invalid')

@login_required
def edit_note(request):
    if request.method == 'GET':
        username = request.GET.get('username', False)
        uuid = request.GET.get('uuid', False)
        title = Notes.objects.values_list('title', flat=True).filter(owner=username, uuid=uuid).get().encode('utf-8')
        text = Notes.objects.values_list('text', flat=True).filter(owner=username, uuid=uuid).get().encode('utf-8')
        category_switch = lambda x: {'N':1,'TD':2, 'R':3, 'L':4}.get(x)
        category = category_switch(str(Notes.objects.values_list('category', flat=True).filter(owner=username, uuid=uuid).get()))
        return render_to_response('accounts/edit_note.html', {'username':username, 'uuid':uuid, 'title':title, 'text':text, 'category':category}, context_instance=RequestContext(request))
    if request.method == 'POST':
        username = request.POST.get('username', False)
        uuid = request.POST.get('uuid', False)
        note = Notes.objects.get(owner=username, uuid=uuid)
        note.title = request.POST.get('title', False)
        category_switch = lambda x: {'1':'N','2':'TD', '3':'R', '4':'L'}.get(x)
        note.category = category_switch(request.POST.get('category', False))
        note.text = request.POST.get('text', False)
        note.save()
        return HttpResponseRedirect('home')

@login_required
def publish(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST['username']
        uuid = request.POST['uuid']
        note = Notes.objects.get(owner=username, uuid=uuid)
        if Notes.objects.get(owner=username, uuid=uuid).published:
            note.published = False
        else:
            note.published = True
        note.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse('Request is invalid')

def show_note(request, note_uuid):
    try:
        if Notes.objects.get(uuid=note_uuid).published:
            title = Notes.objects.values_list('title', flat=True).filter(uuid=note_uuid).get().encode('utf-8')
            text = Notes.objects.values_list('text', flat=True).filter(uuid=note_uuid).get().encode('utf-8')
            category_switch = lambda x: {'N':'Note','TD':'To do', 'R':'Reminder', 'L':'Link'}.get(x)
            category = category_switch(Notes.objects.values_list('category', flat=True).filter(uuid=note_uuid).get().encode('utf-8'))
            return render_to_response('accounts/published_note.html', {'title':title,'text':text,'uuid':note_uuid, 'category':category}, context_instance=RequestContext(request))
        else:
            return HttpResponse('Note does not exist or not published')
    except Notes.DoesNotExist:
        return HttpResponse('Note does not exist or not published')
