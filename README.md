Memrise is a well-designed application, but it is unfortunate that its Japanese courses do not have an option to display text using kana.

So, I wrote this userscript that will look at all the text on pages on memrise.com and attempt to convert non-english words into Kana.
It will also copy the old text to the "title" attribute of any HTML elements it converts, so if you hover over the text, you will see the original text.
If the element already had a title attribute, the old text will be added to the end of the existing title attribute, placed in parentheses.

It's not perfect (because the English dictionary it uses is not perfect, and also because it will convert some usernames), but it works well enough for my use.

This userscript doesn't depend on any functionality specific to Memrise, so you should be able to use it on other websites simply by changing the match directive.
