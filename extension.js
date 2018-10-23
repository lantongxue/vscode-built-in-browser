'use strict';
var vscode = require('vscode');
function activate(context) {
    var BrowserContentProvider = (function () {
        function BrowserContentProvider() {
        }
        BrowserContentProvider.prototype.provideTextDocumentContent = function (uri, token) {
            return "<iframe src=\"" + uri + "\" frameBorder=\"0\" style=\"top: 0; left: 0; position: fixed;width: 100%; height: 100%; \" />";
        };
        return BrowserContentProvider;
    }());
    var provider = new BrowserContentProvider();

    // Register http:// and https://
    vscode.workspace.registerTextDocumentContentProvider('https', provider);
    vscode.workspace.registerTextDocumentContentProvider('http', provider);

    // urlIsValid returns true if url is valid; false otherwise.
    function urlIsValid(url) {
        if(url == '' || typeof url == 'undefined'){
            return false;
        }
        console.log(url);
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return true;
        }
        return false;
    }
    var disposable = vscode.commands.registerCommand('extension.builtinbrowser', function () {
        var opts = {
            prompt: "完整的URL地址：https://www.baidu.com/ or http://www.baidu.com",
            //value: "http://",
            validateInput: function (url) {
                if (urlIsValid(url)) {
                    return null;
                }
                return "Invalid URL.";
            },
        };
        vscode.window.showInputBox(opts).then(function (url) {
            if (!urlIsValid(url)) {
                return;
            }
            
            var uri = vscode.Uri.parse(url);
            vscode.window.showErrorMessage(uri);
            // Determine column to place browser in.
            var col;
            var ae = vscode.window.activeTextEditor;
            if (ae != undefined) {
                col = ae.viewColumn || vscode.ViewColumn.One;
            }
            else {
                col = vscode.ViewColumn.One;
            }
            return vscode.commands.executeCommand('vscode.previewHtml', uri, col).then(function (success) {
            }, function (reason) {
                vscode.window.showErrorMessage(reason);
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map