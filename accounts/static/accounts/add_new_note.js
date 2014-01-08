Ext.onReady(function(){
    var simple = new Ext.form.FormPanel({
        standardSubmit: true,
        frame:true,
        url: 'submit_new_note',
        action: 'POST',
        title: 'Add new note',
        width: 700,
        height: 350,
        defaults: {width: 230},
        defaultType: 'textfield',
        style: {
        "margin": 'auto',
        "margin-top": '200px'
        },
        items: [{
                fieldLabel: 'Title (100 symbols max)',
                maxLength: 100,
                name: 'title',
                allowBlank:false
                },
            {
                fieldLabel: 'Category',
                xtype:'combo',
                name: 'category',
                allowBlank:false,
                store: new Ext.data.SimpleStore({
                    data: [
                        [1, 'Note'],
                        [2, 'TO DO'],
                        [3, 'Reminder'],
                        [4, 'Link']
                    ],
                    fields: ['value', 'text']
                }),
                emptyText:'Select category...',
                displayField: 'text',
                valueField: 'value',
                hiddenName: 'category',
                triggerAction: 'all',
                editable: false,
                mode: 'local'
                
            },
            {      
                fieldLabel: 'Text (300 symbols max)',
                xtype: 'htmleditor',
                maxLength: 300,
                enforceMaxLength : true,
                name: 'text',
                width: 550,
                height: 200
            },
            {
                name:'csrfmiddlewaretoken',
                xtype: 'hidden',
                value:Ext.util.Cookies.get('csrftoken')
            },
            {
                name:'username',
                xtype: 'hidden',
                value: username
            }
        ],
        buttons: [{
            text: 'Submit',
            handler: function() {
                simple.getForm().standardSubmit=true;
                simple.getForm().submit();
            }
        }]
 
 
    });
    simple.render('add_new_note');
});
