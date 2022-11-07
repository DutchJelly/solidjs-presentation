## Outline

1. Het doel van JS UI libraries, en hun approach
2. Hoe pakt solidjs dit aan?
3. Snelheidsdemo
4. Thinking solidjs (omschrijven van simpele react app naar solidjs)
5. Bundlegroottes solidjs vs react
6. Vergelijking andere frameworks (vooral svelte)
7. Eco system: handige ingebouwde dingen
8. Router

De core van eigenlijk alle frameworks blijft het updaten van de DOM op basis van een bepaalde state die we in JS bijhouden. En.. natuurlijk om dit makkelijk te maken voor de programmeur door bepaalde abstracties.

React doet dit door de diffen met een kopie van de DOM, een virtual DOM. Angular doet dit ook op zijn eigen manier.

Ik wil schetsen dat het raar is om te diffen om changes te detecten. Het werkt prima, maar: overhead en ouderwets. In theorie is het gewoon een onnodige abstractie.
