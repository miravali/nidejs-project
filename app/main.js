requirejs.config({
    "baseUrl": "../",
    "waitSeconds": 0,
    "paths": {
        "compUrl": "./",
        "hostMain": "app",
        "config": "appConfig",
        "text": "library/js/text",
        "appFonts":"fonts",
        "modernizer": "library/js/modernizr",
        "jquery": "library/js/jquery.min",
        "angular": "library/js/angular/angular.min",
        "angular-route": "library/js/angular/angular-route.min",
        "angular-uirouter": "library/js/angular/angular-ui-router.min",
        "angular-material": "library/js/angular/angular-material.min",
        "angular-animate": "library/js/angular/angular-animate.min",
        "angular-aria": "library/js/angular/angular-aria.min",
        "angular-sanitize": "library/js/angular/angular-sanitize.min",
        "angular-localData": "library/js/angular/angular-storage.min",
        "angular-dragdrop": "library/js/angular/angular-dragdrop.min",
        "dragdropPolyfill": "library/js/DragDropTouch", //For Mobile Devices
        "interact": "library/js/interact",
        "swiffy": "library/js/swiffy_runtime",
        "jqImage": "library/js/imagesloaded.pkgd",
        "lodash": "library/js/lodash.min",
        "froala-editor": "library/js/froalaeditor/froala-editor.min",
        "froala-table": "library/js/froalaeditor/froala-table.min",
        "froala-fontfamily": "library/js/froalaeditor/froala-fontfamily.min",
        "froala-fontsize": "library/js/froalaeditor/froala-fontsize.min",
        "froala-align": "library/js/froalaeditor/froala-align.min",
        "froala-colors": "library/js/froalaeditor/froala-colors.min",
        "froala-lists": "library/js/froalaeditor/froala-lists.min",
        'paragraph_format': "library/js/froalaeditor/paragraph_format.min",


        "d3": "library/js/d3js/d3", //Added for Chart
        "nv-d3": "library/js/d3js/nv.d3", //Added for Chart
        "angular-nvd3": "library/js/d3js/angular-nvd3", //Added for Chart   
        "jquery-single": "library/js/jquery.singleclick",
        "moment": "library/js/moment-locale.min",
        "moment-hijri": "library/js/moment-hijri",
        "persian": "library/js/persian",
        "angular-persian": "library/js/angularpersian",
        "graphql": "library/js/graphql.min"

    },
    "shim": {
        "jquery": {
            "exports": "jquery"
        },
        "angular": {
            "exports": "angular",
            "deps": ["jquery"]
        },
        "angular-material": {
            "deps": ["angular-animate", "angular-aria"]
        },
        "angular-route": {
            "deps": ["angular"]
        },
        "angular-uirouter": {
            "deps": ["angular"]
        },
        "angular-animate": {
            "deps": ["angular"]
        },
        "angular-dragdrop": {
            "deps": ["angular"]
        },
        "angular-aria": {
            "deps": ["angular"]
        },
        "angular-sanitize": {
            "deps": ["angular"]
        },
        "swiffy": {
            "exports": "swiffy"
        },
        "jqImage": {
            "deps": ["jquery"]
        },
        "jquery-single": {
            "deps": ["jquery"]
        },
        "froala-editor": {
            "exports": "froala-editor",
            "deps": ["jquery"]
        },
        "froala-table": {
            "exports": "froala-table",
            "deps": ["froala-editor"]
        },
        "froala-fontfamily": {
            "exports": "froala-fontfamily",
            "deps": ["froala-editor"]
        },
        "froala-fontsize": {
            "exports": "froala-fontsize",
            "deps": ["froala-editor"]
        },
        "froala-align": {
            "exports": "froala-align",
            "deps": ["froala-editor"]
        },
        "froala-colors": {
            "exports": "froala-colors",
            "deps": ["froala-editor"]
        },
        "froala-lists": {
            "exports": "froala-lists",
            "deps": ["froala-editor"]
        },
        "paragraph_format": {
            "exports": "paragraph_format",
            "deps": ["froala-editor"]
        },

        "d3": {
            "exports": "d3"
        },
        "nv-d3": {
            "exports": "nv-d3",
            "deps": ["d3"]
        },
        "angular-nvd3": {
            "exports": "angular-nvd3",
            "deps": ["angular", "nv-d3"]
        },
        "moment": {
            "deps": ["angular"]
        },
        "moment-hijri": {
            "deps": ["moment"]
        },
        "persian": {
            "deps": ["angular"]
        },
        "angular-persian": {
            "deps": ["angular", "persian"]
        }
    }
});

require(['hostMain'], function (app) {
    var user = localStorage.getItem('USER');

    // var user = {
    //     "name": "teacher nooor",
    //     "picture": "https://lh6.googleusercontent.com/-JhPniU_O8q8/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7oMcbXCB7OYiQW-LZ2LK6fsN2fDiQ/s96-c/photo.jpg",
    //     "email": "nooor.tch1@gmail.com",
    //     "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJteS1zZXJ2aWNlQGVsZXNzb24ifSwidXNlcklkIjoiY2poOHB5Yjk1MDBwNTA3MTgxZ3ZoYXI3YyIsIm9yZ2FuaXphdGlvbklkIjoiY2poOG91d280MDBnazA3MThtZHh0dmM2NCIsImlhdCI6MTUzMTgwNDczNCwiZXhwIjoxNTMxODA4MzM0fQ.ccpCSMsdXeOcF1omBHhkd7pW7XN7-kdy0uJZ9dLNYI0",
    //     "id": "cjh8pyb9500p507181gvhar7c",
    //     "organizationId": "cjh8ouwo400gk0718mdxtvc64",
    //     "role": "TEACHER",
    //     "organizationName": "fakieh schools"
    // }
    var auth_token = new RegExp('[\?&]' + 'auth' + '=([^&#]*)').exec(window.location.href);
    if (auth_token == null) {
        auth_token = null;
    } else {
        auth_token = auth_token[1] || 0;
    }
    if (user == null && auth_token == null) {
        alert("User not authorized");
        return;
    }
    else {
        app.init();
    }
    //$(".appLoader").hide();

});