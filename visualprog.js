define ( function (require, exports, module) {
    main.consumes = ["Editor", "editors"];
    main.provides = ["snlab.devopen.visualprog"];

    return main;

    function main(options, imports, register){
        var Editor = imports.Editor;
        var editors = imports.editors;
        var _ = require("lodash");
        var extensions = ["mapleml"]; //target extensions
        //register editor
        var handle = editors.register(
            "visualprog", "Visual Programming Editor", VisualEditor, extensions
        );
        var plugin = new Editor("snlab.devopen.visualprog", main.consumes, extensions);


        function VisualEditor() {

            var container;
            var currentSession;
            var activeDocument;
        }

        function load(){

        }

        plugin.on("load", function() {
            load();
        });

        plugin.on("unload", function() {

        });

        plugin.freezePublicAPI({

        });

        register(null, {
            "snlab.devopen.visualprog": plugin
        });

    }
});
