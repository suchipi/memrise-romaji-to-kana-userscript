// ==UserScript==
// @name         Memrise Romaji -> Kana
// @namespace    http://suchipi.com/
// @version      0.1
// @description  Tries to autodetect Japanese romaji words on Memrise.com and render them using kana instead
// @author       Suchipi
// @match        http://*.memrise.com/*
// @grant        none
// @require      https://cdn.rawgit.com/WaniKani/WanaKana/master/lib/wanakana.js
// @require      https://cdn.rawgit.com/suchipi/word-list/master/dist/object.js
// ==/UserScript==
/* jshint -W097 */

// WaniKani/wanakana provides the wanakana global
// suchipi/word-list provides the WordListObject global

(function(){
  // A word is english if it's in our list of english wiords
  var isEnglishWord = function(word){
    return WordListObject[word.trim().toLowerCase()];
  };

  // Try to convert a word to kana. If the output isn't 100% kana, the input was probably
  // not romanized japanese text, so return the original word instead of the mixed kana string.
  var convertToKana = function(word){
    var tryWord = wanakana.toKana(word);
    if (wanakana.isKana(tryWord.trim())) {
      return tryWord;
    } else {
      return word;
    }
  };

  // Loop over the words in a string, find non-english words, and try to convert them to kana.
  // Returns the modified string.
  var convertText = function(text) {
    // Optimization speedup for effectively empty strings
    if (text.trim().length == 0) return text;

    var modified = [];
    text.split(' ').forEach(function(word){
      if (!isEnglishWord(word)) {
        modified.push(convertToKana(word));
      } else {
        modified.push(word);
      }
    });
    return modified.join(' ');
  };

  var addElementTitle = function(element, titleText) {
    var oldTitle = element.getAttribute("title");
    var newTitle;
    // If the element has a title...
    if (oldTitle) {
      // And it isn't just the same as what the text was before...
      if (oldTitle.trim() !== titleText)
        // Append the old text (in parentheses) to that title)
        newTitle = oldTitle + " (" + titleText + ")";
    // If the element doesn't have a title...
    } else {
      // Just set it to what the text was before conversion
      newTitle = oldText.trim();
    }

    if (newTitle) element.setAttribute("title", newTitle);
  };

  // Convert a given dom element
  var convertElement = function(element) {
    // Don't mess around inside script tags
    if (element.tagName === "SCRIPT") return;

    // If we've already tried to convert this element, don't try again
    var conversionAttemptedSignifierAttribute = "data-kana-conversion-attempted";
    if (element.getAttribute(conversionAttemptedSignifierAttribute) == "true") return;
    element.setAttribute(conversionAttemptedSignifierAttribute, "true");

    if (element.children) {
      // If the element has no children, it's safe to set its text content
      if (element.children.length === 0) {
        var oldText = element.textContent;
        var newText = convertText(oldText);
        // If the text actually changed...
        if (newText.trim() !== oldText.trim()) {
          element.textContent = newText;
          addElementTitle(element, oldText.trim());
        }
      // If the element has children, we shouldn't mess with its text content.
      // Instead, recurse into its children.
      } else {
        [].slice.call(element.children).forEach(convertElement);
      }
    }
  };

  // Convert all elements present right now
  convertElement(document.body);

  // Convert newly added dom elements in the future
  var observer = new MutationObserver(function(records){
    records.forEach(function(record){
      [].slice.call(record.addedNodes).forEach(function(node) {
        if (!node.tagName) return; // Node, but not element
          convertElement(node);
      });
    });
  }).observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}).call(this);
