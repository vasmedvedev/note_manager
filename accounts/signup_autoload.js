Ext.onReady(function(){
    var simple = new Ext.form.FormPanel({
        standardSubmit: true,
        frame:true,
        title: 'Register',
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
                fieldLabel: 'E-mail',
                vtype:'email',
                name: 'email',
                allowBlank:false
            },
            {
                fieldLabel: 'Password',
                inputType:'password',
                name: 'password',
                allowBlank:false
            },
            {
                fieldLabel: 'Retype password',
                inputType:'password',
                name: 'retyped_password',
                allowBlank:false
            },
            {
                contentEl: "hidden-csrf"
            }

        ],
        buttons: [{
            text: 'Submit',
            handler: function() {
                simple.getForm().getEl().dom.action = 'signup_form';
                simple.getForm().getEl().dom.method = 'POST';
                simple.getForm().submit();
                     }
                    }]


    });
    simple.render('signup_div');



});
