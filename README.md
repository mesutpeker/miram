# Örüntü Oyunu

İlkokul 2. sınıf öğrencileri için hazırlanmış eğlenceli ve etkileşimli bir örüntü uygulaması.

## Özellikler

- 50 farklı örüntü sorusu (sayı, şekil ve karışık örüntüler)
- Karışık sırada gelen sorular
- Eğlenceli ve renkli arayüz
- Tıkla-yerleştir tekniği ile etkileşimli oyun
- Anında geri bildirim sistemi
- Puan sistemi
- Animasyonlar ve görsel geri bildirimler
- Ses efektleri ve arkaplan müziği
- Konfeti animasyonu (doğru cevaplarda)
- Mobil uyumlu tasarım

## Nasıl Kullanılır

1. `index.html` dosyasını herhangi bir web tarayıcısında açın
2. Ekranda gösterilen örüntüyü inceleyin
3. Önce doğru olduğunu düşündüğünüz seçeneğe tıklayın (seçenek yeşil çerçeve ile vurgulanacaktır)
4. Sonra soru işaretine tıklayarak seçtiğiniz seçeneği yerleştirin
5. Cevabınız otomatik olarak kontrol edilecektir:
   - Doğru cevap: 10 puan kazanırsınız, konfeti animasyonu ve doğru ses efekti ile 2 saniye sonra bir sonraki soruya geçilir
   - Yanlış cevap: Doğru cevap turuncu renkte gösterilir, yanlış ses efekti çalar ve 2 saniye sonra bir sonraki soruya geçilir
6. 50 soruyu tamamladığınızda toplam puanınızı görebilirsiniz
7. Sağ alt köşedeki ses kontrol düğmesi ile sesi açıp kapatabilirsiniz

## Örüntü Türleri

1. **Sayı Örüntüleri**: Sayılar arasındaki ilişkileri keşfedin
2. **Şekil Örüntüleri**: Emojiler ve şekiller arasındaki düzeni bulun
3. **Karışık Örüntüler**: Sayı ve şekillerin birlikte oluşturduğu örüntüleri tamamlayın

## Ses Dosyaları

Oyun için gerekli ses dosyalarını `sound` klasörüne eklemeniz gerekmektedir:

1. `correct.mp3` - Doğru cevap için ses efekti
2. `wrong.mp3` - Yanlış cevap için ses efekti
3. `background.mp3` - Oyun arkaplan müziği

Ses dosyalarını eklemek için `sound/README.txt` dosyasındaki talimatları takip edebilirsiniz.

## Teknik Bilgiler

Bu uygulama HTML, CSS ve JavaScript kullanılarak geliştirilmiştir. Herhangi bir ek kütüphane veya çerçeve kullanılmamıştır. Google Fonts'tan Baloo 2 ve Quicksand fontları kullanılmıştır. 