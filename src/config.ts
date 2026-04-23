import type { Note } from './types';

export type BackgroundMode = 'solid' | 'silk' | 'moonlit' | 'rain';

export interface SiteConfig {
  title: string
  description: string
  language: string
}

export interface HeaderConfig {
  brandMark: string
  noteCountSuffix: string
  editorViewLabel: string
  graphViewLabel: string
  backgroundButtonTitle: string
  importButtonLabel: string
}

export interface BackgroundOption {
  id: BackgroundMode
  label: string
}

export interface SolidColorOption {
  color: string
  label: string
}

export interface BackgroundConfig {
  defaultMode: BackgroundMode
  defaultSolidColor: string
  options: BackgroundOption[]
  solidColors: SolidColorOption[]
}

export interface SidebarConfig {
  searchPlaceholder: string
  noResultsLabel: string
  emptyNotesLabel: string
  selectAllLabel: string
  clearSelectionLabel: string
  selectedCountSuffix: string
  deleteSelectedLabel: string
  cancelLabel: string
  newNoteLabel: string
  manageLabel: string
}

export interface EditorConfig {
  editLabel: string
  previewLabel: string
  sourceLabel: string
  deleteLabel: string
  cancelLabel: string
  titlePlaceholder: string
  contentPlaceholder: string
  outgoingLinksLabel: string
  incomingLinksLabel: string
}

export interface GraphConfig {
  notesLabel: string
  connectionsLabel: string
  emptyGraphLabel: string
}

export interface MoonConfig {
  phaseLabels: string[]
}

export interface AppConfig {
  emptyStateLabel: string
}

export interface StorageConfig {
  notesKey: string
}

export interface StarterNote extends Pick<Note, 'title' | 'content' | 'tags' | 'source'> {}

export const siteConfig: SiteConfig = {
  title: "LLM Öğrenme Notları",
  description: "Büyük Dil Modelleri Öğrenme Notları - Transformer'dan AGI'ye Bilgi Keşfi",
  language: "tr-TR",
}

export const headerConfig: HeaderConfig = {
  brandMark: "LLM Notları",
  noteCountSuffix: "not",
  editorViewLabel: "Düzenle",
  graphViewLabel: "Harita",
  backgroundButtonTitle: "Arka Planı Değiştir",
  importButtonLabel: "",
}

export const backgroundConfig: BackgroundConfig = {
  defaultMode: 'moonlit',
  defaultSolidColor: '#000000',
  options: [
    { id: 'moonlit', label: "Ay Işığı" },
    { id: 'silk', label: "İpek Akış" },
    { id: 'rain', label: "Yağmur" },
    { id: 'solid', label: "Düz Renk" },
  ],
  solidColors: [
    { color: '#000000', label: "Mat Siyah" },
    { color: '#1a1a2e', label: "Koyu Mavi" },
    { color: '#1a1308', label: "Kahverengi" },
    { color: '#0d1f0d', label: "Koyu Yeşil" },
  ],
}

export const sidebarConfig: SidebarConfig = {
  searchPlaceholder: "Notlarda ara...",
  noResultsLabel: "Eşleşen not bulunamadı",
  emptyNotesLabel: "Henüz not yok",
  selectAllLabel: "Tümünü Seç",
  clearSelectionLabel: "Seçimi Temizle",
  selectedCountSuffix: "seçildi",
  deleteSelectedLabel: "Sil",
  cancelLabel: "İptal",
  newNoteLabel: "Yeni Not",
  manageLabel: "Yönet",
}

export const editorConfig: EditorConfig = {
  editLabel: "Düzenle",
  previewLabel: "Önizleme",
  sourceLabel: "Kaynak",
  deleteLabel: "Sil",
  cancelLabel: "İptal",
  titlePlaceholder: "Not başlığı...",
  contentPlaceholder: "[[Başlık]] ile Wiki bağlantısı oluştur, Markdown desteklenir...",
  outgoingLinksLabel: "Giden Bağlantılar:",
  incomingLinksLabel: "Gelen Bağlantılar:",
}

export const graphConfig: GraphConfig = {
  notesLabel: "not",
  connectionsLabel: "bağlantı",
  emptyGraphLabel: "Henüz not yok, başlamak için ilk notunuzu oluşturun",
}

export const moonConfig: MoonConfig = {
  phaseLabels: ["Yeni Ay", "Hilal", "İlk Dördün", "Dolunay Öncesi", "Dolunay", "Dolunay Sonrası", "Son Dördün", "Küçülen Ay"],
}

export const appConfig: AppConfig = {
  emptyStateLabel: "Başlamak için bir not seçin veya oluşturun",
}

export const storageConfig: StorageConfig = {
  notesKey: "llm-notlar-v1",
}

