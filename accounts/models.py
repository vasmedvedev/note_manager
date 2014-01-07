from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from userena.models import UserenaBaseProfile

class MyProfile(UserenaBaseProfile):
    user = models.OneToOneField(User,unique=True,verbose_name=_('user'),related_name='my_profile')

class Notes(models.Model):
    CATEGORIES = (
        ('L', 'Link'),
        ('R', 'Reminder'),
        ('N', 'Note'),
        ('TD', 'To do'),
    )
    note_id = models.AutoField(primary_key=True)
    owner = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=300)
    created_datetime = models.DateTimeField('date created',auto_now_add=True)
    category = models.CharField(max_length=2, choices=CATEGORIES)
    favorite = models.BooleanField()
    uuid = models.CharField(max_length=100)
    published = models.BooleanField()
    def __unicode__(self):
        return self.title

#class Categories(models.Model):
#    category_id = models.IntegerField()
#    description = models.CharField(max_length=20)
#    def __unicode__(self):
#        return self.description


