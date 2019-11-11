# bdb
 _English version will follow as soon as I find out, what 'Beschlussdatenbank' is in english_
 
 Diese Projekt ermöglichte es euch, Beschlüsse von demokratischen Gremien zu sammeln, sie durchsuchbar zu machen und sie einem Publikum zu veröffentlichen
 Bis jetzt sind die Funktionen noch sehr eingeschränkt, werden aber kontinuierlich ausgebaut. Entstanden ist die Lösung als Projekt des AK IT des [fzs](https://fzs.de). Deswegen enthält das Projekt sehr viel verbandsspezifische Inhalte. Die werden aber Schritt für Schritt entfernt.
 
 ### Installation
 Die Installation ist sehr simpel, einfach das Repo clonen und mit ```npm i``` die Dependencies installieren. Dann mit dem Skript ````bin/bdb.js``` eine config erstellen. Wenn ihr es dann mit ```node index.js``` startet, läuft die Website unter dem Port den ihr in der config angegeben habt.
 
 ### Funktionen
 Bis jetzt kann man Beschlüsse eintragen und mit einer Suchfunktion ihre Titel und Schlagwörter des Textes durchsuchen. Außerdem lässt sich zu jedem Beschluss ein vorformatiertes PDF herunterladen.
 
 ### Roadmap
 ~~In Zukunft sollen die Beschlüsse mit einer stärkeren Query besser durchsuchbar werden. Dafür wird es sich auch anbieten, die Datenbank weg von einer Flat-File-DB zu ändern.~~ Außerdem soll bald eine richtige Konfiguration und die Anmeldung via SSO/SAML für komplexere Projekte implementiert werden.
