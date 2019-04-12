'use strict'

var i18nNodeCache = [];
var i18nChangeListeners = [];

function addI18nChangeListener(listener) {
    i18nChangeListeners.push(listener);
}

function loadInternationalization(lang) {
    var internationalization = i18n[lang];
    if (!internationalization) {
        console.error('Attempt to load non-existant internationalization: ', lang);
        return;
    }

    if (i18n.currentLang == lang) {
        return;
    }

    i18n.currentLang = lang;

    if (internationalization.isRtl) {
        document.body.dir = 'rtl';
    } else {
        document.body.dir = 'ltr';
    }

    if (i18nNodeCache.length == 0) {
        var TEXT_NODE_TYPE = 3;
    
        var treeIterator = document.createTreeWalker(document.body);
        while (treeIterator.nextNode()) {
            var node = treeIterator.currentNode;
            if (node.nodeType === TEXT_NODE_TYPE) {
                for (var key of Object.keys(internationalization)) {
                    if (node.textContent.includes('{{i18n.' + key + '}}')) {
                        i18nNodeCache.push({
                            node: node,
                            originalText: node.textContent,
                            key: key
                        });
                    }
                }
            }
        }
    }


    for (var cachedNode of i18nNodeCache) {
        var node = cachedNode.node;
        var originalText = cachedNode.originalText;
        var key = cachedNode.key;
        var value = internationalization[key];
        node.textContent = originalText.replace(new RegExp('{{i18n.' + key + '}}', 'g'), value);
    }

    for (var listener of i18nChangeListeners) {
        listener();
    }
}

$(function() {
    loadInternationalization('he');
});
