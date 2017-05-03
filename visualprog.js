define ( function (require, exports, module) {
    main.consumes = ["Editor"];
    main.provides = ["snlab.devopen.visualprog"];

    return main;

    function main(options, imports, register){
        var Editor = imports.Editor;
        var _ = require("lodash");
        var extensions = ["mapleml"]; //target extensions
        //register editor
        var handle = editors.register(
            "visualprog", "Visual Programming Editor", VisualEditor, extensions
        );

        function VisualEditor() {
            var plugin = new Editor("snlab.org", main.consumes, extensions);

            var container;
            var currentSession;
            var activeDocument;

            alert("Visual Editor");
        }
    }
});