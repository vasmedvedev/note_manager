Ext.onReady(function(){
    var simple = new Ext.form.FormPanel({
        standardSubmit: true,
        frame: true,
        url: 'edit_note',
        action: 'POST',
        title: 'Edit note',
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
                name: 'title',
                maxLength: 100,
                allowBlank:false,
                value: title
                },
            {
                fieldLabel: 'Category',
                xtype:'combo',
                name: 'category',
                allowBlank:false,
                value: category,
                store: new Ext.data.SimpleStore({
                    data: [
                        [1, 'Note'],
                        [2, 'TO DO'],
                        [3, 'Reminder'],
                        [4, 'Link']
                    ],
                    id:0,
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
                xtype: 'textarea',
                maxLength: 300,
                enforceMaxLength : true,
                name: 'text',
                value: text,
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
            },
            {
                name: 'uuid',
                xtype: 'hidden',
                value: uuid
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
    simple.render('edit_note');
});
