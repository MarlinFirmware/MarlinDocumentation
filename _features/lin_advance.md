---
title:        Linear Advance
description:  Nozzle pressure control to improve print quality

author: Sebastianv650, Sineos
category: [ features, developer ]
---

<!-- ## Background -->

In condizioni predefinite, il movimento dell'asse dell'estrusore viene trattato allo stesso modo degli assi XYZ. Il motore dell'estrusore si muove in proporzione lineare rispetto a tutti gli altri motori, mantenendo esattamente lo stesso profilo di accelerazione e i punti di avvio / arresto. Ma un estrusore non è un sistema lineare, quindi questo approccio porta, molto ovviamente, al materiale extra che viene estruso alla fine di ogni movimento lineare.

Prendi come esempio il comune cubo di prova. Anche con la migliore calibrazione, gli angoli di solito non sono nitidi, ma sembrano "goffi". Il riempimento solido superiore mostra la rugosità in cui la direzione di stampa cambia sui perimetri. Questi problemi sono minori o addirittura impercettibili a basse velocità di stampa, ma diventano più evidenti e problematici all'aumentare della velocità di stampa.

La calibrazione del flusso può essere d'aiuto, ma ciò può portare a un'estrusione insufficiente quando si creano nuove linee. Alcuni slicer includono un'opzione per terminare l'estrusione prima di aver completato il percorso, ma questo aggiunge più complessità al codice G e deve essere ricalibrato per temperature e materiali diversi.

Siccome il problema è pressione, LIN_ADVANCE elimina l'estrusione dagli altri assi per produrre la pressione corretta all'interno dell'ugello, adattandosi alla velocità di stampa. Una volta che il Linear Advance è regolato correttamente, i bordi goffi e il riempimento solido ruvido dovrebbero essere quasi eliminati. 
<br>
# Vantaggi

-  Migliore precisione dimensionale grazie alla riduzione dei bordi goffi.
-  Sono possibili velocità di stampa più elevate senza alcuna perdita di qualità di stampa, a condizione che l'estrusore sia in grado di gestire i cambiamenti di velocità necessari.
-   La qualità di stampa visibile e tangibile viene aumentata anche a velocità di stampa inferiori.
-   Nessuna necessità di valori di accelerazione e jerk elevati per ottenere spigoli vivi.

<br>

# Note speciali per v1.5

## Changelog


-  K è ora un valore significativo con l'unità [mm di compressione del filamento necessaria per 1 mm/s di velocità d'estrusione] o [mm/mm/s].
-  Carico ridotti per gli stepper l'ISR,in quanto non vi sono più necessari calcoli. Invece, l'estrusore funziona con uno spostamento di velocità fisso durante la regolazione della pressione. Pertanto questa versione viene eseguita più velocemente.
-  LIN_ADVANCE ora rispetta le limitazioni hardware impostate in Configuration.h, ovvero jerk dell'estrusore. Se le correzioni della pressione richiedono regolazioni più rapide di quelle consentite dal limite dello strappo dell'estrusore, l'accelerazione per questo spostamento di stampa è limitata a un valore che consente di utilizzare la velocità dello strappo dell'estrusore come limite superiore.
-  I movimenti di regolazione della pressione non portano a un estrusore rumoroso come nella v1.0: l'estrusore ora funziona a velocità regolare invece di oscillare tra i multipli della velocità di stampa dell'estrusore.
-  Questa operazione dell'estrusore scorrevole e il rispetto dei limiti di jerk garantiscono che non vengano saltati passi dell'estrusore.


## Nuovo valore K richiesto

Poiché l'unità di K è cambiata, è necessario ripetere la procedura di calibrazione K. Vedi il prossimo capitolo per i dettagli. Mentre i vecchi valori v1 per PLA potrebbero essere tra 30-130, ora puoi aspettarti che K sia intorno a 0,1-2,0.

## LIN_ADVANCE può ridurre l'accelerazione di stampa

Nella v1, se K era impostato su un valore elevato che non poteva essere gestito dalla stampante, la stampante stava perdendo passi e/o usando tutta la sua potenza di elaborazione per eseguire i passi dell'estrusore. Nella v1.5, questo è gestito molto più intelligentemente. LIN_ADVANCE ora controllerà se è in grado di eseguire i passi secondo necessità. Se la velocità dell'estrusore necessaria supera il limite del jerk dell'estrusore, riduce l'accelerazione di stampa per la linea stampata su un valore che mantiene la velocità dell'estrusore entro il limite.

