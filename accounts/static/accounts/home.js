Ext.onReady(function(){

var filters = {
        ftype: 'filters',
        encode: true,
        local: true
    };

var mystore = new Ext.data.JsonStore({
        idProperty: 'pk',
        storeId: 'myStore',
        url:'get_user_notes',
        type:'ajax',
        root:'notes',
        baseParams:{
            username: username,
            csrfmiddlewaretoken: Ext.util.Cookies.get('csrftoken')
        },
        autoLoad: true,
        totalProperty: 'count',
        fields: [{name:'category', mapping:'fields.category'},
                 {name:'uuid', mapping:'fields.uuid'}, 
                 {name:'title', mapping:'fields.title'},
                 {name:'created_datetime', type:'date', mapping:'fields.created_datetime'},
                 {name:'text', mapping:'fields.text'}, 
                 {name:'favorite', type:'bool', mapping:'fields.favorite'},
                 {name:'published', type:'bool', mapping:'fields.published'}]
})

var grid = new Ext.grid.GridPanel({
          frame: true,
          title: 'Notes of user' + ' ' + username,
          width:1000,              
          height:400,
          style: {
          "margin": 'auto',
          "margin-top": '200px'
          },
          store: mystore,
          columns:[
                  {header: 'Title', dataIndex: 'title', width: 100},
                  {header: 'Category', dataIndex: 'category', sortable: true},
                  {header: 'Created', renderer : Ext.util.Format.dateRenderer('d/m/Y'), dataIndex: 'created_datetime', sortable: true},
                  {header: 'Text', width: 300, dataIndex:'text'},
                  {xtype: 'actioncolumn',
                    header: 'Actions',
                    width: 90,
                    sortable: true,
                    dataIndex: 'favorite',
                    items: [{
                        icon:'../static/accounts/edit-delete.png',
                        iconAlign: 'top',
                        tooltip: 'Delete note',
                        handler: function(grid,rowIndex,colIndex){
                            var rec = mystore.getAt(rowIndex);
                            Ext.Ajax.request({
                            url: 'delete_note',
                            params:{
                                username:username,
                                uuid:rec.get('uuid'),
                                csrfmiddlewaretoken:Ext.util.Cookies.get('csrftoken')
                            },
                            success:function(){
                                mystore.load();
                            }
                            })
                        }
                    },
                            {
                         getClass: function(v, meta, rec){
                            if (rec.get('favorite') === true) {
                                return 'filled';
                            } else {
                                return 'empty';
                            }
                         },
                            iconAlign: 'top',
                            handler: function(grid,rowIndex,colIndex){
                                var rec = mystore.getAt(rowIndex);
                                Ext.Ajax.request({
                                url: 'mark_favorite',
                                params:{
                                    username:username,
                                    uuid:rec.get('uuid'),
                                    csrfmiddlewaretoken:Ext.util.Cookies.get('csrftoken')
                                },
                                success:function(){
                                mystore.load();
                                }
                                })
                            }
                    },      {
                         getClass: function(v, meta, rec){
                            if (rec.get('published') === true) {
                                return 'published';
                            } else {
                                return 'not_published';
                            }
                         },
                         iconAlign: 'top',
                         handler: function(grid,rowIndex,colIndex){
                                var rec = mystore.getAt(rowIndex);
                                Ext.Ajax.request({
                                scope:this,
                                url: 'publish',
                                params:{
                                    username:username,
                                    uuid:rec.get('uuid'),
                                    csrfmiddlewaretoken:Ext.util.Cookies.get('csrftoken')
                                },
                                success: function(grid,rowIndex,colIndex){
                                    if (rec.get('published') === false) {
                                        Ext.MessageBox.alert('Info', 'Note published to http://37.192.248.30:8000/accounts/note/' + rec.get('uuid'));
                                    }                                
                                    mystore.load();
                                }
                                })
                            }  
                    },
                         {
                         icon:'../static/accounts/edit.png',
                         iconAlign: 'top',
                         handler: function post_to_url(grid,rowIndex,colIndex) {
                            var form = document.createElement("form");
                            form.setAttribute("method", 'get');
                            form.setAttribute("action", 'edit_note');
                            var rec = mystore.getAt(rowIndex);
                            var params = new Array();
                            params['uuid'] = rec.get('uuid');
                            params['username'] = username;
                                for(var key in params) {
                                    if(params.hasOwnProperty(key)) {
                                        var hiddenField = document.createElement("input");
                                        hiddenField.setAttribute("type", "hidden");
                                        hiddenField.setAttribute("name", key);
                                        hiddenField.setAttribute("value", params[key]);
                                        form.appendChild(hiddenField);
                                    }
                            }
    
                            document.body.appendChild(form);
                            form.submit();
                         }
                        },
                        {
                        icon:'../static/accounts/earth.png',
                        iconAlign: 'top',
                        handler: function (grid,rowIndex,colIndex){
                            var rec = mystore.getAt(rowIndex);
                            Ext.MessageBox.alert('Info', 'Direct link to note is http://37.192.248.30:8000/accounts/note/' + rec.get('uuid'));
                        }
            
                    }]

             }],
          bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: mystore,
            displayInfo: true,
            displayMsg: 'Notes {0} - {1} of {2}',
            emptyMsg: "No notes to display",
            items: [
                '-',
                {
                    xtype:'button',
                    text:'Add new note',
                    scale: 'large',
                    handler: function() {
                        window.location = 'add_new_note';
                    }
                },
                {
                    xtype:'button',
                    text:'Logout',
                    standardSubmit:true,
                    handler: function() {
                        window.location = 'logout/';
                    }
                },
                {
                    xtype:'combo',
                    name: 'filter',
                    emptyText:'Filter by',
                    standardSubmit:true,
                    store: new Ext.data.SimpleStore({
                    data: [
                        [1, 'Title'],
                        [2, 'Category'],
                        [3, 'Date'],
                        [4, 'Favorite']
                    ],
                    fields: ['value', 'text']
                    }),
                    id:1,
                    hiddenName: 'filter',
                    triggerAction: 'all',
                    editable: false,
                    mode: 'local',
                    displayField: 'text',
                    valueField: 'value',
                },
                {
                    xtype:'textarea',
                    name: 'filter_params',
                    height: 20,
                    enableKeyEvents: true,
                    listeners: {
                        'keyup': function() {
                        switch(grid.getBottomToolbar().getComponent(1).getValue()) {
                            case 1:
                                param = 'title';
                                break;
                            case 2:
                                param = 'category';
                                break;
                            case 3:
                                param = 'date';
                                break;
                            case 4:
                                param = 'favorite';
                                break;
                            default:
                                param = 'title';
                        }
                        mystore.filter(param, this.getValue(), true, false);
                        }
                    }
                }
            ]
          })
})
grid.render('notes');
      })

