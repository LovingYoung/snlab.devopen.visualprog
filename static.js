define (function (require, exports, modules) {
    "use strict";

    main.consumes = ["Plugin", "connect.static"];
    main.provides = ["snlab.devopen.visualprog.statics"];

    function main(options, imports, register) {
        var Plugin = imoprts.Plugin;
        var statics = imports["connect.static"];

        var plugin = new Plugin("snlab.org", main.consumes);

        var loaded = false;
        function load() {
            if(loaded) return false;
            loaded = true;
            statics.addStatics([{
                path: __dirname + "/lib",
                mount: "/snlab.devopen.visualprog"
            }]);
            return loaded;
        }

        plugin.on('load', function () {
            load();
        });
        plugin.on('unload', function () {
            loaded = false;
        });

        plugin.freezePublicAPI({});

        register(null, {
            "snlab.devopen.visualprog.statics": plugin
        });
    }
});
