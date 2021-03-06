define ( function (require, exports, module) {
  main.consumes = [
    //Editor-related
    "Editor", "editors", "ui", "layout", "settings", "save", "vfs", "fs", "tabManager",
    //Menus-related
    "menus", "commands"];
  main.provides = ["snlab.devopen.visualprog"];

  return main;

  function main(options, imports, register){
    var Editor = imports.Editor;
    var editors = imports.editors;
    var _ = require("lodash");
    var ui = imports.ui;
    var layout = imports.layout;
    var settings = imports.settings;
    var save = imports.save;
    var vfs = imports.vfs;
    var fs = imports.fs;
    var extensions = ["mapleml"]; //target extensions
    var tabManager = imports.tabManager;
    var menus = imports.menus;
    var commands = imports.commands;

    var loadedFiles = {};
    //register editor
    var handle = editors.register(
      "visualprog", "Visual Programming Editor", VisualEditor, extensions
    );
    function VisualEditor() {
      var plugin = new Editor("snlab.devopen.visualprog", main.consumes, extensions);

      /**
       * Add new menu items: to generate java code from mapleml
       */
      menus.addItemByPath("File/Transfer to Java Code", new ui.item({
        command: "mapleml-transferToJava"
      }), 300, plugin);
      menus.addItemByPath("File/Import Topology", new ui.item({
        command: "mapleml-importTopology"
      }), 301, plugin);

      //Public API
      plugin.freezePublicAPI({});

      // Initialize the Editor
      plugin.load(null, "snlab.devopen.visualprog");

      function hideProgress(){}
      function showProgress(){}
      function serializeValue(){return "<xml xmlns=\"http://www.w3.org/1999/xhtml\"> <block type=\"colour_picker\" id=\"bkgJ^bx4CQtKLjI9)FQg\" x=\"270\" y=\"110\"> <field name=\"COLOUR\">#ff0000</field> </block> </xml>"}
      function getSerializedSelection(){}
      function removeSelection(){}
      function replaceSelection(){}

      var container, contents;

      /**
       * Add new commands which in use of creating menu item
       */
      commands.addCommand({
        name: "mapleml-transferToJava",
        exec: function (e) {
          //Get the code of generated java code
          var code = container.getElementsByTagName("iframe")[0].contentWindow.get_code();
          var convertJson = container.getElementsByTagName("iframe")[0].contentWindow.convert_info;
          convertJson = JSON.stringify(convertJson, null, 2);
          //Get current path
          var currentTab = tabManager.focussedTab;
          if(!currentTab) return;
          //Save the tab
          save.save(currentTab);
          var path = currentTab.path;
          if(!path || !path.endsWith('mapleml')) return;
          //Generate java path
          var dir = require("path").dirname(path);
          var javaPath = dir + '/SDNSolution.java';
          var jsonPath = dir + '/convert_info.json';
          //Write code to java file
          fs.writeFile(javaPath, code, function (err) {
            if(err) console.log(err);
            else console.log("Write Successfully");
          });
          fs.writeFile(jsonPath, convertJson, function (err) {
            if(err) console.log(err);
            else console.log("Write convert info successfully");
          });
        }
      }, plugin);

      /**
       * Add new command to import topology from json file
       */
      commands.addCommand({
        name: "mapleml-importTopology",
        exec: function (e) {
          var currentTab = tabManager.focussedTab;
          if(!currentTab) return;
          var path = currentTab.path;
          if(!path || !path.endsWith('mapleml')) return;
          var dir = require("path").dirname(path);
          var topoPath = dir + '/topology.json';
          var filedata;
          fs.readFile(topoPath, function (err, data) {
            if(err) throw err;
            filedata = JSON.parse(data);
            container.getElementsByTagName("iframe")[0].contentWindow.createTopo(filedata);
          })
        }
      }, plugin);


      plugin.on("draw", function (e) {
        container = e.htmlNode;
        ui.insertHtml(container, require("text!./editor_iframe.html"), plugin);
        contents = container.querySelector(".contents");
      });

      plugin.on("documentLoad", function (e) {
        var doc = e.doc;
        var session = doc.getSession();
        var currentPath = doc.tab.path;

        session.iframe = document.createElement("iframe");
        // session.iframe.src = "/static/plugins/snlab.devopen.visualprog/editor.html?"+require("path").basename(doc.tab.path);
        session.iframe.src = "/static/plugins/snlab.devopen.visualprog/editor.html";
        session.iframe.style = "width:100%; height:100%;";
        session.insertedIframe = false;
        session.convertInfo = undefined;

        function loadConvertInfo(){
          var dir = require("path").dirname(currentPath);
          var convertInfoPath = dir + '/convert_info.json';
          fs.readFile(convertInfoPath, function (err, data) {
            if(err) console.log(err);
            else{
              container.getElementsByTagName("iframe")[0].contentWindow.set_convert_info(data);
            }
          })
        }

        session.update = function () {
          if(!session.insertedIframe){
            contents.appendChild(session.iframe);
            session.insertedIframe = true;
          }
        };

        doc.on("load", function () {
          session.update();
        }, session);

        doc.on("setValue", function (e) {
          if(e.value === "") return;
          if(!loadedFiles[currentPath]) {
            var frame = container.getElementsByTagName("iframe")[0];
            frame.addEventListener("load", function () {
              this.contentWindow.clear_blocks();
              this.contentWindow.set_text(e.value);
              loadConvertInfo();
            });
            loadedFiles[currentPath] = true;
          }
        }, session);

        doc.on("getValue", function (e) {
          return doc.changed ? serializeValue() : e.value;
        }, session);

        doc.on("progress", function (e) {
          if(e.complete)
            hideProgress();
          else
            showProgress(e.loaded, e.total);
        }, session);

        doc.tab.on("setPath", setTitle, session);
        function setTitle(e){
          currentPath = doc.tab.path;
          doc.title = require("path").basename(currentPath);
          doc.tooltip = currentPath;
        }
        setTitle();

        function setTheme(e) {
          var tab = doc.tab;
          var isDark = e.theme == "dark";
          if (isDark) tab.classList.add("dark");
          else tab.classList.remove("dark");
        }
        layout.on("themeChange", setTheme, session);
        setTheme({theme: layout.theme});

        function saveGraph(path, value, callback) {
          var blob = container.getElementsByTagName("iframe")[0].contentWindow.get_text();
          vfs.rest(path, {
            method: "PUT",
            body: blob
          }, function (err, data, res) {
            callback(err, data);
          })
        }

        save.on("beforeSave", function (e) {
          if(e.document.editor.type == "visualprog") {
            var path = e.path;
            e.document.value = container.getElementsByTagName("iframe")[0].contentWindow.get_text();
            loadConvertInfo();
            loadedFiles[path] = false;
            return saveGraph;
          }
        });

      });

      plugin.on("documentActivate", function (e) {
        var document = e.doc;
        var session = e.doc.getSession();
        var currentTab = e.doc.tab;
        session.update();
        if(contents.firstChild != session.iframe){
          if(session.iframe.parentNode){
            contents.removeChild(session.iframe);
            save.save(document.tab);
          }
          contents.insertBefore(session.iframe, contents.firstChild);
        }
        // var tabs = tabManager.getTabs();
        //
        // for(var i = 0; i < tabs.length; i++){
        //     if(tabs[i] == currentTab) continue;
        //     for(var j = 0; j < extensions.length; j++){
        //         if(tabs[i].path && tabs[i].path.endsWith(extensions[j])){
        //             var temp_session = tabs[i].document.getSession();
        //             if(temp_session.iframe && temp_session.iframe.parentNode){
        //                 temp_session.iframe.parentNode.removeChild(temp_session.iframe);
        //             }
        //         }
        //     }
        // }
      });

      plugin.on("documentUnload", function (e) {
        var doc = e.doc;
        var session = doc.getSession();
        if(session.iframe.parentNode)
          session.iframe.parentNode.removeChild(session.iframe);
        delete session.iframe;
      });

      plugin.on("copy", function (e) {
        var data = getSerializedSelection();
        e.clipboardData.setData("text/plain", data);
      });

      plugin.on("cut", function (e) {
        var data = getSerializedSelection();
        removeSelection();
        e.clipboardData.setData("text/plain", data);
      });

      plugin.on("paste", function (e) {
        var data = e.clipboardData.getData("text/plain");
        if(data != false)
          replaceSelection(data);
      });

      plugin.on("getState", function (e) {
        var session = e.doc.getSession();

        e.state.scrollTop = session.scrollTop;
        e.state.scrollLeft = session.scrollLeft;
      });

      plugin.on("setState", function (e) {
        var session = e.doc.getSession();
        session.scrollTop = e.state.scrollTop;
        session.scrollLeft = e.state.scrollLeft;
      });

      tabManager.on("tabBeforeClose", function (e) {
        if(!e.tab.path) return;
        for(var i = 0; i < extensions.length; i++) {
          if (e.tab.path.endsWith(extensions[i])) {
            save.save(e.tab);
            break;
          }
        }
      });
      return plugin;
    }

    register(null, {
      "snlab.devopen.visualprog": handle
    })
  }
});
