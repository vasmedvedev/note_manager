from django.conf.urls import patterns, include, url
#from django.core.urlresolvers import reverse
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from accounts import views

urlpatterns = patterns('accounts.views',
    url(r'^$', 'index'),
    url(r'^index', 'index'),
    url(r'^signup$', 'signup'),
    url(r'^signup_form', 'signup_form'),
    url(r'^signin','signin'),
    url(r'^home', 'home'),
    url(r'^get_user_notes', 'get_user_notes'),
    url(r'^add_new_note','add_new_note'),
    url(r'^submit_new_note','submit_new_note'),
    url(r'^logout','logout'),
    url(r'^delete_note','delete_note'),
    url(r'^mark_favorite','mark_favorite'),
    url(r'^edit_note','edit_note'),
    url(r'^publish','publish'),
    url(r'^note/(?P<note_uuid>.+)/$', views.show_note, name = 'show_note')
)

