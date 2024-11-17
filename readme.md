# Tæki og tól
vite: build framework\n
sass: preprocessor fyrir css
eslinter: lint tól fyrir javascript
stylelinter: lint tól fyrir css

# Notkun:
npm run dev: til að byrja development server
npm run build: til að build-a síðuna
npm run preview: til að skoða útkomuna þegar build scriptan er keyrð
npm run sass: býr til style.css út frá öllum .scss skránum
npm run lint: keyrir eslinter og stylelinter samtímis

# Uppsetning:
Allar config skrárnar sem setja upp frameworkin eru í rót verkefnisins.
Allur kóði fyrir síðuna er í src möppuni fyrir utan index.html skrána en hún er aðeins notuð fyrir lýsigögn og grunn uppsetningu síðunnar (<html>, <head> og <body> elementin)
Öll gögn sem síðan notar er í public möppuni
main.js sem er notað til að búa til alla síðuna er í src möppuni
öll javascript föllin sem main.js notar eru skilgreind í öðrum skrám í src/lib skránni
allt css tengd gögn eru í src/css
