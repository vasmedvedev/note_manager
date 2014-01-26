Ext.onReady(function(){
    var p = new Ext.Panel({
        title: category + ' ' + title,
        renderTo: 'published_note',
        width:400,
        height: 200,
        style: {
            "margin": 'auto',
            "margin-top": '200px',
            "text-align": 'center'
        },
        layout: 'hbox',
        layoutConfig: {
            align: 'middle'
        },
        html: text
    });
})