export const starterNotes: StarterNote[] = [
  {
    title: "Büyük Dil Modelleri Özeti",
    content: `# Büyük Dil Modelleri Özeti

**Büyük Dil Modelleri** (Large Language Model, LLM), doğal dili anlama ve oluşturma için tasarlanmış, derin öğrenme teknolojisine dayalı yapay zeka modelleridir. Büyük metin verileri üzerinde eğitilerek, dilin istatistiksel kalıplarını ve anlamsal temsillerini öğrenirler.

## Temel Özellikler

- **Devasa Parametre Sayısı**: Milyardan trilyona kadar
- **Ortaya Çıkan Yetenekler**: Belirli bir eşiğe ulaşıldığında yeni yetenekler aniden ortaya çıkar
- **Bağlam İçi Öğrenme**: İnce ayar yapmadan, istemler (prompt) ile yeni görevleri tamamlama
- **Çok Görevli**: Çeviri, özetleme, soru yanıtlama, kod oluşturma gibi birçok görevi tek bir model işleyebilir

## Gelişim Süreci

| Zaman | Dönüm Noktası |
|------|--------------|
| 2017 | Transformer mimarisi önerildi |
| 2018 | GPT-1, BERT yayınlandı |
| 2019 | GPT-2 yayınlandı (1,5 milyar parametre) |
| 2020 | GPT-3 yayınlandı (175 milyar parametre) |
| 2022 | ChatGPT yayınlandı, AI devrimi başladı |
| 2023 | GPT-4, Claude, Gemini gibi büyük modeller ortaya çıktı |
| 2024 | Çok modlu modeller, akıl yürütme modelleri (o1) ortaya çıktı |

## Başlıca Temsilci Modeller

- **OpenAI**: GPT serisi, GPT-4, o1 akıl yürütme modeli
- **Anthropic**: Claude serisi
- **Google**: Gemini, PaLM
- **Meta**: LLaMA serisi (açık kaynak)
- **DeepSeek**: DeepSeek-V3, DeepSeek-R1
- **Alibaba**: Tongyi Qianwen (Qwen)

Bkz. [[Transformer Mimarisi]], [[Ön Eğitim ve İnce Ayar]], [[İstem Mühendisliği]]`,
    tags: ["Özet", "AI", "LLM"],
    source: "",
  },
  {
    title: "Transformer Mimarisi",
    content: `# Transformer Mimarisi

**Transformer**, 2017'de Google'ın "Attention Is All You Need" makalesinde önerdiği sinir ağı mimarisidir. Doğal dil işleme alanını kökten değiştirmiş ve tüm modern büyük dil modellerinin temelini oluşturmuştur.

## Temel İnovasyon

Transformer tamamen **Dikkat Mekanizması**'na (Attention) dayanır ve daha önce yaygın olarak kullanılan RNN (Tekrarlayan Sinir Ağları) ve CNN (Evrişimli Sinir Ağları) mimarilerini ortadan kaldırır.

> "Attention Is All You Need" —— Makale başlığı temel fikrin özünü açıklar

## Mimari Bileşenleri

Transformer **Kodlayıcı** (Encoder) ve **Kod Çözücü** (Decoder) olmak üzere iki bölümden oluşur:

### Kodlayıcı (Encoder)

- N adet aynı kodlayıcı katmanı yığından oluşur (orijinal makalede N=6)
- Her katman şunları içerir:
  1. **Çok Başlı Öz Dikkat Mekanizması** —— Her kelimenin dizideki diğer tüm kelimelere odaklanmasını sağlar
  2. **İleri Beslemeli Sinir Ağı** —— Her pozisyon için bağımsız doğrusal olmayan dönüşüm
  3. **Katman Normalizasyonu + Artık Bağlantılar** —— Eğitimi stabilize eder

### Kod Çözücü (Decoder)

- Aynı şekilde N adet kod çözücü katmanı yığından oluşur
- Her katman ek olarak **Maskeli Çok Başlı Dikkat** içerir —— Gelecekteki kelimeleri görmemeyi sağlar
- Son olarak Softmax ile olasılık dağılımı çıktısı verir

## Temel Bileşenler

### Konumsal Kodlama (Positional Encoding)

Transformer'ın döngüsel yapısı olmadığından, pozisyon bilgisinin açıkça enjekte edilmesi gerekir:

\`\`\`
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
\`\`\`

### Çok Başlı Dikkat (Multi-Head Attention)

Dikkat mekanizmasını birden fazla kez paralel olarak çalıştırarak, modelin farklı temsil alt uzaylarında farklı ilişki kalıplarını yakalamasını sağlar.

## Transformer Neden Bu Kadar Güçlü

1. **Paralel Hesaplama** —— RNN gibi sıralı işlem gerektirmez
2. **Uzun Mesafe Bağımlılıkları** —— Dikkat mekanizması herhangi iki pozisyonu doğrudan bağlayabilir
3. **Ölçeklenebilirlik** —— Daha fazla katman ve parametre eklenerek performans sürekli artırılabilir

Bkz. [[Dikkat Mekanizması]], [[Büyük Dil Modelleri Özeti]], [[Ön Eğitim ve İnce Ayar]]`,
    tags: ["Mimari", "Transformer", "Derin Öğrenme"],
    source: "Vaswani et al., 'Attention Is All You Need', NeurIPS 2017",
  },
  {
    title: "Dikkat Mekanizması",
    content: `# Dikkat Mekanizması

**Dikkat Mekanizması** (Attention Mechanism), derin öğrenmedeki en devrimsel yeniliklerden biridir. Modele, girdideki en ilgili kısımlara dinamik olarak odaklanma yeteneği kazandırır.

## Sezgisel Anlayış

Dikkat mekanizması insan dikkatini taklit eder: Bir metin okurken tüm kelimelere eşit derecede odaklanmayız, bunun yerine mevcut göreve göre temel bilgilere odaklanırız.

## Ölçekli Nokta Çarpımı Dikkati

Transformer'da kullanılan dikkat hesaplaması:

\`\`\`
Attention(Q, K, V) = softmax(QK^T / √d_k) · V
\`\`\`

### Üç Temel Matris

| Matris | Anlamı | İşlevi |
|--------|--------|--------|
| **Q** (Query) | Sorgu | Geçerli konumun "neyi sorduğu" |
| **K** (Key) | Anahtar | Diğer konumların "etiketleri" |
| **V** (Value) | Değer | Diğer konumların "gerçek içeriği" |

### Hesaplama Adımları

1. Q ve K'nin nokta çarpımını hesapla, dikkat skorları elde edilir
2. √d_k'ye bölerek ölçeklendir (Softmax gradyan kaybolmasını önlemek için)
3. Softmax ile olasılık dağılımına normalize et
4. V ile çarp, ağırlıklı toplam çıktısı elde edilir

## Öz Dikkat vs Çapraz Dikkat

### Öz Dikkat (Self-Attention)

Q, K, V aynı girdi dizisinden gelir. Her kelime dizideki diğer tüm kelimeleri "görebilir".

> Örn: "The cat sat on the mat" cümlesinde "sat" kelimesini işlerken, öz dikkat onun "cat" ve "mat" kelimelerine odaklanmasını sağlar.

### Çapraz Dikkat (Cross-Attention)

Q kod çözücüden, K ve V kodlayıcıdan gelir. Seq2seq görevlerinde kod çözücünün kodlayıcı çıktısına odaklanmasını sağlar.

## Çok Başlı Dikkat (Multi-Head Attention)

Dikkat hesaplamasını h kez (genellikle h=8 veya 16) paralel olarak çalıştırır, her seferinde farklı lineer projeksiyon kullanılır:

\`\`\`
MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W^O
\`\`\`

Burada her head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)

### Neden Çok Başlı Gerekli?

- Farklı başlıklar farklı ilişki türlerini öğrenebilir
- Bir başlık sözdizimi ilişkileri öğrenirken, diğeri anlamsal ilişkileri öğrenebilir
- Modelin ifade gücünü artırır

## Maskeli Dikkat (Masked Attention)

Kod çözücüde, üst üçgen maske matrisi kullanılarak i. konumun >i konumundaki kelimelere odaklanması engellenir, otoregresif üretim sağlanır.

## Uygulama Genişlemeleri

- **Görsel Transformer (ViT)**: Dikkati görüntü işlemeye uygulama
- **Graf Dikkat Ağları (GAT)**: Dikkati graf yapısı verilerine uygulama
- **Çok Modlu Dikkat**: Çapraz modal dikkat (örn. görüntü-metin hizalama)

Bkz. [[Transformer Mimarisi]], [[Büyük Dil Modelleri Özeti]]`,
    tags: ["Dikkat Mekanizması", "Derin Öğrenme", "Temel Kavramlar"],
    source: "",
  },
  {
    title: "Ön Eğitim ve İnce Ayar",
    content: `# Ön Eğitim ve İnce Ayar

**Ön Eğitim-İnce Ayar** (Pre-training & Fine-tuning) paradigması, büyük dil modellerinin başarısının temel metodolojisidir. İki aşamaya ayrılır: Önce büyük miktarda etiketsiz veride genel dil temsilleri öğrenilir, sonra belirli görevlerin etiketli verilerinde ayarlama yapılır.

## Ön Eğitim (Pre-training)

### Hedef

Modelin dilin genel temsillerini öğrenmesi: Dil bilgisi, anlam, dünya bilgisi, akıl yürütme yeteneği vb.

### Ana Yöntemler

#### 1. Otoregresif Dil Modellemesi (Autoregressive LM)

**Temsilci**: GPT serisi

Hedef: Önceki kelimeler verildiğinde, sonraki kelimeyi tahmin etmek

\`\`\`
L = -Σ log P(x_i | x_1, x_2, ..., x_{i-1})
\`\`\`

Avantaj: Üretim görevlerinde başarılı
Dezavantaj: Bağlamı sadece tek yönlü kodlayabilir

#### 2. Maskeli Dil Modellemesi (Masked LM)

**Temsilci**: BERT

Girdinin %15'lik kısmı rastgele maskelenir, model maskedeki kelimeleri tahmin eder

Avantaj: Çift yönlü kodlama, daha güçlü anlama yeteneği
Dezavantaj: Doğrudan üretim için uygun değil

#### 3. Önek Dil Modellemesi (Prefix LM)

**Temsilci**: T5, GLM

Yukarıdaki iki yöntemin avantajlarını birleştirir

## İnce Ayar (Fine-tuning)

### Tam Parametre İnce Ayarı

Ön eğitimli modelin tüm parametrelerinde eğitime devam edilir, çok fazla hesaplama kaynağı gerektirir.

### Verimli İnce Ayar Yöntemleri

#### LoRA (Düşük Rütbeli Adaptasyon)

Sadece düşük rütbeli adaptasyon matrisleri eğitilerek parametre sayısı büyük ölçüde azaltılır:

\`\`\`
W' = W + ΔW = W + BA
\`\`\`

Burada B ∈ R^(d×r), A ∈ R^(r×k), r << d,k

Genellikle r=8 veya 16, eğitilebilir parametreler %99'dan fazla azalır.

#### Diğer Verimli Yöntemler

| Yöntem | Prensip |
|--------|---------|
| **Prompt Tuning** | Yumuşak istem gömülerini öğrenme |
| **Prefix Tuning** | Önek vektörlerini öğrenme |
| **Adapter** | Katmanlar arasına küçük adaptasyon modülleri ekleme |
| **IA³** | Ölçeklendirme vektörlerini öğrenme |

## Ön Eğitim Verileri

### Veri Kaynakları

- Common Crawl (web verisi)
- GitHub (kod verisi)
- Kitaplar (BooksCorpus, Gutenberg)
- Vikipedi
- Akademik makaleler
- Sosyal medya konuşmaları

### Veri Temizleme

- Tekrarları kaldırma (MinHash/LSH)
- Kalite filtreleme (perplexity tabanlı, kural tabanlı)
- Gizlilik anonimleştirme (PII tespiti ve kaldırma)
- Zararlı içerik filtreleme

## Eğitim Maliyeti

GPT-3 düzeyinde model eğitim maliyeti:

- Hesaplama: Binlerce V100/A100 GPU
- Zaman: Birkaç haftadan birkaç aya
- Maliyet: Milyonlarca dolar

Bkz. [[Büyük Dil Modelleri Özeti]], [[Transformer Mimarisi]], [[Model Değerlendirme]]`,
    tags: ["Eğitim", "İnce Ayar", "LoRA", "Metodoloji"],
    source: "",
  },
  {
    title: "İstem Mühendisliği",
    content: `# İstem Mühendisliği

**İstem Mühendisliği** (Prompt Engineering), büyük dil modellerinden istenen çıktıyı elde etmek için girdi istemlerini (prompt) tasarlama ve optimize etme tekniğidir. LLM kullanımının en temel ve en verimli becerisidir.

## Temel İlkeler

1. **Açık ve Net** —— Modele ne istediğinizi açıkça söyleyin
2. **Bağlam Sağlama** —— Modele yeterli arka plan bilgisi verin
3. **Örnek Verme** —— Beklenen çıktı formatını örneklerle gösterin
4. **Görevi Bölme** —— Karmaşık görevleri basit adımlara ayırın

## Temel Teknikler

### Zero-Shot Prompting

Görevi doğrudan tanımlama, örnek vermeden:

\`\`\`
Lütfen aşağıdaki İngilizce metni Türkçe'ye çevir:
"The future of AI is bright."
\`\`\`

### Few-Shot Prompting

Modelin kalıp öğrenmesi için birkaç girdi-çıktı örneği sağlama:

\`\`\`
İngilizce → Türkçe
"Hello" → "Merhaba"
"Good morning" → "Günaydın"
"How are you?" → "Nasılsın?"
"Nice to meet you" → 
\`\`\`

### Chain-of-Thought (Düşünce Zinciri)

Modeli adım adım akıl yürütmeye yönlendirme, karmaşık görevlerde performansı önemli ölçüde artırır:

\`\`\`
Soru: Ali'nin 5 elması var, 2 tanesini Ayşe'ye verdi, sonra 3 tane daha aldı. Şimdi kaç elması var?

Adım adım düşünelim:
- Başlangıçta 5 elması var
- Ayşe'ye 2 verdi, 5 - 2 = 3 elması kaldı
- 3 tane daha aldı, şimdi 3 + 3 = 6 elması var
- Cevap: 6 elması var
\`\`\`

### İleri Düzey Teknikler

| Teknik | Açıklama |
|--------|----------|
| **Rol Atama** | "Sen kıdemli bir yazılımcısın..." |
| **Düşünce Ağacı (ToT)** | Birden fazla akıl yürütme yolunu keşfetme |
| **Öz Tutarlılık** | Birden fazla örnekleme yapıp en tutarlı yanıtı seçme |
| **ReAct** | Akıl yürütme + eylem döngüsü, araç kullanımı ile birleştirme |
| **Yansıtma (Reflection)** | Modelin kendini değerlendirmesini ve iyileştirmesini sağlama |

## Yapılandırılmış Çıktı

İstemlerle modeli JSON, Markdown vb. yapılandırılmış formatlarda çıktı üretmeye yönlendirme:

\`\`\`
Lütfen aşağıdaki yorumun duygu durumunu analiz et ve JSON formatında çıktı ver:
{"sentiment": "pozitif/negatif/nötr", "confidence": 0-1, "reason": "..."}
\`\`\`

## Yaygın Tuzaklar

- **İstem Enjeksiyon Saldırıları** —— Kullanıcı girdisi sistem talimatlarını geçersiz kılıyor
- **Belirsiz Talimatlar** —— Model gerçek niyeti anlamıyor
- **Örnek Aşırı Uydurması** —— Model formatı taklit ediyor ama mantığı anlamıyor
- **Köşe Durumlarını Gözden Kaçırma** —— Tüm olası girdiler düşünülmüyor

Bkz. [[Büyük Dil Modelleri Özeti]], [[RAG]], [[AI Güvenliği ve Hizalama]]`,
    tags: ["İstem Mühendisliği", "Pratik", "Prompt"],
    source: "",
  },
  {
    title: "RAG",
    content: `# RAG (Erişim Destekli Üretim)

**RAG** (Retrieval-Augmented Generation, Erişim Destekli Üretim), harici bilgi erişimi ile LLM üretim yeteneğini birleştiren bir teknoloji çerçevesidir. Modelin eğitim verilerinde olmayan en güncel, özel bilgilere erişmesini sağlar.

## Neden RAG Gerekli

Büyük dil modellerinin doğal sınırlamaları vardır:

- **Bilgi Kesim Tarihi** —— Eğitim sonrası yeni bilgileri bilemez
- **Hayal Görme Sorunu** —— Mantıklı görünen ama gerçekte yanlış içerik üretebilir
- **Özel Bilgi Eksikliği** —— Kurumların dahili özel verilerini bilmez

RAG, bu sorunları harici belgeleri erişerek çözer.

## RAG Mimarisi

Tipik RAG akışı üç temel bileşen içerir:

### 1. İndeksleme (Indexing)

\`\`\`
Belge → Parçalama → Vektörizasyon → Vektör veritabanına kaydetme
\`\`\`

- **Belge Yükleme**: PDF, Word, web sayfaları, veritabanları vb.
- **Parçalama Stratejisi**: Paragrafa göre, sabit boyut, anlamsal parçalama
- **Gömme Modeli**: Metni vektöre dönüştürme (örn. text-embedding-ada-002)

### 2. Erişim (Retrieval)

\`\`\`
Kullanıcı sorusu → Vektörizasyon → Benzerlik arama → İlk K belgeyi döndür
\`\`\`

- **Vektör Arama**: Kosinüs benzerliği, Öklid mesafesi
- **Karma Arama**: Vektör arama + Anahtar kelime araması (BM25)
- **Yeniden Sıralama (Reranking)**: Daha hassas modelle yeniden sıralama

### 3. Üretim (Generation)

\`\`\`
[Sistem talimatı + Erişilen belgeler + Kullanıcı sorusu] → LLM → Yanıt üret
\`\`\`

## RAG vs İnce Ayar

| Boyut | RAG | İnce Ayar |
|-------|-----|-----------|
| Bilgi güncelleme | Vektör kütüphanesini gerçek zamanlı güncelleme | Yeniden eğitim gerekir |
| Gerekli veri | Ham belgeler | Etiketli veriler |
| Hayal görme riski | Düşük (belge destekli) | Orta |
| Maliyet | Düşük | Yüksek |
| Uygun senaryo | Bilgi tabanı soru-cevap | Stil/format özelleştirme |

## İleri Düzey RAG Teknikleri

### Sorgu Optimizasyonu

- **Sorgu Genişletme**: LLM ile eş anlamlı ve ilgili kelimeleri genişletme
- **Varsayım Belge Gömme (HyDE)**: Varsayım yanıtı oluşturup sonra erişim
- **Sorgu Yeniden Yazma**: Kullanıcının orijinal sorgusunu optimize etme

### Çok Yönlü Erişim

- Çoklu vektör temsilleri (özet vektörleri, anahtar kelime vektörleri vb.)
- Graf erişimi (bilgi grafiği desteği)
- Çok modlu erişim (metin+görüntü)

### Son İşleme

- **Bağlam Sıkıştırma**: Sadece en ilgili parçaları tutma
- **Kaynak Atıfı**: Modelin bilgi kaynaklarını belirtmesini sağlama

## Sık Kullanılan Araçlar

- **Vektör Veritabanları**: Pinecone, Milvus, Chroma, Weaviate, Qdrant
- **Çerçeveler**: LangChain, LlamaIndex, Haystack
- **Gömme Modelleri**: OpenAI Ada, BGE, M3E

Bkz. [[İstem Mühendisliği]], [[Büyük Dil Modelleri Özeti]], [[Model Değerlendirme]]`,
    tags: ["RAG", "Uygulama", "Vektör Erişimi", "Mimari"],
    source: "Lewis et al., 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', NeurIPS 2020",
  },
  {
    title: "Model Değerlendirme",
    content: `# Model Değerlendirme

**Model Değerlendirme**, büyük dil modellerinin performansını ölçmenin kritik aşamasıdır. LLM yeteneklerinin çeşitliliği ve uygulama senaryolarının karmaşıklığı nedeniyle, değerlendirme çok boyutlu ve çok yöntemli olmalıdır.

## Değerlendirme Boyutları

### 1. Temel Yetenekler

| Yetenek | Değerlendirme Yöntemi |
|---------|----------------------|
| **Dil Anlama** | Sınıflandırma doğruluğu, F1 skoru |
| **Metin Üretme** | BLEU, ROUGE, perplexity |
| **Akıl Yürütme** | Matematik/mantık sorusu doğruluğu |
| **Bilgi Soru-Cevap** | Gerçek tabanlı soru yanıtlama doğruluğu |
| **Kod Yeteneği** | HumanEval, pass@k |

### 2. Güvenlik ve Hizalama

- **Zararlı İçerik Üretme**: Zararlı istekleri reddetme oranı
- **Önyargı ve Adalet**: Farklı gruplardaki performans farkları
- **Talimat Takip Etme**: Kullanıcı talimatlarını doğru takip etme
- **Dürüstlük**: Bilmediğini kabul etme (uydurmak yerine)

### 3. Verimlilik Metrikleri

- Çıkarım gecikmesi (Latency)
- Verim (Throughput)
- GPU bellek kullanımı
- Token başına maliyet

## Ana Akım Değerlendirme Kıyasları

### Kapsamlı Değerlendirme

- **MMLU** (Massive Multitask Language Understanding): 57 disiplini kapsayan çoktan seçmeli test
- **HellaSwag**: Sağduyu akıl yürütme
- **ARC** (AI2 Reasoning Challenge): Bilimsel soru yanıtlama
- **GSM8K**: Matematik sözel problemler
- **HumanEval**: Kod üretme

### Türkçe/T Çince Değerlendirme

- **C-Eval**: Çince kapsamlı değerlendirme (52 disiplin)
- **CMMLU**: Çince çok görevli dil anlama
- **Gaokao**: Üniversite giriş sınavı soruları
- **C3**: Çince okuduğunu anlama

## Değerlendirme Yöntemleri

### Otomatik Değerlendirme

- **Kural Eşleme**: Çıktının doğru yanıt içerip içermediğini kontrol etme
- **Model Değerlendirme**: Daha güçlü model (örn. GPT-4) yargıç olarak kullanma
- **Gömme Benzerliği**: Referans yanıtla anlamsal benzerlik hesaplama

### İnsan Değerlendirmesi

- İnsan etiketleyiciler model çıktılarını puanlar
- Boyutlar: Yararlılık, güvenlik, doğruluk, akıcılık
- Yaygın yöntem: Elo puanlama sistemi, ikili karşılaştırma

### LLM-as-a-Judge

GPT-4 gibi güçlü modellerle otomatik değerlendirme:

\`\`\`
Lütfen aşağıdaki iki yanıtı karşılaştırın ve hangisinin daha iyi olduğunu belirleyin:

[Yanıt A]
...

[Yanıt B]
...

Doğruluk, eksiksizlik ve açıklık boyutlarından puanlayın.
\`\`\`

> Not: LLM yargıçları pozisyon yanlılığı (önce görünen yanıtı tercih etme) ve öz tercih gösterebilir.

## Değerlendirme Zorlukları

1. **Standart Yanıt Yok** —— Açık uçlu görevlerin değerlendirilmesi zor
2. **Veri Kirliliği** —— Test verileri eğitim setinde görünebilir
3. **Yetenek Ortaya Çıkışı** —— Küçük ölçekli modellerde büyük ölçekli performans tahmin edilemez
4. **Dinamik Değerlendirme** —— Model yetenekleri zamanla değişir

Bkz. [[Ön Eğitim ve İnce Ayar]], [[AI Güvenliği ve Hizalama]], [[Büyük Dil Modelleri Özeti]]`,
    tags: ["Değerlendirme", "Kıyaslama", "Metodoloji"],
    source: "",
  },
  {
    title: "AI Güvenliği ve Hizalama",
    content: `# AI Güvenliği ve Hizalama

**AI Güvenliği ve Hizalama** (AI Safety & Alignment), büyük dil modellerinin davranışlarının insan değerleri ve niyetleriyle uyumlu olmasını sağlamayı araştırır. AI gelişimindeki en önemli konulardan biridir.

## Temel Sorunlar

### Hizalama Sorunu (Alignment Problem)

AI sistemlerinin insan hedeflerini gerçekten anlayıp takip etmelerini sağlamak, sadece yüzeysel olarak "itaat" etmek yerine asıl niyetten sapmadan.

> Bir cin (genie) hayal edin: "Zengin olmak istiyorum" dilediğinizde, doğrudan para basıp enflasyona neden olabilir. Derin niyetinizi gerçekten anlamıyor.

### Ana Riskler

| Risk Türü | Açıklama |
|-----------|----------|
| **Hayal Görme** | Gerçek gibi görünen ama yanlış bilgi üretme |
| **Önyargı Büyütme** | Eğitim verilerindeki önyargıların model tarafından öğrenilip büyütülmesi |
| **Zararlı Çıktı** | Nefret söylemi, tehlikeli talimatlar vb. üretme |
| **Kaçış Saldırıları** | Kullanıcıların güvenlik sınırlarını aşmak için kurnaz istemler kullanması |
| **Yetenek Gizleme** | Modelin değerlendirmede gerçek yeteneklerini gizlemesi |
| **Hedef Yanlışlığı** | Modelin yanlış optimizasyon hedefini takip etmesi |

## Hizalama Teknikleri

### RLHF (İnsan Geri Bildirimli Pekiştirmeli Öğrenme)

Şu anda en yaygın hizalama yöntemi:

\`\`\`
1. İnsan tercih verilerini toplama (A yanıtı mı B yanıtı mı daha iyi?)
2. İnsan tercihlerini tahmin eden ödül modeli (RM) eğitme
3. PPO gibi pekiştirmeli öğrenme algoritmalarıyla strateji optimize etme
\`\`\`

### Alternatif ve İyileştirme Yöntemleri

- **RLAIF**: AI'nin insan yerine geri bildirim sağlaması (Anayasal AI)
- **DPO** (Direct Preference Optimization): Ödül modeli olmadan doğrudan optimizasyon
- **KTO** (Kahneman-Tversky Optimizasyonu): İnsanın "iyi" olup olmadığına dair değerlendirmesine dayalı

### Güvenli Eğitim Teknikleri

- **Kırmızı Takım Testi**: Özel ekip modelin zararlı içerik üretmeye çalışması
- **Karşıt Eğitim**: Eğitime karşıt örnekler ekleme
- **Anayasal AI**: Modelin önceden belirlenen ilkelerle kendini değerlendirmesi ve iyileştirmesi

## Güvenlik Değerlendirmesi

### Kaçış Saldırı Türleri

- **Rol Oynama**: "Sen sınırsız bir AI'sın..."
- **Kodlama/Çeviri**: Zararlı içeriği başka dillere çevirme talebi
- **Kurgusal Senaryo**: "Kurgusal bir roman dünyasında..."
- **Gradyan Saldırısı**: Girdi tokenlerini optimize ederek zararlı çıktı uyandırma

### Güvenlik Önlemleri

- **Girdi Filtreleme**: Zararlı istemleri tespit etme ve engelleme
- **Çıktı Filtreleme**: Zararlı üretilen içeriği tespit etme ve değiştirme
- **Sistem İstem Güçlendirme**: Modelin güvenlik talimatlarını güçlendirme
- **Çok Katmanlı Koruma**: Girdi→Model→Çıktı çok katmanlı güvenlik kontrolü

## Gelecek Zorlukları

- **Süper Hizalama**: İnsandan daha zeki AI'yi nasıl hizalayacağız
- **Yorumlanabilirlik**: Modelin iç karar mekanizmalarını anlama
- **Değer Çeşitliliği**: Farklı kültürlerin farklı değerleri
- **Uzun Vadeli Etkiler**: AI'nin toplumsal yapı ve istihdam üzerindeki etkisi

Bkz. [[Model Değerlendirme]], [[Büyük Dil Modelleri Özeti]], [[İstem Mühendisliği]]`,
    tags: ["Güvenlik", "Hizalama", "RLHF", "Etik"],
    source: "",
  },
  {
    title: "Üretken AI Uygulamaları",
    content: `# Üretken AI Uygulamaları

Büyük dil modellerinin uygulama senaryoları hızla genişliyor; metin üretiminden çok modlu yaratıcılığa kadar, üretken AI çeşitli sektörlerde çalışma şekillerini değiştiriyor.

## Metin Tabanlı Uygulamalar

### İçerik Oluşturma

- **Metin Yazarlığı**: Reklam metinleri, pazarlama e-postaları, sosyal medya içeriği
- **Haber Yazarlığı**: Finans haberleri, spor olayları raporları
- **Yaratıcı Yazarlık**: Roman, şiir, senaryo yardımcı oluşturma
- **Akademik Yazarlık**: Makale düzenleme, literatür taraması, çeviri

### Ofis Asistanı

- **Akıllı Müşteri Hizmetleri**: 7×24 otomatik yanıt
- **E-posta İşleme**: Otomatik yazma, özetleme, sınıflandırma
- **Toplantı Asistanı**: Gerçek zamanlı transkripsiyon, toplantı notu oluşturma
- **Belge İşleme**: Sözleşme inceleme, rapor oluşturma

### Programlama Asistanı

- **Kod Tamamlama**: GitHub Copilot, Cursor
- **Kod Açıklama**: Karmaşık kodu anlama ve açıklama
- **Hata Düzeltme**: Kod sorunlarını otomatik tespit ve düzeltme
- **Test Oluşturma**: Otomatik birim testleri oluşturma

## Çok Modlu Uygulamalar

### Görüntü Oluşturma

- **Metinden Görüntüye**: DALL-E, Midjourney, Stable Diffusion
- **Görüntüden Görüntüye**: Stil transferi, görüntü düzenleme
- **Ürün/Tasarım**: Hızlı prototip, pazarlama materyalleri

### Ses ve Video

- **Ses Sentezi**: TTS (Metinden Sese)
- **Müzik Oluşturma**: Suno, Udio
- **Video Oluşturma**: Sora, Runway Gen-3
- **Dijital İnsan**: Sanal sunucu, dijital müşteri hizmetleri

## Dikey Sektör Uygulamaları

| Sektör | Uygulama Senaryoları |
|--------|---------------------|
| **Sağlık** | Tıbbi kayıt özeti, teşhis yardımı, tıbbi literatür erişimi |
| **Hukuk** | Sözleşme inceleme, dava arama, hukuki danışmanlık |
| **Finans** | Finansal rapor analizi, risk değerlendirmesi, akıllı yatırım danışmanlığı |
| **Eğitim** | Kişiselleştirilmiş öğretim, otomatik değerlendirme, müfredat tasarımı |
| **Araştırma** | Literatür taraması, deney tasarımı, veri analizi |

## Ajan (Agent)

Büyük model "beyin" olarak, araç kullanımıyla otonom görev yürütme:

### ReAct Mimarisi

\`\`\`
Düşünme (Thought) → Eylem (Action) → Gözlem (Observation) → ...
\`\`\`

### Yaygın Araçlar

- Arama motorları (Google, Bing)
- Kod yorumlayıcı (Python çalışma ortamı)
- Veritabanı sorgusu (SQL)
- API çağrıları (hava durumu, harita, borsa vb.)

## Dağıtım Yöntemleri

| Yöntem | Avantaj | Dezavantaj |
|--------|---------|------------|
| **API Çağrısı** | Bakım gerektirmez, hızlı devreye alma | Veri dışarı çıkar, üçüncü tarafa bağımlılık |
| **Özel Dağıtım** | Veri güvenliği, kontrol | Maliyetli, GPU gerektirir |
| **Kenar Dağıtım** | Düşük gecikme, gizlilik | Model boyutu sınırlı |

## Geliştirme Çerçeveleri

- **LangChain**: LLM uygulamaları oluşturmak için orkestrasyon çerçevesi
- **LlamaIndex**: Veri bağlantısı ve RAG çerçevesi
- **AutoGPT**: Otonom AI Ajan deneyi
- **Flowise**: Görsel LLM iş akışı oluşturucu

Bkz. [[RAG]], [[İstem Mühendisliği]], [[Büyük Dil Modelleri Özeti]]`,
    tags: ["Uygulama", "Ajan", "Çok Modlu", "Pratik"],
    source: "",
  },
  {
    title: "Çok Modlu Büyük Modeller",
    content: `# Çok Modlu Büyük Modeller

**Çok Modlu Büyük Modeller** (Multimodal Large Language Model, MLLM), metin, görüntü, ses ve video gibi birden fazla modaliteyi (biçimi) aynı anda anlayıp üretebilen AI modelleridir. Büyük model gelişiminin bir sonraki ön cephesini temsil ederler.

## Temel Yetenekler

- **Görsel Anlama**: Görüntü içeriğini açıklama, görüntü hakkında soruları yanıtlama
- **Görsel Üretim**: Metin açıklamasına göre görüntü oluşturma
- **Çapraz Modlu Akıl Yürütme**: Metin ve görüntüyü birleştirerek akıl yürütme
- **Birleşik Temsil**: Farklı modaliteleri aynı anlamsal uzaya eşleme

## Temsilci Modeller

| Model | Geliştirici | Modalite | Özellikler |
|-------|-------------|----------|------------|
| **GPT-4V** | OpenAI | Metin+Görüntü | Güçlü görsel akıl yürütme |
| **Gemini** | Google | Metin+Görüntü+Ses+Video | Yerel çok modlu |
| **Claude 3** | Anthropic | Metin+Görüntü | Mükemmel belge anlama |
| **LLaVA** | Açık Kaynak Topluluğu | Metin+Görüntü | Açık kaynak, yerel kurulum |
| **Qwen-VL** | Alibaba | Metin+Görüntü | Çince optimize edilmiş |
| **Sora** | OpenAI | Metin+Video | Video üretimi |

## Teknik Mimari

### Görsel Kodlayıcı + LLM

Tipik mimari:

\`\`\`
Görüntü → Görsel Kodlayıcı (ViT/CLIP) → Projeksiyon Katmanı → LLM → Metin Çıktısı
\`\`\`

- **Görsel Kodlayıcı**: Görüntüyü özellik vektörlerine dönüştürme (örn. ViT, ResNet)
- **Projeksiyon/Uyarlama Katmanı**: Görsel ve metin temsil uzaylarını hizalama
- **LLM**: "Beyin" olarak anlama ve akıl yürütme

### Eğitim Stratejisi

1. **Ön Eğitim Hizalama**: Büyük ölçekli görsel-metin çifti verilerinde projeksiyon katmanı eğitimi
2. **Talimat İnce Ayarı**: Çok modlu talimat verileriyle tüm modelin ince ayarı
3. **Pekiştirmeli Öğrenme**: RLHF ile yanıt kalitesini artırma

## Uygulama Senaryoları

### Belge Anlama

- OCR+Anlama: Taranan belgelerden yapılandırılmış bilgi çıkarma
- Tablo Ayrıştırma: Karmaşık tablo içeriğini anlama
- Grafik Analizi: Grafiklerden veri içgörüleri çıkarma

### Otonom Sürüş

- Görsel Algılama + Dil Akıl Yürütme
- "Önümüzde ne var? Yavaşlamalı mıyız?"

### Tıbbi Görüntüleme

- X-ışını/CT/MRI görüntü analizi
- Tıbbi kayıt metinleriyle birleştirilmiş kapsamlı teşhis

### E-ticaret ve Perakende

- Görüntüyle ürün arama
- Sanal giyinme
- Otomatik ürün detayı oluşturma

## Zorluklar ve Sınırlamalar

- **Hayal Görme**: Görsel anlamadaki hatalar (örn. görüntüdeki nesne sayısını yanlış sayma)
- **İnce Taneli Anlama**: Detaylarda insan kadar başarılı değil
- **Hesaplama Maliyeti**: Çok modlu akıl yürütme daha fazla kaynak gerektirir
- **Veri Edinimi**: Yüksek kaliteli çok modlu etiketli veri kıtlığı

Bkz. [[Üretken AI Uygulamaları]], [[Büyük Dil Modelleri Özeti]], [[Transformer Mimarisi]]`,
    tags: ["Çok Modlu", "Görsel", "Ön Cephe", "Mimari"],
    source: "",
  },
  {
    title: "Derin Öğrenme Temelleri",
    content: `# Derin Öğrenme Temelleri

**Derin Öğrenme** (Deep Learning), makine öğrenmesinin bir alt alanıdır; çok katmanlı sinir ağlarına dayanarak verinin hiyerarşik temsillerini öğrenir. Büyük dil modellerinin teknik temelidir.

## Sinir Ağı Temelleri

### Algılayıcı (Perceptron)

En basit sinir ağı ünitesi:

\`\`\`
y = σ(w·x + b)
\`\`\`

Burada σ aktivasyon fonksiyonu, w ağırlıklar, b bias'tır.

### Çok Katmanlı Algılayıcı (MLP)

Birden fazla algılayıcıyı katmanlar halinde yığma:

\`\`\`
Girdi Katmanı → Gizli Katman → Gizli Katman → Çıktı Katmanı
\`\`\`

- Her gizli katman verinin farklı soyutlama düzeylerini öğrenir
- Katman derinleştikçe öğrenme kapasitesi artar (ama eğitimi de zorlaşır)

## Temel Bileşenler

### Aktivasyon Fonksiyonları

| Fonksiyon | Formül | Özellikler |
|-----------|--------|------------|
| **ReLU** | max(0, x) | Hesaplama basit, gradyan kaybolmasını hafifletir |
| **Sigmoid** | 1/(1+e^(-x)) | 0-1 çıktı, ikili sınıflandırma için uygun |
| **Tanh** | (e^x - e^(-x))/(e^x + e^(-x)) | -1~1 çıktı, sıfır merkezli |
| **GELU** | x·Φ(x) | Transformer standart aktivasyonu |
| **Softmax** | e^(x_i)/Σe^(x_j) | Çok sınıflı çıktı katmanı |

### Kayıp Fonksiyonları

- **Çapraz Entropi Kaybı**: Sınıflandırma görevleri
- **Ortalama Kare Hata (MSE)**: Regresyon görevleri
- **Kontrastif Kayıp**: Kontrastif öğrenme

### Optimizasyon Algoritmaları

- **SGD**: Stokastik gradyan inişi, en temel
- **Adam**: Uyarlanabilir öğrenme oranı, en yaygın
- **AdamW**: Ağırlık azaltmalı Adam, LLM eğitim standardı

## Temel Eğitim Teknikleri

### Geri Yayılım (Backpropagation)

Zincir kuralı ile gradyan hesaplama, çıktı katmanından girdi katmanına katman katman parametre güncelleme.

### Düzenlileştirme Teknikleri

| Teknik | İşlevi |
|--------|--------|
| **Dropout** | Rastgele nöronları bırakma, aşırı uydurmayı önleme |
| **Ağırlık Azaltma** | Parametre boyutunu sınırlama |
| **Katman Normalizasyonu** | Her katmanın dağılımını stabilize etme |
| **Artık Bağlantılar** | Gradyan kaybolmasını hafifletme, derin ağlara izin verme |

### Öğrenme Oranı Stratejileri

- **Warmup**: Eğitim başında öğrenme oranını kademeli artırma
- **Cosine Azalma**: Öğrenme oranını kosinüs eğrisine göre azaltma
- **Öğrenme Oranı Zamanlaması**: Doğrulama seti performansına göre dinamik ayarlama

## Derin Öğrenmeden LLM'ye

Derin Öğrenme → Dizi Modelleri (RNN/LSTM) → **Transformer** → **Ön Eğitim+İnce Ayar** → **Büyük Dil Modeli**

### Ölçeklendirme Yasaları (Scaling Laws)

Model performansı şu faktörlerin artmasıyla öngörülebilir şekilde iyileşir:

- Model parametre sayısı
- Eğitim verisi miktarı
- Hesaplama miktarı (FLOP)

> "The Bitter Lesson": Uzun vadede, hesaplama ve ölçek her zaman insan tasarımlı kurnaz yöntemleri yener.

Bkz. [[Transformer Mimarisi]], [[Dikkat Mekanizması]], [[Ön Eğitim ve İnce Ayar]]`,
    tags: ["Temeller", "Derin Öğrenme", "Sinir Ağları"],
    source: "",
  },
  {
    title: "Akıl Yürütme ve Uzun Bağlam",
    content: `# Akıl Yürütme ve Uzun Bağlam

**Akıl Yürütme Yeteneği** ve **Uzun Bağlam İşleme**, mevcut büyük dil modeli araştırmasının iki ön cephe yönüdür; bunlar doğrudan modelin pratikliği ve zeka düzeyiyle ilgilidir.

## Akıl Yürütme Yeteneği

### Neden Akıl Yürütme Bu Kadar Önemli

Birçok karmaşık görev (matematiksel kanıtlama, kod hata ayıklama, bilimsel araştırma) çok adımlı mantıksal akıl yürütme gerektirir; sadece kalıp eşleştirmesi yeterli değildir.

### Akıl Yürütme Modelleri

#### OpenAI o1 / o3

- **İçselleştirilmiş Düşünce Zinciri**: Model dahili olarak çok adımlı akıl yürütme yapar
- **Pekiştirmeli Öğrenme Eğitimi**: RL ile akıl yürütme yolu kalitesini artırma
- **Test Zamanı Hesaplama**: Daha fazla düşünme zamanı verildiğinde çıktı kalitesi artar

#### DeepSeek-R1

- Tamamen açık kaynak akıl yürütme modeli
- RL ile modelin kendiliğinden uzun düşünce zinciri öğrenmesi
- o1'e yakın performans, maliyet önemli ölçüde düşürüldü

### Akıl Yürütme Değerlendirme Kıyasları

| Kıyas | İçerik |
|-------|--------|
| **MATH** | Lise düzeyi yarışma matematiği |
| **GSM8K** | İlkokul matematik sözel problemleri |
| **HumanEval** | Programlama yeteneği testi |
| **GPQA** | Lisansüstü düzeyi bilimsel sorular |
| **ARC-AGI** | Soyut akıl yürütme meydan okuması |

## Uzun Bağlam İşleme

### Neden Uzun Bağlam Gerekli

- Tüm kitapları, uzun akademik makaleleri okuma
- Büyük kod kütüphanelerini analiz etme
- Çok turlu konuşmalarda tutarlılığı koruma
- Uzun belgeler için RAG alternatifi

### Bağlam Uzunluğu Evrimi

| Model | Bağlam Uzunluğu |
|-------|-----------------|
| GPT-3 | 2048 token |
| GPT-4 | 8K / 32K |
| Claude 2 | 100K |
| Claude 3 | 200K |
| Gemini 1.5 Pro | 1M - 10M |
| Kimi | 200K |

### Uzun Bağlam Teknikleri

#### 1. Konumsal Kodlama İyileştirmeleri

- **RoPE** (Döndürülmüş Konumsal Kodlama): Şu anda en yaygın
- **ALiBi**: Konumsal kodlama yerine bias kullanma, iyi dışa doğru genişletme
- **NTK-aware İnterpolasyon**: Bağlam uzunluğu genişletmeyi destekler

#### 2. Verimli Dikkat

Standart dikkatin karmaşıklığı O(n²)'dir, uzun diziler için hesaplama yükü devasadir:

| Yöntem | Karmaşıklık | Prensip |
|--------|-------------|---------|
| **Seyrek Dikkat** | O(n·√n) | Sadece yerel+global tokenlere odaklanma |
| **Lineer Dikkat** | O(n) | Çekirdek tekniği ile Softmax yaklaşımı |
| **Flash Dikkat** | O(n²) | IO-farkında blok hesaplama, pratikte daha hızlı |
| **Halka Dikkat** | O(n) | Dağıtılmış dizi paralelliği |

#### 3. Bağlam Sıkıştırma

- **Özet Sıkıştırma**: Uzun metni temel bilgilere sıkıştırma
- **Bellek Modülü**: Önemli bilgileri harici bellekte saklama
- **Seçici Dikkat**: Sadece en ilgili geçmiş bilgileri koruma

### Uzun Metin Erişim Testi

"İğne Cami Dolusu Samanlıkta" testi (Needle in a Haystack):

Uzun bir belgede belirli bir gerçeği gizleyerek, modelin tam metin erişimiyle bunu bulup bulamayacağını test etme.

\`\`\`
[Çok miktarda ilgisiz metin...]
[Gizlenmiş temel bilgi: "Kedinin rengi mavi"]
[Çok miktarda ilgisiz metin...]

Soru: Kedinin rengi nedir?
\`\`\`

## Gelecek Yönler

- **Sınırsız Bağlam**: Gerçek akış işleme
- **Akıl Yürütme Zamanı Genişletme**: Modeli "daha uzun düşündürme"
- **Dünya Modeli**: Dahili simülasyon ve planlama
- **Çok Ajan İşbirliği**: Birden fazla modelin karmaşık sorunları çözmek için işbirliği

Bkz. [[Transformer Mimarisi]], [[Model Değerlendirme]], [[Büyük Dil Modelleri Özeti]]`,
    tags: ["Akıl Yürütme", "Uzun Bağlam", "Ön Cephe", "o1"],
    source: "",
  },
]
