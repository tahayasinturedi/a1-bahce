/* Ders hikâyeleri: anahtar = ders numarası (1'den başlar).
   Kahramanlar Taha ile Beyza; olaylar güzel, olumlu, günlük hayattan. Dil A1, şimdiki zaman.
   paragraphs = paragraflar; her paragraf [Almanca cümle, Türkçe çevirisi] çiftlerinden oluşur.
   Hedef kelimeler iki dilde de {metin} ya da {metin=Kelime} ile işaretlenir; "Kelime" o dersteki
   kelimenin artikelsiz Almanca hali (ör. {Äpfel=Apfel}, {elma=Apfel}). */
const STORIES = {
  1: {
    title: "Ein Samstag in der Stadt",
    titleTr: "Şehirde bir cumartesi",
    paragraphs: [
      [
        ["Heute ist Samstag und Beyza hat keine {Arbeit}.", "Bugün cumartesi ve Beyza'nın {işi=Arbeit} yok."],
        ["Am Morgen isst sie ein {Ei} und {Brot}.", "Sabah bir {yumurta=Ei} ve {ekmek=Brot} yiyor."],
        ["Dann fährt sie mit dem {Fahrrad} zur {Bäckerei} an der {Ecke}.", "Sonra {bisikletle=Fahrrad} {köşedeki=Ecke} {fırına=Bäckerei} gidiyor."],
        ["Dort kauft sie noch drei {Äpfel=Apfel} und eine {Flasche} Wasser.", "Orada bir de üç {elma=Apfel} ve bir {şişe=Flasche} su alıyor."],
        ["{Fleisch} kauft sie nicht.", "{Et=Fleisch} almıyor."]
      ],
      [
        ["Danach geht sie zur {Bank}.", "Ardından {bankaya=Bank} gidiyor."],
        ["Der Mann dort fragt: „Haben Sie Ihren {Ausweis}?“", "Oradaki adam soruyor: “{Kimliğiniz=Ausweis} yanınızda mı?”"],
        ["Beyza sucht lange, dann findet sie ihn.", "Beyza uzun süre arıyor, sonra buluyor."]
      ],
      [
        ["Zu Hause schreibt Beyza einen {Brief} an ihre {Familie} in der Türkei:", "Evde Beyza, Türkiye'deki {ailesine=Familie} bir {mektup=Brief} yazıyor:"],
        ["„Hier ist alles gut.", "“Burada her şey yolunda."],
        ["Wie geht es meiner Schwester?", "Kız kardeşim nasıl?"],
        ["Ist sie jetzt Lehrerin?", "Artık öğretmen oldu mu?"],
        ["Hat sie schon ein {Auto}?“", "{Arabası=Auto} var mı?”"],
        ["Auf den Brief schreibt sie die {Adresse}.", "Mektubun üzerine {adresi=Adresse} yazıyor."],
        ["Aber sie macht einen {Fehler} und schreibt die Adresse noch einmal.", "Ama bir {hata=Fehler} yapıyor ve adresi bir kez daha yazıyor."]
      ],
      [
        ["Am Nachmittag fährt sie mit dem {Bus} zum {Bahnhof}.", "Öğleden sonra {otobüsle=Bus} {tren istasyonuna=Bahnhof} gidiyor."],
        ["Dort kauft sie eine {Fahrkarte} zum {Flughafen}.", "Orada {havalimanına=Flughafen} bir {bilet=Fahrkarte} alıyor."],
        ["Morgen kommt ihre Freundin Elif mit ihrem {Bruder} aus Istanbul.", "Yarın arkadaşı Elif, {erkek kardeşiyle=Bruder} birlikte İstanbul'dan geliyor."],
        ["Er ist {Arzt}.", "O bir {doktor=Arzt}."]
      ],
      [
        ["Auf dem Weg nach Hause sieht sie einen großen {Baum}.", "Eve dönerken büyük bir {ağaç=Baum} görüyor."],
        ["Unter dem Baum sind viele {Blumen=Blume}.", "Ağacın altında bir sürü {çiçek=Blume} var."],
        ["Ihre {Farbe} ist gelb.", "{Renkleri=Farbe} sarı."],
        ["Beyza macht ein Foto.", "Beyza bir fotoğraf çekiyor."]
      ],
      [
        ["Am Abend kommt Beyza nach Hause und umarmt Taha.", "Akşam Beyza eve geliyor ve Taha'ya sarılıyor."],
        ["Zusammen hängen sie ein {Bild} an die Wand.", "Birlikte duvara bir {resim=Bild} asıyorlar."],
        ["Dann liest Taha ein {Buch} und Beyza macht Tee.", "Sonra Taha bir {kitap=Buch} okuyor, Beyza da çay yapıyor."],
        ["Später möchten sie zusammen einen {Film} sehen.", "Daha sonra birlikte bir {film=Film} izlemek istiyorlar."],
        ["Der Film ist schön, aber Beyzas {Augen=Auge} werden müde.", "Film güzel ama Beyza'nın {gözleri=Auge} yoruluyor."],
        ["Um zehn Uhr gehen beide glücklich ins {Bett}.", "Saat onda ikisi de mutlu bir şekilde {yatağa=Bett} gidiyor."]
      ]
    ]
  }
};