Mentre molto probabilmente non si imbatteranno nelle stampanti direct drive con filamenti come il PLA, ciò avverrà molto probabilmente sulle stampanti bowden, in quanto hanno bisogno di valori K più alti e quindi di adattamenti della velocità più rapidi. Se questo accade in un modo che non vuoi accettare, hai le seguenti opzioni:

-   Controllare l'impostazione del jerk dell'estrusore. Se hai la sensazione che sia impostato su un valore molto conservativo, prova ad aumentarlo.
-   Mantenere l'accelerazione dell'estrusore bassa. Questo può essere ottenuto abbassando l'altezza del layer o la larghezza della linea, ad esempio.
-   Tieni K il più basso possibile. Forse puoi accorciare il tubo Bowden?


## Una nota sulle stampanti bowden contro LIN_ADVANCE

Una nota abbastanza comune durante lo sviluppo di `LIN_ADVANCE` era che i sistemi bowden (e in particolare le stampanti delta) erano pensati per essere più veloci a causa della massa in movimento inferiore. Quindi abbassare l'accelerazione di stampa come descritto sopra sarebbe una soluzione inadeguata. D'altra parte, i sistemi Bowden hanno bisogno di una funzione di avanzamento della pressione in quanto di solito hanno più problemi con i cambi di velocità.


Bene, LIN_ADVANCE è stato sviluppato perché (Sebastianv650) non era soddisfatto della qualità di stampa che ho ottenuto dalla sua stampante direct drive.
Mentre è un possibile dire da punto di vista che abbassare l'accelerazione su una stampante ad bowden (che è destinata a essere veloce) è una cosa brutta, la vedo diversamente: se ti accontenti della qualità di stampa offerta dalla tua configurazione bowden, non staresti leggendo un modo per fare correzioni di pressione,o no?
Quindi forse in questo caso la più alta velocità massima è del tutto inutile.I bowdens sono un'opzione per mantenere la massa in movimento bassa e quindi consentire velocità di movimento più elevate, ma non aspettatevi che diano la stessa precisa capacità di posa del filamento rispetto a quella diretta. È come dipingere un quadro: prova a dipingere con un pennello lungo 1 metro, afferrando l'estremità posteriore del manico che è fatto di gomma. Anche se provi a compensare la punta di pennello traballante (che è fondamentalmente ciò che fa LIN_ADVANCE), non sarà mai buono come usare un normale pennello.
D'altra parte, se necessiti stampare rapidamente una parte senza particolari esigenze in termini di qualità, non vi è alcun motivo per abilitare LIN_ADVANCE. Per quelle stampe, puoi semplicemente impostare K su 0.

# Calibration
## Generare Un Test Pattern

La documentazione di Marlin fornisce un generatore del modello di calibrazione K-Factor.[K-Factor Calibration Pattern generator](/tools/lin_advance/k-factor.html). Questo script genererà un file G-code che supporta la determinazione di un valore K-Factor appropriato. Il codice G generato stamperà un modello di prova come mostrato nella figura seguente:


![basics](/assets/images/features/lin_advance/k-factor_basics.png)


A partire dal valore di avvio scelto per K, le singole righe verranno stampate da sinistra a destra. Ogni linea consiste in estrusione da 20 mm utilizzando una velocità di stampa lenta, seguita da 40 mm di velocità di stampa veloce e infine conclusa da altri 20 mm di velocità di stampa lenta.

Per ogni nuova riga il fattore K sarà aumentato del valore di passo fattore K impostato, fino al valore finale fornito per K.

<br>

