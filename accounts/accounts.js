Ext.onReady(function(){
 
    var simple = new Ext.form.FormPanel({
        standardSubmit: true,
        frame:true,
        title: 'Log In',
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
                allowBlank:false
            },
            {   
                fieldLabel: 'Password',
                inputType:'password',
                name: 'password',
                allowBlank:false
            }
 
        ],
        buttons: [{
            text: 'Submit',
            handler: function() {
        simple.getForm().getEl().dom.action = 'test.php';
            simple.getForm().getEl().dom.method = 'POST';
                simple.getForm().submit();
            }
            },

            {
            text: 'Sign Up',
            handler: function() {window.open('signup');}
            }
        ]
 
 
    });
    simple.render('loginform');
 
 
 
});
