Ext.onReady(function(){
    Ext.Ajax.request({
    url: 'ajax',
    success: function(response) {
        var obj = Ext.decode(response.responseText);
        var simple = new Ext.form.FormPanel({
        standardSubmit: true,
        frame:true,
        title: 'Home page of ' + username,
        width: 350,
        defaults: {width: 230},
        defaultType: 'textfield',
        style: {
        "margin": 'auto',
        "margin-top": '200px'
        },
        items: [{
                fieldLabel: 'Username',
                name: 'username',
                allowBlank:false,
                value: username
                },
                {
                fieldLabel: 'Received username',
                name: 'username2',
                value: obj.username
                }
]
                    });
    simple.render('notes');
    },
    failure: function(response, opts) {
        console.log('server-side failure with status code ' + response.status);
    },
    params: { 'username': username, 'csrfmiddlewaretoken': Ext.util.Cookies.get('csrftoken') }
});
});
