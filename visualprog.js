define ( function (require, exports, module) {
    main.consumes = ["Editor", "editors", "ui", "layout", "settings"];
    main.provides = ["snlab.devopen.visualprog"];

    return main;

    function main(options, imports, register){
        var Editor = imports.Editor;
        var editors = imports.editors;
        var _ = require("lodash");
        var ui = imports.ui;
        var layout = imports.layout;
        var settings = imports.settings;
        var extensions = ["mapleml"]; //target extensions
        //register editor
        var handle = editors.register(
            "visualprog", "Visual Programming Editor", VisualEditor, extensions
        );
        function VisualEditor() {
            var plugin = new Editor("snlab.devopen.visualprog", main.consumes, extensions);

            var BGCOLOR = {
                "flat-light": "#F1F1F1",
                "light": "#D3D3D3",
                "light-gray": "#D3D3D3",
                "dark": "#3D3D3D",
                "dark-gray": "#3D3D3D"
            }

            //Public API
            plugin.freezePublicAPI({});

            // Initialize the Editor
            plugin.load(null, "snlab.devopen.visualprog");

            function renderOnCanvas(value, canvas){

            }
            function hideProgress(){}
            function showProgress(){}
            function serializeValue(){}
            function getSerializedSelection(){}
            function removeSelection(){}
            function replaceSelection(){}

            var container, contents, session;
            plugin.on("draw", function (e) {
                container = e.htmlNode;
                ui.insertHtml(container, require("text!./editor.html"), plugin);
                contents = container.querySelector(".contents");
                contents.addEventListener("scroll", function () {
                    currentSession.scrollLeft = this.scrollLeft;
                    currentSession.scrollTop = this.scrollTop;
                })
            })

            plugin.on("documentLoad", function (e) {
                var doc = e.doc;
                session = doc.getSession();
                session.canvas = document.createElement("canvas");
                session.update = function () {
                    contents.scrollLeft = session.scrollLeft;
                    contents.scrollTop= session.scrollTop;
                }

                doc.on("setValue", function (e) {
                    renderOnCanvas(e.value, session.canvas);
                }, session);

                doc.on("getValue", function (e) {
                    return doc.changed ? serializeValue(session) : e.value;
                }, session);

                doc.on("progress", function (e) {
                    if(e.complete)
                        hideProgress();
                    else
                        showProgress(e.loaded, e.total);
                }, session);

                doc.tab.on("setPath", setTitle, session);
                function setTitle(e){
                    var path = doc.tab.path;
                    doc.title = require("path").basename(path);
                    doc.tooltip = path;
                }
                setTitle();

                function setTheme(e) {
                    var tab = doc.tab;
                    var isDark = e.theme == "dark";
                    tab.backgroundColor = BGCOLOR[e.theme];
                    if (isDark) tab.classList.add("dark");
                    else tab.classList.remove("dark");
                }
                layout.on("themeChange", setTheme, session);
                setTheme({theme: settings.get("usr/general/@skin")});

                doc.on("unload", function () {
                    session.kill;
                    if(session.terminal)
                        session.terminal.destory();
                })
            })

            var currentSession, currentDocument;
            plugin.on("documentActivate", function (e) {
                currentDocument = e.doc;
                currentSession = e.doc.getSession();

                if(contents.firstChild)
                    contents.removeChild(contents.firstChild);
                contents.appendChild(currentSession.canvas);
                session.update();
            })

            plugin.on("copy", function (e) {
                var data = getSerializedSelection();
                e.clipboardData.setData("text/plain", data);
            })

            plugin.on("cut", function (e) {
                var data = getSerializedSelection();
                removeSelection();
                e.clipboardData.setData("text/plain", data);
            })

            plugin.on("paste", function (e) {
                var data = e.clipboardData.getData("text/plain");
                if(data != false)
                    replaceSelection(data);
            })

            plugin.on("getState", function (e) {
                var session = e.doc.getSession();

                e.state.scrollTop = session.scrollTop;
                e.state.scrollLeft = session.scrollLeft;
            })

            plugin.on("setState", function (e) {
                var session = e.doc.getSession();
                session.scrollTop = e.state.scrollTop;
                session.scrollLeft = e.state.scrollLeft;
                if(session == currentSession)
                    session.update();
            })

            plugin.on("focus", function () {
                contents.className = "contents focus";
            })
            plugin.on("blur", function () {
                contents.className = "contents";
            })

            return plugin;
        }

        register(null, {
            "snlab.devopen.visualprog": handle
        })
    }
});