### Considerazioni generali per le impostazioni del modello di prova

 - Gli estrusori [Bowden](http://reprap.org/wiki/Erik%27s_Bowden_Extruder) hanno bisogno di un fattore K più elevato rispetto agli estrusori diretti. Considerate un valore iniziale per K di circa 0,1 fino a un valore finale per K di circa 2,0 per LIN_ADVANCE v1,5 o circa 30 fino a un valore finale per K di circa 130 per la v1.0.
    Il miglior K-Factor da utilizzare nella produzione dipende da
	 - Tipo di filamento Filamenti estremamente flessibili come Ninjaflex potrebbero non funzionare affatto.
	 - Temperatura di stampa
         - Caratteristiche dell'estrusore: Bowden vs. estrusore diretto, lunghezza bowden, lunghezza libera del filamento nell'estrusore, ecc.
         - Dimensione e geometria dell'ugello.
 -  I passi / valore dell'estrusore devono essere calibrati con precisione. [calibrated precisely](http://reprap.org/wiki/Triffid_Hunter%27s_Calibration_Guide#E_steps). La calibrazione è consigliata a basse velocità per evitare ulteriori influenze.
 - Ridurre al minimo il gioco causato dall'estrusore con ingranaggi [geared extruder](http://reprap.org/wiki/Wade%27s_Geared_Extruder) o dai raccordi a pressione. Poiché non influenzerà il fattore K, può causare strani rumori dall'estrusore a causa del controllo della pressione.

> Ripetere la calibrazione, se uno qualsiasi dei parametri precedenti cambia.


<br>

## Valutazione del modello di calibrazione


La transizione tra fasi di velocità di stampa lenta e fasi di velocità di stampa veloce sono i punti di interesse per determinare il miglior K-Factor corrispondente. L'illustrazione seguente mostra una vista ingrandita di una linea in cui il fattore K è troppo basso:



![low](/assets/images/features/lin_advance/k-factor_low.png)


| Fase | Descrizione |
|:--:|--|
| 1 | `Velocità di stampa lenta` |
| 2 | Inizio della `velocità di stampa veloce`. La pressione accumulata nell'ugello (= quantità di materiale estruso) è in ritardo rispetto all'accelerazione della testina di stampa. Ciò si traduce in materiale troppo piccolo e una linea affamata. Verso la fine di questa fase, la pressione sta raggiungendo il suo valore previsto.
| 3 | Estrusione e movimento della testina di stampa sono sincronizzati. La larghezza della linea nominale viene estrusa |
| 4 | Inizio della decelerazione verso la `velocità di stampa lenta`. Qui si può osservare l'opposto della fase 2: la diminuzione della pressione nell'ugello è in ritardo rispetto alla decelerazione della testina di stampa. Ciò si traduce in estrusione di troppo materiale |
| 5 | Inizio della fase di `velocità di stampa lenta`. Ancora la pressione nell'ugello non è in sincronia con la quantità di estrusione prevista e la linea soffre di sovraestrusione. |
| 6 | La `velocità di stampa lenta` si è stabilizzata. |

Un K-Factor troppo alto sostanzialmente inverte l'immagine sopra. La quantità estrusa verrà superata all'inizio di un'accelerazione e morirà di fame nella fase di decelerazione.
<br>
> La linea di test, che ha una transizione fluida e quasi invisibile o invisibile tra le diverse fasi di velocità, rappresenta il miglior K-Factor corrispondente. 

<br>

# Impostazione del fattore K per la produzione

## Considerazioni prima di usare Linear Advance

 - Alcune slicer hanno opzioni per controllare la pressione dell'ugello. I nomi comuni sono: Pressure advance, Coast at end, extra restart length after retract. Disabilitare queste opzioni in quanto interferiranno con Linear Advance.
 - Disabilita anche le opzioni come wipe while retract o il combing. Non ci dovrebbe essere quasi nessun rimasuglio, una volta trovato il corretto K-Factor.
 - Ricontrolla la distanza di ritrazione, una volta che Linear Advance è calibrato e funziona bene. Può anche essere pari a 0, poiché il controllo della pressione riduce quasi a zero la pressione del materiale alla fine di una linea.
 
## Le seguenti considerazioni non sono più un problema con LIN_ADVANCE versione 1.5
 - Questa funzione aggiunge un carico extra alla CPU (e probabilmente più usura sull'estrusore). È consigliabile utilizzare una velocità di comunicazione di 115200 baud o inferiore per evitare errori di comunicazione e movimenti "strani".
 - Il software host di stampa deve utilizzare numeri di riga e checksum. (Questo è disabilitato per impostazione predefinita ad es. In Simplify3D)
 - In teoria non dovrebbero esserci movimenti "extra" prodotti da LIN_ADVANCE. Se venissero prodotti movimenti extra, ciò porterebbe ad aumentare l'usura su parti più fragili come gli ingranaggi stampati di un estrusore Wade.


## Salvare il valore K nel Firmware
Se viene utilizzato solo un materiale di stampa, il modo migliore è impostare K-Factor all'interno di Configuration_adv.h e riflashare il firmware::

    /**
    * Implementation of linear pressure control
    *
    * Assumption: advance = k * (delta velocity)
    * K=0 significa disabilitato.
    * Vedere la documentazione di Marlin per le istruzioni di calibrazione.
    */
    #define LIN_ADVANCE

    #if ENABLED(LIN_ADVANCE)
    #define LIN_ADVANCE_K <your_value_here>

## Aggiunta del fattore K allo script iniziale del codice G
[G-code Start Scripts](http://reprap.org/wiki/Start_GCode_routines) sono supportati da vari strumenti di slicing. Il grande vantaggio di impostare K-Factor tramite questi metodi è che può essere facilmente modificato, ad es. quando si passa a un altro materiale. Il fattore K viene definito aggiungendo il comando M900 Kxx alla fine dello script di avvio, dove xx è il valore determinato con il modello di test sopra riportato.

Il capitolo seguente indica a grandi linee dove trovare il campo in cui mettere il valore per alcuni slicers.

**Nota 1:**

Con il metodo Script avvio G-code, la funzione deve ancora essere attivata nel firmware come descritto in [Saving the K-Factor in the Firmware](#saving-the-k-factor-in-the-firmware). Si consiglia di impostare `#define LIN_ADVANCE_K` a 0, che disattiva efficacemente il valore del firmware codificato. In questo caso viene utilizzato solo il fattore K impostato tramite lo script di avvio.

**Nota 2:**

Gli script di avvio del codice G mostrati sono personalizzati per ogni stampante e gusto personale. Questo è solo inteso a dimostrare dove può essere applicata l'impostazione di K-Factor.

<br>
### Cura
 *Impostazioni* ---> *Stampante* ---> *Gestione Stampante* ---> *Impostazioni macchina*

![cura](/assets/images/features/lin_advance/cura.png)
<br><br><br>
### Slic3r
*Impostazioni* ---> *Impostazione stampante* ---> *Personalizza G-code*

![slic3r](/assets/images/features/lin_advance/slic3r.png)
<br><br><br>
### Simplify 3D
* Edita impostazioni processo * ---> * Mostra Avnzate * --> *Scripts* ---> *Personalizza G-code**

![s3d](/assets/images/features/lin_advance/s3d.png)
<br><br>
# Informazioni per gli sviluppatori

## Informazioni generali

La forza richiesta per spingere il filamento attraverso l'apertura dell'ugello dipende, in parte, dalla velocità con cui il materiale viene spinto nell'ugello. Se il materiale viene spinto più velocemente (= stampa veloce), il filamento deve essere compresso di più prima che la pressione all'interno dell'ugello sia sufficientemente alta da iniziare l'estrusione del materiale.

Per una singola linea veloce stampata, questo si traduce in sottoestrusione al punto iniziale della linea (il filamento viene compresso, ma la pressione non è abbastanza alta) e la sovraestrusione con un blob alla fine della linea (il filamento è ancora compresso quando il motore E si ferma, con conseguente trafilamento).

Per una stampa completa, questo porta a bordi sanguinanti agli angoli (gli angoli sono punti di arresto / fine di linee) e in casi estremi anche spazi tra i perimetri dovuti alla sottoestrusione ai loro punti di partenza.

## Versione 1.5

La versione 1.5 gestisce la correzione della pressione in un modo leggermente diverso per raggiungere i seguenti obiettivi:

- rispettare il jerk dell'estrusore
- assicurare un movimento dell'estrusore uniforme senza tintinnare
- ridurre il carico all'interno dello stepper ISR

Lo fa calcolando un offset di velocità dell'estrusore all'interno del pianificatore per il segmento specificato. Se abbiamo un'accelerazione lineare, allora eseguiremo le necessarie fasi di avanzamento appena in tempo, quindi abbiamo raggiunto tutti i passi di avanzamento necessari proprio quando la parte di accelerazione è finita. Come Marlin usa un'approssimazione per il calcolo dell'accelerazione all'interno dell'ISR, questo non è perfettamente vero, ci arriveremo più tardi. Se lo spostamento di velocità necessario supera il jerk dell'estrusore consentito, l'accelerazione di stampa per questo segmento viene ridotta ad un valore inferiore, in modo che il jerk dell'estrusore non venga più superato.Questo è paragonabile al controllo che Marlin fa per ciascun asse, ad esempio se abbiamo un'accelerazione di stampa di 2000mm / s² all'asse X max. l'accelerazione è impostata su 500mm / s², l'accelerazione di stampa è ridotta a 500mm / s². Durante il calcolo del trapezio, LIN_ADVANCE calcola la quantità necessaria di passi di avanzamento alla velocità di crociera e alla velocità finale (= velocità al e del blocco).

Quando questo blocco viene eseguito dall'ISR stepper, l'estrusore viene impostato su una frequenza che rappresenta l'offset di velocità calcolato. La fase avanzata viene eseguita insieme ai normali passi E. Durante il tempo di esecuzione del blocco, la pressione verrà anticipata fino a quando non viene raggiunta la quantità di step aggiuntivo precalcolata o quando viene avviata la decelerazione. Durante la decelerazione riduciamo la quantità del passo di anticipo fino a raggiungere la quantità per la velocità finale o il blocco si conclude. Questi controlli sono necessari poiché Marlin usa un'approssimazione per il calcolo dell'accelerazione come menzionato sopra. Pertanto, ad esempio, potremmo non raggiungere la pressione finale alla fine del movimento in modo perfetto, ma ciò non è importante in quanto questo errore non si accumula.

Il prossimo aggiornamento potrebbe includere una migliore gestione delle mosse a larghezza variabile. Su un percorso a larghezza variabile è possibile che sia necessario ridurre la pressione durante l'accelerazione, ad esempio quando la linea successiva è molto più stretta della precedente. Pertanto LIN_ADVANCE dovrebbe verificare la direzione effettiva dell'estrusore necessaria. Un altro caso da considerare è il riempimento dello spazio alla punta di un triangolo: in questo caso Marlin si muoverà con una velocità costante, ma la velocità dell'estrusore e quindi la pressione necessaria diventa sempre più piccola quando ci avviciniamo alla punta del triangolo. Dovremmo adattare la pressione dell'ugello alla velocità max (velocità dello strappo dell'estrusore) . Poiché il gap gap viene eseguito a velocità piuttosto basse dalla maggior parte degli slicer, dobbiamo decidere se questo carico extra valga la pena. Su schede a 32 bit in cui le prestazioni di calcolo non sono probabilmente un problema, è logico in ogni caso.

## Versione 1.0
Il controllo della pressione LIN_ADVANCE gestisce questa lunghezza libera del filamento come una molla, dove K è una costante di molla. Quando l'ugello inizia a stampare una linea, prende la velocità di estrusione come riferimento. Oltre alla necessaria lunghezza di estrusione per un segmento di linea, definito dallo slicer, calcola la compressione extra necessaria del filamento per raggiungere la pressione dell'ugello necessaria in modo che la lunghezza dell'estrusione definita dall'affettatrice sia realmente estrusa. Questo viene fatto in ogni ciclo dell'ISR stepper.

Durante la decelerazione, la compressione del filamento viene nuovamente rilasciata dalla stessa formula: advance_steps = delta_extrusion_speed * K. Durante la decelerazione, delta_extrusion_speed è negativo, quindi i valori di advance_steps sono negativi che portano a un movimento retratto (o rallentato), rilassando nuovamente il filamento.

La formula di base  (`advance_steps = delta_extrusion_speed * K`) è la stessa del famoso controllo di pressione JKN, ma con un'importante differenza: JKN calcola la somma di tutti i passaggi dell'estrusore necessari all'interno del ciclo del pianificatore e li distribuisce equamente su ogni stepper di accelerazione e decelerazione. Ciò porta alla distribuzione errata delle fasi avanzate, determinando un risultato di stampa imperfetto. LIN_ADVANCE calcola i passaggi extra al volo in ogni loop, quindi applicando i passaggi richiesti esattamente dove necessario.

Per ulteriori dettagli e grafici dare un'occhiata a questa presentazione [diapositive 7-9](https://drive.google.com/file/d/0B5UvosQgK3adaHVtdUI5OFR3VUU/view).

In Marlin, tutto il lavoro è fatto nei file stepper * e planner *. Nel loop del planner, LIN_ADVANCE verifica se una mossa ha bisogno di controllo della pressione. Questo vale solo per le mosse di stampa, non per le mosse di traslazione e le mosse solo dell'estrusore (come retrazione e prime).

Nel metodo Stepper :: isr, LIN_ADVANCE calcola il numero di passaggi aggiuntivi necessari per raggiungere la pressione dell'ugello richiesta. Per evitare passaggi mancanti, non li esegue tutti in una volta, ma li distribuisce su future chiamate alla routine del servizio di interrupt.

Nella v1.0 non viene verificato se l'accelerazione, la velocità o lo strappo dell'estrusore superino i limiti impostati in Configuration.h!
